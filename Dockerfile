# Multi-stage Dockerfile for Nest.js Backend (CelenganKu)
FROM node:20-alpine AS builder

WORKDIR /app

# Salin package.json dan install dependensi
COPY package*.json ./
RUN npm install

# Salin seluruh kode sumber dan build
COPY . .
RUN npm run build

# Stage Produksi
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 4000
CMD ["node", "dist/main.js"]

