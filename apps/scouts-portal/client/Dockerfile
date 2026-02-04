# Keep in sync with apps/secondary/client/Dockerfile (same structure; only paths/filter/port differ)
# Builder: same layout as Dockerfile.dev for reliable install, then production build
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

# Workspace root and lockfile (same as dev)
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY .npmrc* ./

# Workspace packages the app depends on (same as dev)
COPY packages/ui ./packages/ui
COPY packages/animations ./packages/animations

# App package.json first for better layer caching
COPY apps/scouts-portal/client/package.json ./apps/scouts-portal/client/

RUN pnpm install --frozen-lockfile || pnpm install

COPY apps/scouts-portal/client ./apps/scouts-portal/client

ENV NODE_ENV=production
RUN pnpm --filter scouts-portal-app build

# Runtime: standalone output only (no pnpm, minimal image)
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3012

COPY --from=builder /app/apps/scouts-portal/client/.next/standalone ./
COPY --from=builder /app/apps/scouts-portal/client/.next/static ./apps/scouts-portal/client/.next/static

WORKDIR /app/apps/scouts-portal/client
EXPOSE 3012
CMD ["node", "server.js"]
