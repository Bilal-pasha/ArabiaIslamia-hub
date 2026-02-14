# Deploy Library to GCP (Cloud Run)

The workflow **deploy-library-gcp.yml** deploys the library API and library app to Google Cloud Run after the Build workflow completes (or on manual run).

## Prerequisites

1. **GCP project** with Cloud Run and Artifact Registry enabled.
2. **Artifact Registry** repository (e.g. `library` or your chosen name) in the same region you deploy to.
3. **Postgres**: Cloud SQL or any Postgres reachable from Cloud Run (e.g. private IP or public with authorized networks). Run the library migrations (`pnpm db:migrate:library`) against this DB and ensure `library_db` exists.
4. **Service account** with roles: `Cloud Run Admin`, `Storage Admin` (for Artifact Registry), `Service Account User`. Create a key and store the JSON as a GitHub secret.

## GitHub configuration

### Secrets (Settings → Secrets and variables → Actions)

| Secret | Description |
|--------|-------------|
| `GCP_SA_KEY` | JSON key of the GCP service account (full contents). |
| `LIBRARY_POSTGRES_PASSWORD` | Postgres password for the library DB. |
| `LIBRARY_JWT_SECRET` | JWT signing secret for library API. |
| `LIBRARY_JWT_REFRESH_SECRET` | JWT refresh token secret. |
| `LIBRARY_DB_HOST` | (Optional) Postgres host (e.g. Cloud SQL private IP). Can use a variable instead. |
| `LIBRARY_POSTGRES_USER` | (Optional) Postgres user. Can use a variable instead. |

### Variables (Settings → Secrets and variables → Actions → Variables)

| Variable | Description |
|----------|-------------|
| `GCP_PROJECT_ID` | Your GCP project ID. |
| `GCP_LIBRARY_REGION` | (Optional) Cloud Run region, e.g. `us-central1`. |
| `GCP_ARTIFACT_REPO` | (Optional) Artifact Registry repo name (default: `library`). |
| `LIBRARY_DB_NAME` | (Optional) Database name (default: `library_db`). |
| `LIBRARY_CORS_ORIGIN` | (Optional) CORS origin for the API (default: `https://library.jamiaarabiaislamia.com`). |
| `LIBRARY_COOKIE_DOMAIN` | (Optional) Cookie domain (default: `.jamiaarabiaislamia.com`). |
| `LIBRARY_APP_API_URL` | (Optional) Full URL of the library API Cloud Run service (e.g. `https://library-api-xxx.run.app`). If not set, the workflow uses the URL of the deployed library-api service. |

## Flow

1. Pulls `library-api` and `library-app` images from GitHub Container Registry (GHCR).
2. Tags and pushes them to Google Artifact Registry (GAR).
3. Deploys **library-api** to Cloud Run with the configured env vars.
4. Deploys **library-app** to Cloud Run with `NEXT_PUBLIC_LIBRARY_API_URL` pointing to the library-api URL.

## Custom domain (library.jamiaarabiaislamia.com)

Map your domain to the Cloud Run services in GCP (Cloud Run → service → Manage custom domains). Use a load balancer or Cloud Run domain mapping as needed for `library.jamiaarabiaislamia.com` and `api.library.jamiaarabiaislamia.com`.
