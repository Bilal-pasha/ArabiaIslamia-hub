FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY .npmrc* ./
COPY packages/database ./packages/database
COPY packages/storage ./packages/storage
COPY apps/main-website/api/package.json ./apps/main-website/api/

RUN pnpm install --frozen-lockfile || pnpm install

COPY apps/main-website/api ./apps/main-website/api

RUN pnpm --filter @arabiaaislamia/database run build
RUN pnpm --filter @arabiaaislamia/storage run build
RUN pnpm --filter main-website-api build

RUN pnpm --filter main-website-api deploy --prod deploy && cp -r apps/main-website/api/dist deploy/dist

COPY apps/main-website/api/scripts/entrypoint.sh deploy/entrypoint.sh
RUN chmod +x deploy/entrypoint.sh

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/deploy .

ENV NODE_ENV=production
EXPOSE 8000
CMD ["./entrypoint.sh"]
