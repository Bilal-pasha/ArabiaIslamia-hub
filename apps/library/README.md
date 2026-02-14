# Library App

کتب خانہ – جامعہ عربیہ اسلامیہ لائبریری (books and issues management).

## First-time login (super admin)

After running library migrations, a default admin user is seeded:

- **Username:** `admin`
- **Password:** `Admin123!`

Change the password after first login. The seed is in `packages/database/src/migrations/library/1739500001000-SeedLibrarySuperadmin.ts`.

## Run migrations

From repo root:

```bash
pnpm --filter @arabiaaislamia/database run migrate:library
```

Ensure the library database env vars are set (see `infra/library/`).
