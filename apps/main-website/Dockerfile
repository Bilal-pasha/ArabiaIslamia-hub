FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY .npmrc* ./
COPY packages/ui ./packages/ui
COPY packages/animations ./packages/animations
COPY apps/main-website/package.json ./apps/main-website/

RUN pnpm install --frozen-lockfile || pnpm install

COPY apps/main-website ./apps/main-website

RUN pnpm --filter main-website build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/apps/main-website/.next/standalone ./
COPY --from=builder /app/apps/main-website/.next/static ./apps/main-website/.next/static
COPY --from=builder /app/apps/main-website/public ./apps/main-website/public

WORKDIR /app/apps/main-website
EXPOSE 3000
CMD ["node", "server.js"]
