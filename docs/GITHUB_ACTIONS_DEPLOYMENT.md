# GitHub Actions Deployment Guide

This guide explains how to set up automated build and deployment to Google Cloud Platform (GCE) using GitHub Actions.

## Overview

The deployment workflow:
1. **Build**: Builds the Docker image for the server and pushes it to GitHub Container Registry (GHCR)
2. **Deploy**: SSHs into the GCE instance and updates the running containers

## Domain and DNS (jamiaarabiaislamia.com)

The production Caddyfile uses dedicated API subdomains:

| URL | Service |
|-----|---------|
| **https://jamiaarabiaislamia.com** | Main website |
| **https://api.jamiaarabiaislamia.com** | Main website API (backend) |
| **https://huffaz.jamiaarabiaislamia.com** | Huffaz UI |
| **https://api.huffaz.jamiaarabiaislamia.com** | Huffaz API (backend) |
| **https://secondary.jamiaarabiaislamia.com** | Secondary UI |
| **https://api.secondary.jamiaarabiaislamia.com** | Secondary API (backend) |

**DNS (e.g. Hostinger):** Add A records pointing to your server public IP:

- `jamiaarabiaislamia.com`
- `api.jamiaarabiaislamia.com`
- `huffaz.jamiaarabiaislamia.com`
- `api.huffaz.jamiaarabiaislamia.com`
- `secondary.jamiaarabiaislamia.com`
- `api.secondary.jamiaarabiaislamia.com`

Remove any "parked domain" or parking page so traffic goes to your server. Caddy will obtain TLS certificates from Let's Encrypt automatically.

**Backend API URLs (server .env):**

- `MAIN_WEBSITE_API_URL=https://api.jamiaarabiaislamia.com`
- `SECONDARY_API_URL=https://api.secondary.jamiaarabiaislamia.com`
- `HUFFAZ_API_URL=https://api.huffaz.jamiaarabiaislamia.com`

**Frontend API base URL (build-time for Next.js apps):**

- Main website: `NEXT_PUBLIC_MAIN_WEBSITE_API_URL=https://api.jamiaarabiaislamia.com` (when the main site calls a backend)
- Secondary UI: `NEXT_PUBLIC_API_URL=https://api.secondary.jamiaarabiaislamia.com`
- Huffaz UI: `NEXT_PUBLIC_API_URL=https://api.huffaz.jamiaarabiaislamia.com` (paths use `/api/...`)

---

## Prerequisites

1. **Google Cloud Project** with billing enabled
2. **GCE e2-micro instance** running Ubuntu/Debian
3. **GitHub Repository** with Actions enabled
4. **Service Account** with necessary permissions

## Setup Steps

### 1. Create Google Cloud Service Account

```bash
# Create service account
gcloud iam service-accounts create github-actions-deploy \
    --display-name="GitHub Actions Deployment"

# Grant necessary permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:github-actions-deploy@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/compute.instanceAdmin.v1"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:github-actions-deploy@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:github-actions-deploy@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"

# Create and download key
gcloud iam service-accounts keys create github-actions-key.json \
    --iam-account=github-actions-deploy@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### 2. GitHub Container Registry Setup

No additional setup needed! The workflow uses GitHub Container Registry (GHCR) which is automatically available for your repository. Images will be published to `ghcr.io/<your-org>/<your-repo>/server`.

**Note**: Make sure your repository has GitHub Packages enabled (Settings → General → Features → Packages).

### 3. Set Up GCE Instance

```bash
# Create instance
gcloud compute instances create arabiaaislamia-hub-instance \
    --zone=us-central1-a \
    --machine-type=e2-micro \
    --boot-disk-size=20GB \
    --boot-disk-type=pd-standard \
    --image-family=ubuntu-2204-lts \
    --image-project=ubuntu-os-cloud \
    --tags=http-server,https-server

# Add firewall rules
gcloud compute firewall-rules create allow-http \
    --allow tcp:80 \
    --source-ranges 0.0.0.0/0 \
    --target-tags http-server

gcloud compute firewall-rules create allow-https \
    --allow tcp:443 \
    --source-ranges 0.0.0.0/0 \
    --target-tags https-server
```

### 4. Prepare GCE Instance

SSH into your instance and run:

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create application directory
sudo mkdir -p /opt/arabiaaislamia-hub/config
sudo chown -R $USER:$USER /opt/arabiaaislamia-hub
```

### 5. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `GCP_PROJECT_ID` | Your GCP project ID | `my-project-12345` |
| `GCP_SA_KEY` | Service account JSON key (full content) | `{"type":"service_account",...}` |
| `GCE_INSTANCE_NAME` | GCE instance name | `arabiaaislamia-hub-instance` |
| `GCE_INSTANCE_ZONE` | GCE instance zone | `us-central1-a` |
| `GCE_SSH_USER` | SSH username for GCE | `ubuntu` or `your-username` |
| `GCE_INSTANCE_URL` | (Optional) Public URL of your instance | `https://your-domain.com` |

**Note**: `GITHUB_TOKEN` is automatically provided by GitHub Actions - no need to set it manually.

**To get GCP_SA_KEY:**
```bash
cat github-actions-key.json | jq -c
# Copy the entire output
```

### 6. Environment Variables (Optional)

For production environment secrets, add environment-specific variables:

- `JWT_SECRET`: Your JWT secret key
- `JWT_REFRESH_SECRET`: Your JWT refresh secret key
- `POSTGRES_PASSWORD`: Database password
- `REDIS_PASSWORD`: Redis password
- `PGADMIN_PASSWORD`: PgAdmin password

## Workflow Trigger

The workflow triggers on:
- Push to `main` or `master` branch
- Manual trigger via GitHub Actions UI (workflow_dispatch)

## Deployment Process

1. **Build Job**:
   - Checks out code
   - Authenticates with GitHub Container Registry (GHCR)
   - Builds Docker image
   - Pushes to GHCR (`ghcr.io/<org>/<repo>/server`)

2. **Deploy Job**:
   - Generates temporary SSH key
   - Adds SSH key to GCE instance
   - Copies deployment files
   - Executes deployment script
   - Verifies deployment

## Troubleshooting

### SSH Connection Issues

If SSH fails, ensure:
- GCE instance allows SSH (default firewall rules)
- Service account has `compute.instances.addAccessConfig` permission
- Instance metadata allows SSH keys

### Docker Image Pull Issues

If image pull fails:
```bash
# On GCE instance, manually authenticate to GHCR:
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# Or create a Personal Access Token (PAT) with read:packages permission
# Settings → Developer settings → Personal access tokens → Tokens (classic)
```

### GHCR 403 Forbidden when pushing images

If the build fails with:

```text
failed to push ghcr.io/.../arabiaislamia-hub-scouts-portal-app:latest: 403 Forbidden
```

the workflow’s token doesn’t have permission to push to GitHub Container Registry. Fix it in one of these ways:

1. **Link the package to the repository (recommended)**  
   - Go to **GitHub** → your profile or org → **Packages**.  
   - Open the package (e.g. `arabiaislamia-hub-scouts-portal-app`).  
   - **Package settings** → **Manage Actions access** → **Add repository** and select this repo.  
   This allows the repo’s `GITHUB_TOKEN` to push to that package. Repeat for each image (main-website, secondary-api, secondary-app, scouts-portal-api, scouts-portal-app) if they appear as separate packages.

2. **Use a Personal Access Token (PAT)**  
   If the package is under an organization that restricts `GITHUB_TOKEN`:  
   - Create a PAT: **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)** with scopes `write:packages` and `read:packages`.  
   - In the repo: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**, name it `CR_PAT`, value = the PAT.  
   - The build workflow is set up to use `CR_PAT` for GHCR login when the secret exists; no workflow edit needed.

After linking the repo or adding `CR_PAT`, re-run the **Build Docker Images** workflow.

### Permission Errors

Ensure the service account has:
- `compute.instanceAdmin.v1`
- `iam.serviceAccountUser`

**For GHCR**: Make sure your repository's GitHub Packages are accessible. If using a private repo, ensure the GCE instance can authenticate (the workflow handles this automatically during deployment).

### Disk Space Issues (e2-micro)

The e2-micro instance has limited resources:
```bash
# Clean up old Docker images periodically
docker system prune -af
docker volume prune -f
```

## Manual Deployment

To deploy manually without GitHub Actions:

```bash
# On your local machine
export IMAGE_URL="ghcr.io/YOUR_ORG/YOUR_REPO/server:latest"
export GITHUB_TOKEN="your_github_token"

# Copy files to server
scp infra/prod/docker-compose.yml user@instance:/opt/arabiaaislamia-hub/
scp infra/prod/config/Caddyfile user@instance:/opt/arabiaaislamia-hub/config/

# SSH and deploy
ssh user@instance
cd /opt/arabiaaislamia-hub

# Authenticate to GHCR
echo "$GITHUB_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# Update docker-compose.yml with image
sed -i 's|image:.*SERVER_IMAGE.*|image: '"$IMAGE_URL"'|g' docker-compose.yml

# Deploy
docker-compose pull
docker-compose up -d
```

## Monitoring

Check deployment logs:
```bash
# On GCE instance
cd /opt/arabiaaislamia-hub
docker-compose logs -f server
tail -f deployment.log
```

## Security Best Practices

1. **Use strong secrets**: Generate strong passwords for all services
2. **Limit SSH access**: Use firewall rules to limit SSH access
3. **Regular updates**: Keep your GCE instance updated
4. **Backup volumes**: Regularly backup Docker volumes
5. **Monitor logs**: Set up log monitoring and alerts
6. **Rotate secrets**: Regularly rotate JWT secrets and passwords

## Cost Optimization

For e2-micro instances:
- Use Docker image caching
- Monitor disk usage
- Use lightweight base images
- Consider upgrading if resource constrained

## Support

For issues, check:
1. GitHub Actions logs
2. GCE instance logs: `journalctl -u docker`
3. Docker logs: `docker-compose logs`
4. Deployment log: `/opt/arabiaaislamia-hub/deployment.log`

