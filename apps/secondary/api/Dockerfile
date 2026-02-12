# Builder stage
FROM node:20-alpine AS builder
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

# Copy workspace metadata
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY .npmrc* ./

# Copy packages
COPY packages/database ./packages/database
COPY packages/storage ./packages/storage
COPY packages/email ./packages/email

# Copy app package.json
COPY apps/secondary/api/package.json ./apps/secondary/api/

# Install dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# Copy full app source
COPY apps/secondary/api ./apps/secondary/api

# Build shared packages
RUN pnpm --filter @arabiaaislamia/database run build
RUN pnpm --filter @arabiaaislamia/storage run build
RUN pnpm --filter @arabiaaislamia/email run build

# Build app
RUN pnpm --filter secondary-api run build

# Deploy folder: use pnpm deploy so node_modules has typeorm and all deps (no symlinks)
RUN pnpm --filter secondary-api deploy --prod deploy
RUN cp -r apps/secondary/api/dist deploy/dist
# Copy database package dist so migration entrypoint can run data-source.secondary.js (entities + migrations paths use __dirname)
RUN cp -r packages/database/dist/* deploy/dist/
COPY apps/secondary/api/scripts/entrypoint.sh deploy/entrypoint.sh
RUN chmod +x deploy/entrypoint.sh

# Runtime stage
FROM node:20-alpine
WORKDIR /app

# Copy deploy from builder
COPY --from=builder /app/deploy .

ENV NODE_ENV=production
EXPOSE 8002

CMD ["./entrypoint.sh"]
