FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/main-website ./apps/main-website

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter main-website build

FROM node:20-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/main-website ./apps/main-website
COPY --from=builder /app/apps/main-website/.next ./apps/main-website/.next
COPY --from=builder /app/node_modules ./node_modules

WORKDIR /app/apps/main-website
ENV NODE_ENV=production
EXPOSE 3000
CMD ["pnpm", "run", "start"]
