# Keep in sync with apps/secondary/api/Dockerfile (same structure; scouts-portal-api uses @arabiaaislamia/storage for R2)
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY .npmrc* ./
COPY packages/database ./packages/database
COPY packages/storage ./packages/storage
COPY apps/scouts-portal/api/package.json ./apps/scouts-portal/api/

RUN pnpm install --frozen-lockfile || pnpm install

COPY apps/scouts-portal/api ./apps/scouts-portal/api

RUN pnpm --filter @arabiaaislamia/database run build
RUN pnpm --filter @arabiaaislamia/storage run build
RUN pnpm --filter scouts-portal-api build

# Deploy creates an isolated dir with node_modules (workspace deps included); dist is in .gitignore so copy it in
RUN pnpm --filter scouts-portal-api deploy --prod deploy && cp -r apps/scouts-portal/api/dist deploy/dist

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/deploy .

ENV NODE_ENV=production
EXPOSE 8003
CMD ["node", "dist/main.js"]
