FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/secondary/attendance/web ./apps/secondary/attendance/web

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter secondary-attendance-web build

FROM node:20-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/secondary/attendance/web ./apps/secondary/attendance/web
COPY --from=builder /app/apps/secondary/attendance/web/.next ./apps/secondary/attendance/web/.next
COPY --from=builder /app/node_modules ./node_modules

WORKDIR /app/apps/secondary/attendance/web
ENV NODE_ENV=production
EXPOSE 3014
CMD ["pnpm", "run", "start"]
