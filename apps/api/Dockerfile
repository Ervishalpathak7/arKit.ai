# ── Stage 1: prune ──────────────────────────────────────────
FROM node:22-alpine AS pruner
WORKDIR /app

RUN npm install -g pnpm turbo

COPY . .

# generates /app/out with only api + its package dependencies
RUN turbo prune @archiq/api --docker

# ── Stage 2: install & build ─────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm

# copy pruned lockfile and package.jsons first (layer cache)
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

# install only what this app needs
RUN pnpm install --frozen-lockfile

# copy pruned source
COPY --from=pruner /app/out/full/ .

# build packages first, then api (turbo handles order)
RUN pnpm turbo build --filter=@archiq/api

# ── Stage 3: production image ────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

RUN npm install -g pnpm

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

COPY --from=builder /app/packages ./packages

COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist

RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000
CMD ["node", "apps/api/dist/index.js"]