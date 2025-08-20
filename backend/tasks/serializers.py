from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'name', 'completed', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def validate_name(self, value):
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError("El nombre de la tarea no puede estar vacío.")
        if len(value) > 255:
            raise serializers.ValidationError("El nombre de la tarea no puede exceder 255 caracteres.")
        return value.strip()


class TaskStatsSerializer(serializers.Serializer):
    """
    Serializer for task statistics
    """
    total = serializers.IntegerField()
    completed = serializers.IntegerField()
    pending = serializers.IntegerField()
    completion_rate = serializers.FloatField()
