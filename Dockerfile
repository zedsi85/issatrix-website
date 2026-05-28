FROM node:22-alpine

# Build tools required to compile better-sqlite3 (native module)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# ── 1. Frontend: install deps and build Vite SPA ──────────────────────────────
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ── 2. Server: install production deps (compiles better-sqlite3 here) ─────────
WORKDIR /app/server
RUN npm install --omit=dev

# ── 3. Runtime ────────────────────────────────────────────────────────────────
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "server/index.js"]
