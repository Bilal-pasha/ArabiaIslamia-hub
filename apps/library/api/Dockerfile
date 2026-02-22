# Library API: same structure as scouts-portal-api but no @arabiaaislamia/storage
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY .npmrc* ./
COPY packages/database ./packages/database
COPY packages/storage ./packages/storage
COPY apps/library/api/package.json ./apps/library/api/

RUN pnpm install --frozen-lockfile || pnpm install

COPY apps/library/api ./apps/library/api

RUN pnpm --filter @arabiaaislamia/database run build
RUN pnpm --filter @arabiaaislamia/storage run build
RUN pnpm --filter library-api build

RUN pnpm --filter library-api deploy --prod deploy && cp -r apps/library/api/dist deploy/dist

COPY apps/library/api/scripts/entrypoint.sh deploy/entrypoint.sh
RUN chmod +x deploy/entrypoint.sh

FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache postgresql-client

COPY --from=builder /app/deploy .

ENV NODE_ENV=production
EXPOSE 8004
CMD ["./entrypoint.sh"]
