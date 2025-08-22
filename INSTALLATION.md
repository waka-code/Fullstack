# Instalacion y Setup

## Requisitos

- Node.js (version 16+)
- Python (version 3.8+)
- Docker

## Dependency Initialization in Backend, Frontend, and Micro-Challenges

```bash
npm run setup
```

## Opcion 1: Docker

```bash
npm run docker:setup
```

URLs:

- Frontend: http://localhost:5173
- Backend: http://localhost:8000

## Opcion 2: Setup Local

```bash
npm run setup
```

```bash
npm run start:backend
npm run start:frontend
```

## Comandos Disponibles

```bash
# Docker
npm run docker:setup    # Build and start
npm run docker:up       # Start services
npm run docker:down     # Stop services
npm run docker:logs     # View logs

# Local
npm run setup           # Set up project
npm run start:backend   # Backend only
npm run