from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'name', 'completed', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def validate_name(self, value):
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError("Task name cannot be empty.")
        if len(value) > 255:
            raise serializers.ValidationError("Task name cannot exceed 255 characters.")
        if Task.objects.filter(name=value).exists():
            raise serializers.ValidationError("A task with this name already exists.")
        return value.strip()