FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY .npmrc ./
COPY packages/ui ./packages/ui
COPY packages/animations ./packages/animations
COPY apps/secondary/app ./apps/secondary/app

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter secondary-app build

FROM node:20-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/secondary/app ./apps/secondary/app
COPY --from=builder /app/apps/secondary/app/.next ./apps/secondary/app/.next
COPY --from=builder /app/node_modules ./node_modules

WORKDIR /app/apps/secondary/app
ENV NODE_ENV=production
EXPOSE 3011
CMD ["pnpm", "run", "start"]
