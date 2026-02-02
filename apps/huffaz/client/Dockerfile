FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY .npmrc ./
COPY apps/huffaz/app ./apps/huffaz/app

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter huffaz-app build

FROM node:20-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/huffaz/app ./apps/huffaz/app
COPY --from=builder /app/apps/huffaz/app/.next ./apps/huffaz/app/.next
COPY --from=builder /app/node_modules ./node_modules

WORKDIR /app/apps/huffaz/app
ENV NODE_ENV=production
EXPOSE 3001
CMD ["pnpm", "run", "start"]
