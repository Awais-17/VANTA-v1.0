# Multi-stage build: Build React frontend → Serve via FastAPI backend
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM python:3.11-slim
WORKDIR /app

# Install dependencies
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend files and built frontend assets
COPY backend/ ./backend/
COPY --from=frontend /app/dist ./dist/

# Change working directory to backend so uvicorn runs correctly
WORKDIR /app/backend

EXPOSE 8000
ENV PORT=8000

CMD ["python", "main.py"]
