# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependencias
COPY package.json package-lock.json* ./
RUN npm ci

# Copiar código fuente
COPY . .

# Build de la aplicación (browser + server SSR)
RUN npm run build:ssr

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

# Copiar solo lo necesario para ejecutar
COPY --from=builder /app/dist/rakium-dev ./dist/rakium-dev
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Asegurar que exista dist/rakium-dev/browser (por si Dokploy inyecta .env ahí)
RUN mkdir -p dist/rakium-dev/browser && touch dist/rakium-dev/browser/.env

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

# Puerto por defecto (se puede sobreescribir con -e PORT=4000)
ENV PORT=4000
EXPOSE 4000

# Comando para iniciar el servidor SSR
CMD ["node", "dist/rakium-dev/server/main.js"]
