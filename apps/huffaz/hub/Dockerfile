FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/huffaz/hub ./apps/huffaz/hub

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter huffaz-hub build

FROM node:20-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/huffaz/hub ./apps/huffaz/hub
COPY --from=builder /app/apps/huffaz/hub/.next ./apps/huffaz/hub/.next
COPY --from=builder /app/node_modules ./node_modules

WORKDIR /app/apps/huffaz/hub
ENV NODE_ENV=production
EXPOSE 3001
CMD ["pnpm", "run", "start"]
