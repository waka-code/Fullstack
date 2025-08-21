from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .models import Task
from .serializers import TaskSerializer, TaskStatsSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['completed']
    search_fields = ['name']
    ordering_fields = ['created_at', 'updated_at', 'name']
    ordering = ['-created_at']
    
    @action(detail=False, methods=['get'])
    def completed(self, request):
        completed_tasks = self.get_queryset().filter(completed=True)
        page = self.paginate_queryset(completed_tasks)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(completed_tasks, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        pending_tasks = self.get_queryset().filter(completed=False)
        page = self.paginate_queryset(pending_tasks)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(pending_tasks, many=True)
        return Response(serializer.data)
    
    @method_decorator(cache_page(60 * 5)) 
    @action(detail=False, methods=['get'])
    def stats(self, request):
        stats = Task.get_stats()
        serializer = TaskStatsSerializer(stats)
        return Response(serializer.data)
    
    @action(detail=False, methods=['delete'])
    def clear_completed(self, request):
        deleted_count, _ = Task.objects.filter(completed=True).delete()
        return Response(
            {'message': f'{deleted_count} completed tasks deleted'},
            status=status.HTTP_200_OK
        )
