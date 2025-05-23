# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy shared types package
COPY packages/shared-types ./packages/shared-types

# Copy API package
COPY apps/api ./apps/api

# Install dependencies
RUN pnpm install --frozen-lockfile

# prod stage
FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy node_modules and source from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api ./apps/api
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

#  directory for database
RUN mkdir -p /app/data

WORKDIR /app/apps/api

#  port
EXPOSE 3000

CMD ["pnpm", "dev"]