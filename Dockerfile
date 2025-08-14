FROM node:20-alpine AS deps

# Install dependencies needed for native module compilation
RUN apk add --no-cache python3 make g++ libc6-compat

WORKDIR /app
COPY package*.json ./

RUN npm ci --frozen-lockfile --legacy-peer-deps

FROM node:20-alpine AS builder

# Install dependencies needed for native module compilation
RUN apk add --no-cache python3 make g++ libc6-compat

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Create data directory for database
RUN mkdir -p /app/data && chmod 755 /app/data

# Set database path for build process - use absolute path
ENV DATABASE_PATH=/app/data/db.sqlite

# Don't run migrations during build - they will run at startup
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

# Copy the standalone output
COPY --from=builder /app/.next/standalone ./

# Copy the public folder
COPY --from=builder /app/public ./public

# Copy the static folder
COPY --from=builder /app/.next/static ./.next/static

# Copy node_modules and config files for migration scripts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/knexfile.js ./knexfile.js
COPY --from=builder /app/src/migrations ./src/migrations

# Copy startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Set database path for runtime - use absolute path
ENV DATABASE_PATH=/app/data/db.sqlite

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

CMD ["/app/start.sh"]