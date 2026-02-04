# Per-project migrations

Each project (school) has its own migration folder. Only migrations in that folder run against that project’s database.

| Folder       | Database       | Use when |
|-------------|----------------|----------|
| `secondary/` | `secondary_db` | Changing secondary app schema |
| `huffaz/`    | `huffaz_db`    | Changing huffaz app schema   |

- **Run secondary migrations:** `npm run migrate:secondary` (from `packages/database`)
- **Run huffaz migrations:** `npm run migrate:huffaz` (from `packages/database`)

Add or remove migrations per project as needed. One project can have tables (or columns) that the other doesn’t.
