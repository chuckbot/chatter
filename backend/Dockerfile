FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --quiet
COPY . .
RUN npm run build
RUN echo "📁 Contenido de /app/dist después del build:" && ls -la /app/dist   # ← añade esto

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
RUN echo "📁 Contenido de /app/dist después de copiar:" && ls -la /app/dist   # ← añade esto
EXPOSE 3000
CMD ["node", "dist/src/main.js"]