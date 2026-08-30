FROM node:24-alpine AS deps

RUN apk add --no-cache python3 make g++ libc6-compat

WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:24-alpine AS builder

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

ENV DATABASE_PATH=/app/data/db.sqlite
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

FROM node:24-alpine AS runner

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY --chown=node:node --from=builder /app/.next/standalone ./
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/.next/static ./.next/static
COPY --chown=node:node --from=builder /app/knexfile.js ./knexfile.js
COPY --chown=node:node --from=builder /app/src/migrations ./src/migrations
COPY --chown=node:node migrate.js ./migrate.js
COPY --chown=node:node start.sh ./start.sh

RUN mkdir -p /app/data && chown node:node /app/data && chmod +x /app/start.sh

USER node

ENV DATABASE_PATH=/app/data/db.sqlite
ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

EXPOSE 3000

CMD ["/app/start.sh"]
