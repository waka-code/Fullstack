# Full Stack Task Manager

Aplicación completa de gestión de tareas con React + Vite + TypeScript + Tailwind CSS en el frontend, Django + Django REST Framework en el backend y challenges en Node.js para retos técnicos.

## Tecnologías principales

### Frontend

- React 18, Vite, TypeScript, Tailwind CSS
- Testing: Vitest, Testing Library

### Backend

- Django 4, Django REST Framework, SQLite
- Validaciones, paginación, CORS, filtros y búsquedas

### Backend Node.js

- Express, TypeScript, Jest, Axios

## Estructura del proyecto

- `frontend/`: SPA React + Vite
- `backend/`: API REST Django
- `challenges-node/`: scripts y app en Node.js

## Instalación y ejecución

### Requisitos

- Node.js >= 16
- Python >= 3.8
- pip
- Docker (opcional)

### Opción 1: Docker (recomendado)

```bash
npm run docker:setup
```

Acceso:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Django Admin: http://localhost:8000/admin

### Opción 2: Local sin Docker

```bash
npm run setup
npm run start:backend
npm run start:frontend
```

### Scripts principales

```bash
# Instalar dependencias y preparar todo
npm run setup

# Backend: instalar dependencias y migrar
npm run setup:backend
# Frontend: instalar dependencias
npm run setup:frontend
# Node: instalar y compilar
npm run setup:micro

# Iniciar backend
npm run start:backend
# Iniciar frontend
npm run start:frontend
# Iniciar Node en modo dev
cd micro-challenges-node && npm run dev

# Pruebas Node
cd micro-challenges-node && npm test
```

### Comandos Docker manuales

```bash
docker-compose build
docker-compose up -d
docker-compose logs -f
docker-compose down
docker-compose down -v
```

## Pruebas

### Frontend

```bash
cd frontend
npm test
# o
npm run test:ui
# Cobertura
npm run test:coverage
```

### Node

```bash
cd micro-challenges-node
npm test

npm run dev
npm run script:hmac
npm run script:performance
```

## Endpoints principales API

- `GET /api/tasks/` - Listar tareas (paginado)
- `POST /api/tasks/` - Crear tarea
- `GET /api/tasks/{id}/` - Obtener tarea
- `PUT /api/tasks/{id}/` - Actualizar tarea
- `DELETE /api/tasks/{id}/` - Eliminar tarea
- `GET /api/tasks/completed/` - Listar solo completadas
- `GET /api/tasks/pending/` - Listar solo pendientes


## Notas técnicas

- El backend usa SQLite por defecto, pero puede configurarse para otros motores.
- El frontend usa Context API para estado global y paginación automática.
- El backend en Node es independiente y se puede usar para retos técnicos o pruebas.
- El sistema de tests cubre componentes, hooks y servicios principales.
- Tailwind CSS está configurado vía Vite.
- CORS está habilitado para desarrollo.

