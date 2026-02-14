# ArabiaaIslamia-SecPortal

Multi-project monorepo with **separate databases per project** (Huffaz, Secondary, future apps) and **independent NestJS API servers**.

## Architecture

- **One PostgreSQL instance** with multiple databases: `huffaz_db`, `secondary_db`, etc.
- **One API server per project**: `huffaz-api` (8001), `secondary-api` (8002)
- **Shared schema** via `@arabiaaislamia/database` package
- **pnpm** workspaces + **Turbo** for builds

See **[docs/MONOREPO-ARCHITECTURE.md](./docs/MONOREPO-ARCHITECTURE.md)** for full documentation.

## Project Structure

```
├── apps/
│   ├── main-website/
│   ├── huffaz/
│   │   ├── api/              # Huffaz backend (port 8001)
│   │   └── app/              # Huffaz frontend — hub, registration, fees, attendance (port 3001)
│   └── secondary/
│       ├── api/              # Secondary backend (port 8002)
│       └── app/              # Secondary frontend — hub, registration, fees, attendance (port 3011)
├── packages/
│   └── database/             # Shared entities, migrations
├── infra/                    # Docker, Caddy configs
└── docs/
```

## Quick Start

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start with Docker (dev)

```bash
cd infra/arabia-hub/dev
docker compose up -d
```

This starts PostgreSQL, both APIs, all frontend apps, and pgAdmin.

### 3. Run migrations

```bash
DB_HOST=localhost POSTGRES_USER=postgres POSTGRES_PASSWORD=postgres pnpm db:migrate:huffaz
DB_HOST=localhost POSTGRES_USER=postgres POSTGRES_PASSWORD=postgres pnpm db:migrate:secondary
```

### 4. URLs (dev)

**APIs**
- Huffaz API: http://localhost:8001
- Secondary API: http://localhost:8002
- Swagger: http://localhost:8001/api, http://localhost:8002/api

**Frontends**
- Main website: http://localhost:3000
- Huffaz app (hub, registration, fees, attendance): http://localhost:3001/huffaz
- Secondary app (hub, registration, fees, attendance): http://localhost:3011/secondary

**Tools**
- pgAdmin: http://localhost:5050

## Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm build` | Build all packages |
| `pnpm dev` | Run all apps in dev mode |
| `pnpm db:migrate:huffaz` | Run Huffaz DB migrations |
| `pnpm db:migrate:secondary` | Run Secondary DB migrations |

## Environment

Copy `.env.example` to `.env` and adjust values. See `.env.example` for all options.

## Documentation

- [MONOREPO-ARCHITECTURE.md](./docs/MONOREPO-ARCHITECTURE.md) — Architecture, databases, adding new projects
- [GitHub Actions Deployment](./docs/GITHUB_ACTIONS_DEPLOYMENT.md)
- [Caddy SSL](./docs/CADDY-SSL-CERTIFICATION.md)
- [Google OAuth Setup](./docs/GOOGLE_OAUTH_SETUP.md)
