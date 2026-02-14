# Builder: Debian slim avoids @next/swc-linux-x64-musl (Alpine) and uses -gnu binary
FROM node:20-slim AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

# Workspace root and lockfile (same as dev)
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY .npmrc* ./

# Workspace packages the app depends on (same as dev)
COPY packages/ui ./packages/ui
COPY packages/animations ./packages/animations

# App package.json first for better layer caching
COPY apps/secondary/client/package.json ./apps/secondary/client/

RUN pnpm config set network-timeout 120000 && pnpm install --frozen-lockfile || pnpm install

COPY apps/secondary/client ./apps/secondary/client

# NEXT_PUBLIC_* must be present at build time (Next.js inlines them into the client bundle)
ARG NEXT_PUBLIC_SECONDARY_API_URL
ENV NEXT_PUBLIC_SECONDARY_API_URL=${NEXT_PUBLIC_SECONDARY_API_URL}

RUN pnpm --filter secondary-app build

# Runtime: standalone output only (no pnpm, minimal image)
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3011

COPY --from=builder /app/apps/secondary/client/.next/standalone ./
COPY --from=builder /app/apps/secondary/client/.next/static ./apps/secondary/client/.next/static

WORKDIR /app/apps/secondary/client
EXPOSE 3011
CMD ["node", "server.js"]
