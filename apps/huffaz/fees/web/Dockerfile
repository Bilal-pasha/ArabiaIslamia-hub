FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/huffaz/fees/web ./apps/huffaz/fees/web

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter huffaz-fees-web build

FROM node:20-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/huffaz/fees/web ./apps/huffaz/fees/web
COPY --from=builder /app/apps/huffaz/fees/web/.next ./apps/huffaz/fees/web/.next
COPY --from=builder /app/node_modules ./node_modules

WORKDIR /app/apps/huffaz/fees/web
ENV NODE_ENV=production
EXPOSE 3003
CMD ["pnpm", "run", "start"]
