# Library server (different server)

Deploy the library app at **library.jamiaarabiaislamia.com** and **api.library.jamiaarabiaislamia.com** on a **separate** host from the main hub.

## Prerequisites

- Docker and Docker Compose on the server
- DNS: point `library.jamiaarabiaislamia.com` and `api.library.jamiaarabiaislamia.com` to this server’s IP
- Images built and pushed (e.g. by CI): `*-library-api:latest`, `*-library-app:latest`

## Setup

1. Copy `.env.example` to `.env` and set:
   - `REGISTRY`, `IMAGE_NAME_LOWER` (e.g. `ghcr.io/your-org/arabiaIslamia`)
   - `POSTGRES_USER`, `POSTGRES_PASSWORD`
   - `JWT_SECRET`, `JWT_REFRESH_SECRET`
   - `COOKIE_DOMAIN=.jamiaarabiaislamia.com`
   - `CORS_ORIGIN=https://library.jamiaarabiaislamia.com`

2. Ensure the library app image was built with:
   - `NEXT_PUBLIC_LIBRARY_API_URL=https://api.library.jamiaarabiaislamia.com`  
   (set in GitHub Actions vars and build-args for `build-library-app`)

3. On the server:
   ```bash
   cd infra/library/prod
   docker compose pull
   docker compose up -d
   ```

4. Create the first library user (librarian) via API:
   ```bash
   curl -X POST https://api.library.jamiaarabiaislamia.com/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"your-secure-password"}'
   ```
   Then log in at https://library.jamiaarabiaislamia.com/login.

## Services

| Service       | Port (internal) | Role                          |
|---------------|-----------------|-------------------------------|
| postgres      | 5432            | Database; creates `library_db` |
| library-api   | 8004            | NestJS API (books, issues, auth) |
| library-app   | 3013            | Next.js UI                    |
| caddy         | 80, 443         | TLS and reverse proxy         |

Caddy serves:
- `library.jamiaarabiaislamia.com` → library-app:3013  
- `api.library.jamiaarabiaislamia.com` → library-api:8004  

## Troubleshooting

**Postgres unhealthy / dependency failed to start**

1. Ensure `.env` has `POSTGRES_PASSWORD` set (required). If missing, `docker compose up` will fail with a clear error.
2. On the server, check Postgres logs:
   ```bash
   docker logs library-postgres
   ```
   Look for: “port 5432 already in use” (stop host Postgres or change compose port), “POSTGRES_PASSWORD”, or init script errors.
3. If the volume was created with a different password, remove it and redeploy (data will be recreated from init):
   ```bash
   docker compose -f docker-compose.yml down -v
   # then up again
   ```
