from django.apps import AppConfig


class TasksConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tasks'
    verbose_name = 'Task Manager'
    
    def ready(self):
        """
        Called when the app is ready. Can be used to perform
        initialization tasks like registering signals.
        """
        pass
