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
COPY apps/main-website/client/package.json ./apps/main-website/client/

RUN pnpm config set network-timeout 120000 && pnpm install --frozen-lockfile || pnpm install

COPY apps/main-website/client ./apps/main-website/client

# NEXT_PUBLIC_* must be present at build time (Next.js inlines them into the client bundle)
ARG NEXT_PUBLIC_SECONDARY_APP_URL
ARG NEXT_PUBLIC_HUFFAZ_APP_URL
ARG NEXT_PUBLIC_SCOUTS_APP_URL
ARG NEXT_PUBLIC_MAIN_WEBSITE_API_URL
ENV NEXT_PUBLIC_SECONDARY_APP_URL=${NEXT_PUBLIC_SECONDARY_APP_URL}
ENV NEXT_PUBLIC_HUFFAZ_APP_URL=${NEXT_PUBLIC_HUFFAZ_APP_URL}
ENV NEXT_PUBLIC_SCOUTS_APP_URL=${NEXT_PUBLIC_SCOUTS_APP_URL}
ENV NEXT_PUBLIC_MAIN_WEBSITE_API_URL=${NEXT_PUBLIC_MAIN_WEBSITE_API_URL}

ENV NODE_ENV=production
RUN pnpm --filter main-website build

# Runtime: standalone output only (no pnpm, minimal image)
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/apps/main-website/client/.next/standalone ./
COPY --from=builder /app/apps/main-website/client/.next/static ./apps/main-website/client/.next/static

WORKDIR /app/apps/main-website/client
EXPOSE 3000
CMD ["node", "server.js"]
