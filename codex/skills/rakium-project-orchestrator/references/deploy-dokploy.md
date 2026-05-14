# Dokploy Deployment Reference

Rakium-style Angular projects usually deploy as Dockerfile apps with SSR served by Node/Express.

Expected app settings:

- Type: Dockerfile
- Dockerfile path: `Dockerfile`
- Internal port: `4000`
- Environment variable: `PORT=4000`
- Health check: `/`
- Domain path: `/`
- Internal path: `/`
- HTTPS: enabled
- Certificate provider: `Let's Encrypt`

Recommended `DOKPLOY.md` shape:

```markdown
# Dokploy

Proyecto Angular con SSR servido por Node/Express.

## App

- Tipo: Dockerfile
- Dockerfile: `Dockerfile`
- Puerto interno: `4000`
- Variable recomendada: `PORT=4000`
- Health check: `/`
- Dominio: HTTPS activo con `Let's Encrypt`

## Build local

```bash
npm ci
npm run build
node dist/<slug>/server/server.mjs
```

## DNS

Cuando el dominio este definido, apuntar el registro `A` o `CNAME` al servidor de Dokploy y agregar el dominio en la app con:

- Path: `/`
- Internal path: `/`
- Container port: `4000`
- HTTPS: activo
- Certificate provider: `Let's Encrypt`
```

Recommended Dockerfile pattern:

```Dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
COPY --from=builder /app/dist/<slug> ./dist/<slug>
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
RUN npm ci --omit=dev
EXPOSE 4000
CMD ["node", "dist/<slug>/server/server.mjs"]
```

Use the Node LTS/current recommendation at execution time if the project or Angular version requires a newer Node version.
