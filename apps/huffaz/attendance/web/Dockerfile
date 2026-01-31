FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/huffaz/attendance/web ./apps/huffaz/attendance/web

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter huffaz-attendance-web build

FROM node:20-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/huffaz/attendance/web ./apps/huffaz/attendance/web
COPY --from=builder /app/apps/huffaz/attendance/web/.next ./apps/huffaz/attendance/web/.next
COPY --from=builder /app/node_modules ./node_modules

WORKDIR /app/apps/huffaz/attendance/web
ENV NODE_ENV=production
EXPOSE 3004
CMD ["pnpm", "run", "start"]
