# Dockerfile for KeystoneJS Application

# 1. Base Image - Use an official Node.js LTS version
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install pnpm globally if you prefer to use it (optional, adjust if using npm or yarn)
# RUN npm install -g pnpm

# Copy package.json and lockfile
COPY package.json ./
# COPY pnpm-lock.yaml ./ # If using pnpm
COPY package-lock.json ./ # If using npm/yarn v2+ with lockfile
# COPY yarn.lock ./ # If using yarn

# -------------------------------------------------------------------------------------
# Builder Stage: Install dependencies and build the application
# -------------------------------------------------------------------------------------
FROM base AS builder

# Install dependencies
# RUN pnpm install --frozen-lockfile # If using pnpm
RUN npm install --production=false # Or yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Generate Prisma Client (important step)
RUN npx prisma generate

# Build KeystoneJS application (Admin UI and API)
# The specific build command might vary slightly based on Keystone version and project setup.
# Common command is 'keystone build' or 'pnpm build' / 'npm run build' if aliased in package.json
RUN npx keystone build # Or your specific build command, e.g., npm run build

# If you only want to build the server and not the Admin UI (e.g., for a separate Admin UI deployment)
# RUN npx keystone build --no-ui

# -------------------------------------------------------------------------------------
# Runner Stage: Setup production environment
# -------------------------------------------------------------------------------------
FROM base AS runner

# Copy built app from builder stage (including node_modules for production)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/pnpm-lock.yaml ./ # If using pnpm
COPY --from=builder /app/package-lock.json ./ # If using npm/yarn v2+ with lockfile
# COPY --from=builder /app/yarn.lock ./ # If using yarn

# Copy Prisma schema and migration files (needed for prisma migrate deploy)
COPY --from=builder /app/prisma ./prisma

# Copy the built KeystoneJS application (output of 'keystone build')
# The .keystone directory typically contains the built Admin UI and server artifacts.
COPY --from=builder /app/.keystone ./.keystone
COPY --from=builder /app/dist ./dist # If your tsconfig.json outputs to dist and keystone uses it
COPY --from=builder /app/public ./public # If you have a public assets folder for Keystone

# Expose the port the app runs on (default is 3000, or from PORT env var)
EXPOSE ${PORT:-3000}

# Command to run the application
# This command should start the KeystoneJS server in production mode.
# It usually involves 'keystone start' or 'node dist/keystone.js' or similar.
# Check your project's package.json scripts or KeystoneJS documentation.
# CMD ["pnpm", "start"] # If using pnpm and have a start script
CMD ["npm", "run", "start"] # Assuming 'start' script in package.json runs 'keystone start'

# Healthcheck (optional, but good practice)
# HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
#   CMD curl -f http://localhost:${PORT:-3000}/api/graphql_health_check || exit 1
# (Note: Keystone might not have a /api/graphql_health_check by default, adjust or remove)
