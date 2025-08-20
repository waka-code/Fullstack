# Instalacion y Setup

## Requisitos

- Node.js (version 16+)
- Python (version 3.8+)
- Docker

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

Este comando ejecuta:

- Instalación de dependencias Python del backend
- Creación y aplicación de migraciones Django
- Instalación de dependencias npm del frontend

Luego ejecutar en terminales separadas:

```bash
npm run start:backend
npm run start:frontend
```

## Comandos Disponibles

```bash
# Docker
npm run docker:setup    # Construir y levantar
npm run docker:up       # Levantar servicios
npm run docker:down     # Parar servicios
npm run docker:logs     # Ver logs

# Local
npm run setup           # Configurar proyecto
npm run start:backend   # Solo backend
npm run start:frontend  # Solo frontend
```
