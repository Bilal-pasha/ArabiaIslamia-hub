FROM node:20-alpine AS builder
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

# Copy workspace metadata
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY .npmrc* ./

# Copy all packages first (including package.json)
COPY packages/database ./packages/database
COPY packages/storage ./packages/storage
COPY packages/email ./packages/email

# Copy app package.json first
COPY apps/secondary/api/package.json ./apps/secondary/api/

# Install dependencies (links workspace packages)
RUN pnpm install --frozen-lockfile || pnpm install

# Copy full app source
COPY apps/secondary/api ./apps/secondary/api

# Build shared packages first
RUN pnpm --filter @arabiaaislamia/database run build
RUN pnpm --filter @arabiaaislamia/storage run build
RUN pnpm --filter @arabiaaislamia/email run build

# Build NestJS app
RUN pnpm --filter secondary-api run build

# Deploy step: create folder and copy dist
RUN mkdir -p deploy/dist
RUN cp -r apps/secondary/api/dist/* deploy/dist/

# Copy entrypoint
COPY apps/secondary/api/scripts/entrypoint.sh deploy/entrypoint.sh
RUN chmod +x deploy/entrypoint.sh

# Final image
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/deploy .

ENV NODE_ENV=production
EXPOSE 8002
CMD ["./entrypoint.sh"]
