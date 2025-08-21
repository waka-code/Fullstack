
> Nota: Este prompt fue utilizado únicamente para crear el esquema inicial del proyecto. El resto de la funcionalidad, carpetas, archivos y lógica se fue desarrollando y adaptando progresivamente a medida que avanzaba el proyecto.

Genera una aplicación Full Stack con **ReactJS + Vite + TypeScript + Tailwind CSS** en el frontend y **Django + Django REST Framework + SQLite** en el backend, cumpliendo estos requisitos:

RAÍZ Y COMANDOS:
1. La estructura del proyecto debe ser:
   /mi-proyecto
     /frontend   → React + Vite + TS + Tailwind
     /backend    → Django + DRF + SQLite
     package.json

FRONTEND (ReactJS + Vite + TypeScript + Tailwind CSS moderno):
1. Configurar Tailwind CSS siguiendo la guía moderna de Vite:
   - Instalar `tailwindcss`.
   - Configurar `vite.config.ts` con plugins necesarios (Vite + TS + React).
   - Crear `tailwind.css` con:
   - Importar `tailwind.css` en `main.tsx`.


BACKEND (Django + DRF + SQLite):
1. Configurar Django para usar **SQLite** como base de datos por defecto (`db.sqlite3` en la raíz del backend).
2. Crear app `tasks` con modelo `Task`:
   - `name` (CharField, max 255)
   - `completed` (BooleanField, default False)
3. Crear serializer `TaskSerializer`.
4. Crear vistas API con CRUD y paginación si hay más de 10 tareas.
5. Validaciones: no permitir tareas con nombre vacío.
6. Código limpio, modular y siguiendo buenas prácticas modernas.
7. Backend debe correr en host local (`127.0.0.1:8000`) sin contenedores o virtualización adicional.

TESTING:
1. Genera pruebas unitarias y de integración para backend y frontend:
   - Backend: Usa Django TestCase para cubrir modelos, serializadores y vistas (CRUD y validaciones).
   - Frontend: Usa Vitest y React Testing Library para componentes.
2. Los tests deben ser claros, independientes y cubrir casos exitosos y de error.
3. Incluye instrucciones para ejecutar los tests en ambos entornos.

ADICIONAL:
1. Organizar proyecto sin duplicación de código.
4. **Importante:** Debes generar todo paso a paso y esperar aprobación antes de ejecutar el siguiente paso. Esto aplica a la creación de carpetas, archivos y configuraciones.


Nota final: Esta sección sobre micro-challenges-node se añadió al final del desarrollo, como un apéndice, y no formó parte del esquema inicial generado por el prompt.

MICRO-CHALLENGES-NODE (Node.js + TypeScript + Express):

Estructura dedicada para retos y utilidades en Node.js.
Usa TypeScript para el desarrollo y Jest para test.
Los tests deben ser claros, independientes y cubrir casos exitosos y de error.