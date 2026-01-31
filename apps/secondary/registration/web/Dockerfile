FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/secondary/registration/web ./apps/secondary/registration/web

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter secondary-registration-web build

FROM node:20-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/secondary/registration/web ./apps/secondary/registration/web
COPY --from=builder /app/apps/secondary/registration/web/.next ./apps/secondary/registration/web/.next
COPY --from=builder /app/node_modules ./node_modules

WORKDIR /app/apps/secondary/registration/web
ENV NODE_ENV=production
EXPOSE 3012
CMD ["pnpm", "run", "start"]
