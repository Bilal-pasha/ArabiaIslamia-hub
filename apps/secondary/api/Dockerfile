FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY .npmrc* ./
COPY packages/database ./packages/database
COPY packages/storage ./packages/storage
COPY apps/secondary/api/package.json ./apps/secondary/api/

RUN pnpm install --frozen-lockfile || pnpm install

COPY apps/secondary/api ./apps/secondary/api

RUN pnpm --filter @arabiaaislamia/database run build
RUN pnpm --filter @arabiaaislamia/storage run build
RUN pnpm --filter secondary-api build

FROM node:20-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY --from=builder /app/apps/secondary/api/dist ./dist
COPY --from=builder /app/apps/secondary/api/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/database ./packages/database
COPY --from=builder /app/packages/storage ./packages/storage

ENV NODE_ENV=production
EXPOSE 8002
CMD ["node", "dist/main.js"]
