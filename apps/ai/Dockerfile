# ── Stage 1: prune ──────────────────────────────────────────

# Base image for prune
FROM node:22-alpine AS pruner

# Set working Directory
WORKDIR /app

# Install pnpm & turbo
RUN npm install -g pnpm turbo

# Copy entire repo in the working directory
COPY . .

# generates /app/out with only ai + its package dependencies
RUN turbo prune @archiq/ai --docker

# ── Stage 2: install & build ─────────────────────────────────

# Base image for build
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install package manager 
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

#Base image for runner
FROM node:22-alpine AS runner

# Set working directory
WORKDIR /app

# Install the package manager
RUN npm install -g pnpm

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/ai/package.json ./apps/ai/package.json
COPY --from=builder /app/apps/ai/dist ./apps/ai/dist

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Give ownership of app files to that user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser 

# install prod dependencies with lock file
RUN pnpm install --prod --frozen-lockfile

# start ai worker
CMD ["node", "apps/ai/dist/index.js"]