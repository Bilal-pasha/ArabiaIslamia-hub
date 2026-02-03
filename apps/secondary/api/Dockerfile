FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY .npmrc* ./
COPY packages/database ./packages/database
COPY packages/storage ./packages/storage
COPY apps/secondary/api/package.json ./apps/secondary/api/

RUN pnpm install --frozen-lockfile || pnpm install

COPY apps/secondary/api ./apps/secondary/api

RUN pnpm --filter @arabiaaislamia/database run build
RUN pnpm --filter @arabiaaislamia/storage run build
RUN pnpm --filter secondary-api build

# Deploy creates an isolated dir with node_modules (workspace deps included); dist is in .gitignore so copy it in
RUN pnpm --filter secondary-api deploy --prod deploy && cp -r apps/secondary/api/dist deploy/dist

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/deploy .

ENV NODE_ENV=production
EXPOSE 8002
CMD ["node", "dist/main.js"]
