# ── Stage 1: prune ──────────────────────────────────────────
FROM node:22-alpine AS pruner
WORKDIR /app

RUN npm install -g pnpm turbo

COPY . .

# generates /app/out with only ai + its package dependencies
RUN turbo prune @archiq/ai --docker

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

# build packages first, then ai (turbo handles order)
RUN pnpm turbo build --filter=@archiq/ai

# ── Stage 3: production image ────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

RUN npm install -g pnpm

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

COPY --from=builder /app/packages ./packages

COPY --from=builder /app/apps/ai/package.json ./apps/ai/package.json
COPY --from=builder /app/apps/ai/dist ./apps/ai/dist

# reinstall prod deps so pnpm creates correct workspace symlinks
RUN pnpm install --prod --frozen-lockfile

# ai worker has no HTTP server — no EXPOSE needed
CMD ["node", "apps/ai/dist/index.js"]