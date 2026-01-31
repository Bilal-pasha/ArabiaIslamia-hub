# ArabiaaIslamia-SecPortal — Monorepo Architecture

## Overview

This monorepo uses **separate databases per project** (Huffaz, Secondary, and future projects) with **independent backend servers**. Each project has its own PostgreSQL database and NestJS API server.

---

## Table of Contents

1. [Architecture](#1-architecture)
2. [Project Structure](#2-project-structure)
3. [Databases](#3-databases)
4. [API Servers](#4-api-servers)
5. [Package Management (pnpm)](#5-package-management-pnpm)
6. [Adding a New Project](#6-adding-a-new-project)
7. [Development](#7-development)
8. [Deployment](#8-deployment)

---

## 1. Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     SEPARATE DATABASES                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │
│  │   huffaz_db     │  │  secondary_db   │  │  future_db      │      │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘      │
└───────────┼────────────────────┼────────────────────┼───────────────┘
            │                    │                    │
     ┌──────┴──────┐      ┌──────┴──────┐      ┌──────┴──────┐
     │  huffaz-api │      │secondary-api│      │ future-api  │
     │  (port 8001)│      │ (port 8002) │      │ (port 8xxx) │
     └──────┬──────┘      └──────┬──────┘      └─────────────┘
            │                    │
     ┌──────┴────────────────────┴──────┐
     │         Caddy / Reverse Proxy     │
     └──────────────────────────────────┘
```

- **One PostgreSQL instance** with multiple databases
- **One API server per project** — independent deploy and scale
- **Shared schema** via `@arabiaaislamia/database` package

---

## 2. Project Structure

```
ArabiaIslamia-SecPortal/
├── apps/
│   ├── main-website/         # example.com
│   ├── huffaz/               # Huffaz project
│   │   ├── api/              # Huffaz backend (NestJS, port 8001)
│   │   ├── hub/              # huffaz.example.com frontend
│   │   ├── registration/
│   │   │   └── web/          # registration.huffaz.example.com
│   │   ├── fees/
│   │   │   └── web/          # fees.huffaz.example.com
│   │   └── attendance/
│   │       └── web/          # attendance.huffaz.example.com
│   └── secondary/            # Secondary project
│       ├── api/              # Secondary backend (NestJS, port 8002)
│       ├── hub/              # secondary.example.com frontend
│       ├── registration/
│       │   └── web/
│       ├── fees/
│       │   └── web/
│       └── attendance/
│           └── web/
├── packages/
│   └── database/             # Shared entities, migrations, config
├── infra/
│   ├── dev/
│   │   ├── docker-compose.yml
│   │   └── init-databases.sh
│   └── prod/
│       ├── docker-compose.prod.yml
│       ├── init-databases.sh
│       └── config/
│           └── Caddyfile
├── pnpm-workspace.yaml
├── package.json
├── turbo.json
└── docs/
```

---

## 3. Databases

### Database per project

| Project   | Dev database      | Prod database  |
|----------|-------------------|----------------|
| Huffaz   | `huffaz_db_dev`   | `huffaz_db`    |
| Secondary| `secondary_db_dev`| `secondary_db` |

### Configuration

- **Env vars**  
  - `HUFFAZ_DB_NAME`, `SECONDARY_DB_NAME` — override DB names  
  - `DB_HOST`, `POSTGRES_USER`, `POSTGRES_PASSWORD` — connection
- **Migrations**  
  Run per project:
  ```bash
  pnpm db:migrate:huffaz
  pnpm db:migrate:secondary
  ```

### `packages/database`

- `src/entities/` — User, Class, Student, etc.
- `src/migrations/` — schema migrations
- `src/config.ts` — `createDataSourceOptions(project)`, `getDatabaseName(project)`
- `src/data-source.huffaz.ts`, `src/data-source.secondary.ts` — CLI data sources

---

## 4. API Servers

- **huffaz-api** (8001): auth, school portal modules for Huffaz
- **secondary-api** (8002): same modules for Secondary

Both use `@arabiaaislamia/database` and connect to their own DB via `createDataSourceOptions('huffaz')` or `createDataSourceOptions('secondary')`.

---

## 5. Package Management (pnpm)

### Workspace

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'apps/*/*'
  - 'apps/*/*/*'
  - 'packages/*'
```

### Commands

```bash
pnpm install
pnpm build
pnpm dev
pnpm db:migrate:huffaz
pnpm db:migrate:secondary
```

---

## 6. Adding a New Project

1. **Database**
   - Add project to `ProjectId` in `packages/database/src/config.ts`
   - Add entry to `PROJECT_DB_MAP`
   - Create `data-source.<project>.ts`
   - Add `migrate:<project>` script in `packages/database/package.json`
   - Add DB creation in `infra/dev/init-databases.sh` and `infra/prod/init-databases.sh`

2. **API**
   - Copy `apps/huffaz/api` to `apps/<project>/api`
   - Update `typeorm-config.ts` to use `createDataSourceOptions('<project>')`
   - Update `package.json` name
   - Add service in `infra/dev/docker-compose.yml` and `infra/prod/docker-compose.prod.yml`

3. **Caddy**
   - Add routes in `infra/prod/config/Caddyfile`

---

## 7. Development

### Start services

```bash
cd infra/dev
docker compose up -d
```

Creates:

- PostgreSQL with `huffaz_db_dev` and `secondary_db_dev`
- `huffaz-api` on 8001
- `secondary-api` on 8002
- pgAdmin on 5050

### Run migrations

```bash
# From repo root
DB_HOST=localhost POSTGRES_USER=postgres POSTGRES_PASSWORD=postgres \
  pnpm db:migrate:huffaz
pnpm db:migrate:secondary
```

### Local API

```bash
pnpm install
pnpm --filter @arabiaaislamia/database build
pnpm --filter huffaz-api run start:dev
pnpm --filter secondary-api run start:dev
```

---

## 8. Deployment

- **Docker images**: build `huffaz-api` and `secondary-api`
- **Postgres**: use `init-databases.sh` to create DBs
- **Caddy**: path-based or subdomain routing
- **Env vars**: `HUFFAZ_DB_NAME`, `SECONDARY_DB_NAME`, JWT secrets, etc.

See `docs/GITHUB_ACTIONS_DEPLOYMENT.md` for CI/CD.

---

*Last updated: January 2025*
