FROM --platform=linux/amd64 node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY .npmrc* ./
COPY packages/ui ./packages/ui
COPY packages/animations ./packages/animations
COPY apps/library/client/package.json ./apps/library/client/

RUN pnpm install --frozen-lockfile || pnpm install

COPY apps/library/client ./apps/library/client

ARG NEXT_PUBLIC_LIBRARY_API_URL
ENV NEXT_PUBLIC_LIBRARY_API_URL=${NEXT_PUBLIC_LIBRARY_API_URL}
ENV NODE_ENV=production
RUN pnpm --filter library-app build

FROM --platform=linux/amd64 node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3013

COPY --from=builder /app/apps/library/client/.next/standalone ./
COPY --from=builder /app/apps/library/client/.next/static ./apps/library/client/.next/static
COPY --from=builder /app/apps/library/client/public ./apps/library/client/public

WORKDIR /app/apps/library/client
EXPOSE 3013
CMD ["node", "server.js"]
