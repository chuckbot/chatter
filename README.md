# Chatter - Chat App con IA (Groq) y streaming

Aplicación de chat que usa **Groq** (LLM) con **streaming de tokens**, **rate limiting** y dominio restringido a:
- Gastronomía venezolana
- Testing de frontend
- Cine clásico

## Estructura del monorepo

- `backend/`: NestJS + Groq + SSE streaming + rate‑limit
- `frontend/`: React + TypeScript + Vite

## Requisitos previos

- Node.js 18+
- Docker (opcional, pero recomendado)
- API Key de Groq (gratis en [console.groq.com](https://console.groq.com))

## Variables de entorno

Crea un archivo `.env` dentro de `backend/` con:

```bash
GROQ_API_KEY=tu_clave_aqui
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_TEMPERATURE=0.7
GROQ_MAX_TOKENS=300
```

El frontend usará `http://localhost:3000` por defecto. Si quieres cambiarlo, añade `VITE_API_URL` en `frontend/.env`:

```bash
VITE_API_URL=http://localhost:3000
```

## Ejecución en desarrollo (local)

### Backend

```bash
cd backend
npm install
npm run start:dev
# Corre en http://localhost:3000
```
### Frontend

```bash
cd frontend
npm install
npm run dev
# Corre en http://localhost:5173
```
## Ejecución con Docker Compose (monorepo)

Desde la raíz del proyecto:

```bash
docker-compose up --build
```

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

Para detener:

```bash
docker-compose down
```

## Bonus implementados

| Bonus | Estado | Descripción |
| :--- | :---: | :--- |
| **Streaming de tokens** | ✅ | El frontend recibe tokens en tiempo real (SSE) y los muestra sin esperar respuesta completa (efecto "typing" real). |
| **Rate limiting** | ✅ | 5 requests por IP por minuto, protegiendo la cuota gratuita de Groq. |


## Ejemplos de preguntas válidas

- "¿Qué lleva el pabellón criollo?"

- "¿Cómo mockeo una función en Jest?"

- "¿Quién dirigió 'Psicosis'?"

Preguntas fuera de dominio reciben un aviso cortés de redirección.


## Solución de problemas comunes

| Problema | Solución |
| :--- | :--- |
| `Missing GROQ_API_KEY` | Verifica que el archivo `.env` esté en `backend/` y que la clave sea correcta. |
| `Cannot find module '/app/dist/main.js'` | Ejecuta `npm run build` localmente y asegura que `tsconfig.json` tenga `"outDir": "./dist"` y `"rootDir": "./src"`. |
| SSE error en consola del navegador | Es un falso positivo. El `EventSource` dispara `onerror` al cerrar la conexión. Aplica la corrección sugerida en el código o ignóralo porque el chat funciona. |
| El frontend no ve al backend en Docker | Verifica que en `frontend/.env` (o en el `docker-compose.yml`) `VITE_API_URL` apunte a `http://backend:3000`. |

## Tecnologías utilizadas

- Backend: NestJS, Groq SDK, RxJS, SSE, class-validator

- Frontend: React, TypeScript, Vite, EventSource

- Orquestación: Docker, Docker Compose

