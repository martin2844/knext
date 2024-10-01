FROM node:20-alpine AS deps

WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

# Copy the standalone output
COPY --from=builder /app/.next/standalone ./

# Copy the public folder
COPY --from=builder /app/public ./public

# Copy the static folder
COPY --from=builder /app/.next/static ./.next/static

# Copy the .env file
COPY --from=builder /app/.env ./.env

EXPOSE 3000

ENV PORT 3000
ENV NODE_ENV production
ENV HOSTNAME 0.0.0.0

CMD ["node", "server.js"]