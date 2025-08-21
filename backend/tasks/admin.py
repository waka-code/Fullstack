from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
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
        ('Task Information', {
            'fields': ('id', 'name', 'completed')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
        }),
    )
    
    ordering = ['-created_at']
    
    actions = ['mark_as_completed', 'mark_as_pending']
    
    def mark_as_completed(self, request, queryset):
        updated = queryset.update(completed=True)
        self.message_user(
            request, 
            f'{updated} task(s) marked as completed.'
        )
    mark_as_completed.short_description = "Mark as completed"
    
    def mark_as_pending(self, request, queryset):
        updated = queryset.update(completed=False)
        self.message_user(
            request, 
            f'{updated} task(s) marked as pending.'
        )
    mark_as_pending.short_description = "Mark as pending"
