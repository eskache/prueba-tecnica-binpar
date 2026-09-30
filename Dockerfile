# Imagen en tres fases: una instala dependencias, otra construye la app y la última
# es la que de verdad se ejecuta. Así la imagen final no lleva node_modules completo
# ni el código fuente, solo lo que "output: standalone" (next.config.ts) dice que hace
# falta para arrancar el servidor.

FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Un usuario sin privilegios de administrador, en vez de "root" (el que usan las
# imágenes por defecto): si algo dentro del contenedor se viera comprometido, no
# tendría más permisos de los necesarios para servir la app.
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 --ingroup nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
# 0.0.0.0 y no localhost: si escuchara solo en localhost, el puerto publicado con
# "docker run -p" no llegaría a nada, porque ese localhost sería el del contenedor.
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
