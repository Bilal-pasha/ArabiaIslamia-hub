# Library dev (Docker Compose)

Run the library stack locally: Postgres, library-api (NestJS), library-app (Next.js) with hot reload.

## Prerequisites

- Docker and Docker Compose
- From repo root, ensure `packages/database` and `apps/library` exist

## Setup

1. Copy `.env.example` to `.env` in this directory (optional; defaults work).
2. From **repo root**:
   ```bash
   docker compose -f infra/library/dev/docker-compose.yml up -d
   ```
   Or:
   ```bash
   cd infra/library/dev
   docker compose up -d
   ```

## Ports

| Service     | Port | URL                    |
|------------|------|------------------------|
| library-api | 8004 | http://localhost:8004 |
| library-app | 3013 | http://localhost:3013 |
| postgres    | 5434 | localhost:5434 (host)  |

Postgres is exposed on **5434** on the host to avoid conflict with `infra/arabia-hub/dev` (5432).

## First user

After the API is up, create a librarian:

```bash
curl -X POST http://localhost:8004/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"yourpassword"}'
```

Then open http://localhost:3013 and log in.

## Restore backup

From repo root, to restore a backup (performs clean restore: drops and recreates `library_db`):

```bash
# Pass the backup file path (supports .sql and .sql.gz)
pnpm library:restore -- library_db_backup_library_db_2026-02-22_095905.sql

# Or run the script directly
./infra/library/restore-backup.sh path/to/backup.sql
```

## Stop

```bash
docker compose -f infra/library/dev/docker-compose.yml down
```

Add `-v` to remove the Postgres volume.
