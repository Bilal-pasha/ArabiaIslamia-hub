FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/huffaz/registration/web ./apps/huffaz/registration/web

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter huffaz-registration-web build

FROM node:20-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/huffaz/registration/web ./apps/huffaz/registration/web
COPY --from=builder /app/apps/huffaz/registration/web/.next ./apps/huffaz/registration/web/.next
COPY --from=builder /app/node_modules ./node_modules

WORKDIR /app/apps/huffaz/registration/web
ENV NODE_ENV=production
EXPOSE 3002
CMD ["pnpm", "run", "start"]
