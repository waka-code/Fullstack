from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    """
    Configuración del admin para el modelo Task.
    """
    
    list_display = [
        'name',
        'completed',
        'created_at',
        'updated_at'
    ]
    
    list_filter = [
        'completed',
        'created_at',
        'updated_at'
    ]
    
    search_fields = [
        'name'
    ]
    
    readonly_fields = [
        'id',
        'created_at',
        'updated_at'
    ]
    
    fieldsets = (
        ('Información de la Tarea', {
            'fields': ('id', 'name', 'completed')
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at'),
        }),
    )
    
    ordering = ['-created_at']
    
    actions = ['mark_as_completed', 'mark_as_pending']
    
    def mark_as_completed(self, request, queryset):
        """Acción para marcar tareas como completadas."""
        updated = queryset.update(completed=True)
        self.message_user(
            request, 
            f'{updated} tarea(s) marcada(s) como completada(s).'
        )
    mark_as_completed.short_description = "Marcar como completadas"
    
    def mark_as_pending(self, request, queryset):
        """Acción para marcar tareas como pendientes."""
        updated = queryset.update(completed=False)
        self.message_user(
            request, 
            f'{updated} tarea(s) marcada(s) como pendiente(s).'
        )
    mark_as_pending.short_description = "Marcar como pendientes"
