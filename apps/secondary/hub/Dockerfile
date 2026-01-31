FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/secondary/hub ./apps/secondary/hub

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter secondary-hub build

FROM node:20-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/secondary/hub ./apps/secondary/hub
COPY --from=builder /app/apps/secondary/hub/.next ./apps/secondary/hub/.next
COPY --from=builder /app/node_modules ./node_modules

WORKDIR /app/apps/secondary/hub
ENV NODE_ENV=production
EXPOSE 3011
CMD ["pnpm", "run", "start"]
