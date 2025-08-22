from django.db import models

class Task(models.Model):
    name = models.CharField(max_length=255, help_text="Task name")
    completed = models.BooleanField(default=False, help_text="Task completion status")
    created_at = models.DateTimeField(auto_now_add=True, help_text="Task creation timestamp")
    updated_at = models.DateTimeField(auto_now=True, help_text="Task last update timestamp")
    
    class Meta:
        db_table = 'tasks'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['completed']),
            models.Index(fields=['created_at']),
        ]
    
    def toggle_completion(self):
        self.completed = not self.completed
        self.save()
        return self
    
    def __str__(self):
        return f"{self.name} ({'✓' if self.completed else '✗'})"