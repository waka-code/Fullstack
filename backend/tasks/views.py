from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['completed']
    search_fields = ['name']
    ordering_fields = ['created_at', 'updated_at', 'name']
    ordering = ['-created_at']

    @action(detail=False, methods=['get'], url_path='all')
    def get_all_tasks(self, request):
        tasks = self.get_queryset()
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)