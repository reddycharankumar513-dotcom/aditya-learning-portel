# =================================================================
# LEARNOVA Backend Production Dockerfile (Multi-Stage)
# Optimized for 100% Free Tier Deployments (Render, AWS EC2 Free, Railway)
# =================================================================

# -------------------------------------------------------------
# Stage 1: Build & Compile TypeScript
# -------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and config
COPY tsconfig.json ./
COPY src/ ./src/

# Compile TypeScript to JavaScript in /dist
RUN npm run build

# Prune devDependencies to keep container minimal
RUN npm prune --production

# -------------------------------------------------------------
# Stage 2: Minimal Production Runner
# -------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /usr/src/app

# Security: Install dumb-init to handle PID 1 signals & zombie process reaping
RUN apk add --no-cache dumb-init curl

ENV NODE_ENV=production
ENV PORT=5000

# Run container as non-root user 'node' for security
USER node

# Copy production node_modules from builder
COPY --chown=node:node --from=builder /usr/src/app/package*.json ./
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist

# Expose internal API port
EXPOSE 5000

# Health Check definition
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start server using dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
