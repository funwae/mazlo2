FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy root package files
COPY package.json ./
COPY tsconfig.json* ./
COPY next.config.js* ./

# Copy app directory
COPY apps/chat-ultra ./apps/chat-ultra

# Install dependencies
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy everything from deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/tsconfig.json ./tsconfig.json
COPY --from=deps /app/next.config.js ./next.config.js
COPY --from=deps /app/apps/chat-ultra ./apps/chat-ultra

ENV NEXT_TELEMETRY_DISABLED 1

# Build the app
WORKDIR /app/apps/chat-ultra
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/apps/chat-ultra/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/chat-ultra/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/chat-ultra/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]

