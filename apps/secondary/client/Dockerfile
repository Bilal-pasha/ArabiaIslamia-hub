FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY .npmrc ./
COPY packages/ui ./packages/ui
COPY packages/animations ./packages/animations
COPY apps/secondary/client/package.json ./apps/secondary/client/

RUN pnpm install --frozen-lockfile || pnpm install

COPY apps/secondary/client ./apps/secondary/client

RUN pnpm --filter secondary-app build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3011

COPY --from=builder /app/apps/secondary/client/.next/standalone ./
COPY --from=builder /app/apps/secondary/client/.next/static ./apps/secondary/client/.next/static

WORKDIR /app/apps/secondary/client
EXPOSE 3011
CMD ["node", "server.js"]
