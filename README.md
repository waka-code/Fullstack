# Full Stack Project

A complete task management application built with React + Vite + TypeScript + Tailwind CSS on the frontend and Django + Django REST Framework on the backend.

## Technologies

### Frontend
- React 18 with hooks
- Vite for fast development
- TypeScript for static typing
- Tailwind CSS for modern styling

### Backend
- Django 4 with REST Framework
- SQLite lightweight database
- Complete REST API with CRUD
- Validations and pagination

## Project Description

This application allows efficient task management through a modern web interface. Users can create, edit, delete and mark tasks as completed. The application includes:

**Main features:**
- Create new tasks with input validation
- Mark tasks as completed or pending
- Edit existing task names
- Delete individual tasks
- Filter tasks by status (completed/pending)
- View general task statistics
- Search tasks by name
- Automatic pagination for large lists

**Technical architecture:**
- Frontend developed as Single Page Application (SPA) with React
- Backend implemented as RESTful API with Django
- SQLite database for data persistence
- Frontend-backend communication via HTTP/JSON
- Static typing on frontend with TypeScript
- Responsive styling with Tailwind CSS
- Validations on both frontend and backend

**Technical features:**
- State management with React Context API
- Reusable and modular components
- Error handling and loading states
- CORS configured for development
- Data serialization with Django REST Framework
- Automatic database migrations

## Run with Docker

### Main commands:

```bash
# Build and start entire application
npm run docker:setup

# Only build images
npm run docker:build

# Start services (after building)
npm run docker:up

# View real-time logs
npm run docker:logs

# Stop services
npm run docker:down

# Restart services
npm run docker:restart
```

### Application access:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Django Admin: http://localhost:8000/admin

## Run without Docker

```bash
# Set up everything (one time only)
npm run setup

# Start backend and frontend separately
npm run start:backend
npm run start:frontend
```

## Manual Docker commands

```bash
# Build images
docker-compose build

# Start in detached mode (background)
docker-compose up -d

# Start in interactive mode (view logs)
docker-compose up

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Also remove volumes
docker-compose down -v
```

## Installation and Setup

### Prerequisites
- Node.js (version 16 or higher)
- Python (version 3.8 or higher)
- pip (Python package manager)


### Individual Commands

Frontend (port 5173):
```bash
npm run start:frontend
```

Backend (port 8000):
```bash
npm run start:backend
```

## Development URLs

- Frontend: http://localhost:5173
- Backend API: http://127.0.0.1:8000
- Django Admin: http://127.0.0.1:8000/admin

## Features

### Frontend
- Task list with complete CRUD
- Automatic pagination (+10 tasks)
- TypeScript typed components
- Responsive design with Tailwind CSS
- Performance optimized

### Backend
- Task model with validations
- REST API with serializers
- Automatic pagination
- Data validation
- CORS configured for development
- SQLite for data persistence

## Development

1. Clone the repository
2. Run `npm run docker:setup` from root (recommended)
3. Or run `npm run setup` for local installation
4. Frontend will be at http://localhost:5173
5. Backend will be at http://127.0.0.1:8000

## API Endpoints

- `GET /api/tasks/` - List tasks
- `POST /api/tasks/` - Create task
- `GET /api/tasks/{id}/` - Get task
- `PUT /api/tasks/{id}/` - Update task
- `DELETE /api/tasks/{id}/` - Delete task
