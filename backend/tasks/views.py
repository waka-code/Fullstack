from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .models import Task
from .serializers import TaskSerializer, TaskStatsSerializer


class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing tasks with full CRUD operations
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['completed']
    search_fields = ['name']
    ordering_fields = ['created_at', 'updated_at', 'name']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """
        Override to add custom filtering
        """
        queryset = super().get_queryset()
        
        # Filter by completion status
        completed = self.request.query_params.get('completed', None)
        if completed is not None:
            if completed.lower() in ['true', '1']:
                queryset = queryset.filter(completed=True)
            elif completed.lower() in ['false', '0']:
                queryset = queryset.filter(completed=False)
        
        # Search by name
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        """Create a new task and invalidate cache"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        task = serializer.save()
        
        # Invalidar caché de estadísticas
        cache.delete_many(['task_stats', 'completed_tasks', 'pending_tasks'])
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        """Update a task"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        task = serializer.save()
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        """Delete a task"""
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['patch'])
    def toggle(self, request, pk=None):
        """
        Toggle task completion status
        """
        task = self.get_object()
        task.toggle_completion()
        serializer = self.get_serializer(task)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def completed(self, request):
        """
        Get all completed tasks
        """
        completed_tasks = self.get_queryset().filter(completed=True)
        page = self.paginate_queryset(completed_tasks)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(completed_tasks, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """
        Get all pending tasks
        """
        pending_tasks = self.get_queryset().filter(completed=False)
        page = self.paginate_queryset(pending_tasks)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(pending_tasks, many=True)
        return Response(serializer.data)
    
    @method_decorator(cache_page(60 * 5))  # Cache por 5 minutos
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Get task statistics with caching
        """
        stats = Task.get_stats()
        serializer = TaskStatsSerializer(stats)
        return Response(serializer.data)
    
    @action(detail=False, methods=['delete'])
    def clear_completed(self, request):
        """
        Delete all completed tasks
        """
        deleted_count, _ = Task.objects.filter(completed=True).delete()
        return Response(
            {'message': f'{deleted_count} completed tasks deleted'},
            status=status.HTTP_200_OK
        )
