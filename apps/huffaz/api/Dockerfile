FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY packages/database ./packages/database
COPY apps/huffaz/api ./apps/huffaz/api

# Install and build
RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @arabiaaislamia/database build
RUN pnpm --filter huffaz-api build

FROM node:20-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY --from=builder /app/apps/huffaz/api/dist ./dist
COPY --from=builder /app/apps/huffaz/api/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/database ./packages/database

ENV NODE_ENV=production
EXPOSE 8001
CMD ["node", "dist/main.js"]
