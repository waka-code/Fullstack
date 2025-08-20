from django.db import models


class Task(models.Model):
    """
    Task model using Django ORM for SQLite
    """
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
    
    def clean(self):
        """Validate the model before saving"""
        if not self.name or self.name.strip() == '':
            raise ValueError('Task name cannot be empty')
        
        self.name = self.name.strip()
    
    def save(self, *args, **kwargs):
        """Override save to validate"""
        self.clean()
        return super().save(*args, **kwargs)
    
    def toggle_completion(self):
        """Toggle the completion status of the task"""
        self.completed = not self.completed
        self.save()
        return self
    
    def __str__(self):
        return f"{self.name} ({'✓' if self.completed else '✗'})"
    
    def to_dict(self):
        """Convert model to dictionary for serialization"""
        return {
            'id': self.id,
            'name': self.name,
            'completed': self.completed,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
    
    @classmethod
    def get_stats(cls):
        """Get task statistics"""
        total = cls.objects.count()
        completed = cls.objects.filter(completed=True).count()
        pending = total - completed
        
        return {
            'total': total,
            'completed': completed,
            'pending': pending,
            'completion_rate': (completed / total * 100) if total > 0 else 0
        }
