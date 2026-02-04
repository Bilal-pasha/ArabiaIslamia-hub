FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY .npmrc ./
COPY apps/huffaz/client/package.json ./apps/huffaz/client/

RUN pnpm install --frozen-lockfile || pnpm install

COPY apps/huffaz/client ./apps/huffaz/client

# NEXT_PUBLIC_* must be present at build time (Next.js inlines them into the client bundle)
ARG NEXT_PUBLIC_HUFFAZ_API_URL
ENV NEXT_PUBLIC_HUFFAZ_API_URL=${NEXT_PUBLIC_HUFFAZ_API_URL}

RUN pnpm --filter huffaz-app build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

COPY --from=builder /app/apps/huffaz/client/.next/standalone ./
COPY --from=builder /app/apps/huffaz/client/.next/static ./apps/huffaz/client/.next/static

WORKDIR /app/apps/huffaz/client
EXPOSE 3001
CMD ["node", "server.js"]
