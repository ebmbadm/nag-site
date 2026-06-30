# syntax=docker/dockerfile:1
# Production image for the NAG · NOVIK Next.js site (next start via standalone output).
# Build:  docker build -t nag-site .
# Run:    docker run -p 3000:3000 --env-file .env nag-site
#
# glibc (node:22-slim, not alpine): native linux-x64-gnu binaries for sharp /
# @next/swc / @tailwindcss/oxide / rolldown resolve cleanly. On alpine/musl npm
# pulls wasm32 fallbacks and the install aborts ("Exit handler never called").

# --- install dependencies ---
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# npm install (not npm ci): the macOS-generated lockfile omits Linux optional deps.
RUN npm install --no-audit --no-fund

# --- build (produces .next/standalone) ---
FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- runtime ---
FROM node:22-slim AS runner
# ca-certificates: node:slim ships without them, so server-side HTTPS (Supabase,
# Resend, Telegram) fails TLS verification. Required.
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# public assets + standalone server (minimal node_modules) + static chunks.
# `node` user (uid 1000) ships with the official image.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
