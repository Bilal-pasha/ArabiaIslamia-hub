# Scouts Portal API

NestJS API for the Scouts Portal. Uses PostgreSQL (TypeORM) and R2 for file storage.

## Environment

Required env vars (use `infra/dev/.env` or `infra/prod/.env` as reference):

- **Database:** `DB_HOST`, `DB_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `SCOUTS_PORTAL_DB_NAME`
- **Auth:** `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES_IN`
- **R2 (file uploads):** `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` (default: `scouts-files`)

File uploads use presigned PUT/GET URLs via `@arabiaaislamia/storage` (Cloudflare R2). If R2 vars are missing, upload endpoints will return an error.
