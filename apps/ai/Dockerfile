# ── Stage 1: prune ──────────────────────────────────────────
# Base image for prune
FROM node:22-alpine AS pruner

# Set the working directory inside the container
WORKDIR /app

# Install pnpm (package manager) and turbo (monorepo build tool) globally
RUN npm install -g pnpm turbo

# Copy entire repo into the container
COPY . .

# Prune the monorepo to only include @archiq/ai and its dependencies
RUN turbo prune @archiq/ai --docker

# ── Stage 2: install & build ─────────────────────────────────
# Fresh image for building — nothing carries over from pruner except what we COPY
FROM node:22-alpine AS builder

# Set the working directory
WORKDIR /app

# Install pnpm and turbo globally (each stage is a fresh image, so we reinstall)
RUN npm install -g pnpm turbo

# Copy pruned lockfile first — separate layer for better Docker cache
# If lockfile doesn't change, Docker reuses this cached layer on next build
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Copy pruned workspace config
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Copy pruned package.jsons (without source) for dependency installation
COPY --from=pruner /app/out/json/ .

# Install ALL deps including devDeps
RUN pnpm install --frozen-lockfile

# Copy the full pruned source code after installing deps
COPY --from=pruner /app/out/full/ .

# Build all packages and ai — turbo handles dependency order automatically
# packages like @archiq/types, @archiq/db, @archiq/log etc. build first, then ai
RUN pnpm turbo build --filter=@archiq/ai

# ── Stage 3a: development ────────────────────────────────────

# Separate stage for development — includes full source and all dependencies
FROM node:22-alpine AS development

# Set the working directory
WORKDIR /app

# Set NODE_ENV to development
ENV NODE_ENV=development

# Install pnpm globally
RUN npm install -g pnpm

# Copy everything from builder (source + node_modules + compiled packages)
# packages have dist/ from builder, ai dist/ is ignored since nodemon runs src/ directly
COPY --from=builder /app .

# Create a non-root system group and user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port 3000 for HTTP traffic
EXPOSE 3000

# Start ai in dev mode with hot reload via nodemon
# nodemon watches src/ and runs tsx directly — no compilation needed
CMD ["pnpm", "--filter=@archiq/ai", "dev"]

# ── Stage 4: production ──────────────────────────────────────
# Minimal production image — only dist and prod dependencies
FROM node:22-alpine AS runner

# Set the working directory
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Install pnpm globally
RUN npm install -g pnpm

# Copy root package.json for workspace resolution
COPY --from=builder /app/package.json ./package.json

# Copy workspace config so pnpm knows about all packages
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Copy lockfile for deterministic installs
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Copy built packages (compiled dist output of all shared packages)
COPY --from=builder /app/packages ./packages

# Copy only the ai package.json (not the full source)
COPY --from=builder /app/apps/ai/package.json ./apps/ai/package.json

# Copy only the compiled dist — no source code in production image
COPY --from=builder /app/apps/ai/dist ./apps/ai/dist

# Install only production dependencies — no devDeps in final image
RUN pnpm install --prod --frozen-lockfile

# Create non-root user after install so pnpm can write to cache freely as root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /app

# Switch to non-root user for security
USER appuser

# Expose port 3000 for HTTP traffic
EXPOSE 3000

# Start ai server using compiled JS — no TypeScript runtime needed in production
CMD ["node", "apps/ai/dist/index.js"]