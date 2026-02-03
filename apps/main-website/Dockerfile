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
COPY apps/main-website/package.json ./apps/main-website/

RUN pnpm install --frozen-lockfile || pnpm install

COPY apps/main-website ./apps/main-website

ENV NODE_ENV=production
RUN pnpm --filter main-website build

# Runtime: standalone output only (no pnpm, minimal image)
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/apps/main-website/.next/standalone ./
COPY --from=builder /app/apps/main-website/.next/static ./apps/main-website/.next/static
COPY --from=builder /app/apps/main-website/public ./apps/main-website/public

WORKDIR /app/apps/main-website
EXPOSE 3000
CMD ["node", "server.js"]
