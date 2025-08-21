from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'tasks', views.TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
]

# Las URLs generadas automáticamente por el router son:
# GET    /api/tasks/           - Lista todas las tareas (con paginación)
# POST   /api/tasks/           - Crear nueva tarea
# GET    /api/tasks/{id}/      - Obtener tarea específica
# PUT    /api/tasks/{id}/      - Actualizar tarea completa
# PATCH  /api/tasks/{id}/      - Actualizar tarea parcial
# DELETE /api/tasks/{id}/      - Eliminar tarea
# POST   /api/tasks/{id}/toggle/ - Alternar estado completado
# GET    /api/tasks/completed/ - Listar solo tareas completadas
# GET    /api/tasks/pending/   - Listar solo tareas pendientes
# GET    /api/tasks/stats/     - Obtener estadísticas de tareas
