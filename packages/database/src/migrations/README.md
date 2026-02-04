# Per-project migrations

Each project (school) has its own migration folder. Only migrations in that folder run against that project’s database.

| Folder       | Database       | Use when |
|-------------|----------------|----------|
| `secondary/` | `secondary_db` | Changing secondary app schema |
| `huffaz/`    | `huffaz_db`    | Changing huffaz app schema   |

**Run migrations** (from repo root): `pnpm --filter @arabiaaislamia/database run migrate:secondary` (or `migrate:huffaz`, `migrate:scouts-portal`). For production, ensure DB env vars are set.

Add or remove migrations per project as needed. One project can have tables (or columns) that the other doesn’t.
