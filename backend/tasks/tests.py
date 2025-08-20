from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.core.cache import cache
from .models import Task
import json


class TaskModelTest(TestCase):
    """Tests para el modelo Task."""
    
    def setUp(self):
        """Configuración inicial para los tests."""
        self.task_data = {
            'name': 'Test Task',
            'completed': False
        }
    
    def test_create_task(self):
        """Test de creación de tarea."""
        task = Task.objects.create(**self.task_data)
        self.assertEqual(task.name, 'Test Task')
        self.assertFalse(task.completed)
        self.assertIsNotNone(task.id)
        self.assertIsNotNone(task.created_at)
        self.assertIsNotNone(task.updated_at)
    
    def test_task_str_representation(self):
        """Test de representación en string del modelo."""
        task = Task.objects.create(**self.task_data)
        expected = f"{task.name} ({'✓' if task.completed else '✗'})"
        self.assertEqual(str(task), expected)
        
        task.completed = True
        task.save()
        expected = f"{task.name} ({'✓' if task.completed else '✗'})"
        self.assertEqual(str(task), expected)
    
    def test_toggle_completion(self):
        """Test de alternancia de estado completado."""
        task = Task.objects.create(**self.task_data)
        self.assertFalse(task.completed)
        
        result = task.toggle_completion()
        self.assertTrue(result.completed)  # El método retorna self
        self.assertTrue(task.completed)
        
        result = task.toggle_completion()
        self.assertFalse(result.completed)  # El método retorna self
        self.assertFalse(task.completed)


class TaskAPITest(APITestCase):
    """Tests para la API de tareas."""
    
    def setUp(self):
        """Configuración inicial para tests de API."""
        self.task_data = {
            'name': 'Test Task API',
            'completed': False
        }
        self.task = Task.objects.create(**self.task_data)
        # Limpiar cache antes de cada test
        cache.clear()
    
    def test_get_tasks_list(self):
        """Test para obtener lista de tareas."""
        url = reverse('task-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], 'Test Task API')
    
    def test_create_task_success(self):
        """Test creación exitosa de tarea."""
        url = reverse('task-list')
        new_task_data = {
            'name': 'Nueva Tarea API',
            'completed': False
        }
        
        response = self.client.post(url, new_task_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Nueva Tarea API')
        self.assertFalse(response.data['completed'])
        self.assertEqual(Task.objects.count(), 2)
    
    def test_create_task_validation_error(self):
        """Test validación en creación de tarea."""
        url = reverse('task-list')
        invalid_data = {
            'name': '',  # Nombre vacío
            'completed': False
        }
        
        response = self.client.post(url, invalid_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)
    
    def test_update_task(self):
        """Test actualización de tarea."""
        url = reverse('task-detail', kwargs={'pk': self.task.id})
        updated_data = {
            'name': 'Tarea Actualizada',
            'completed': True
        }
        
        response = self.client.put(url, updated_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Tarea Actualizada')
        self.assertTrue(response.data['completed'])
        
        # Verificar en DB
        self.task.refresh_from_db()
        self.assertEqual(self.task.name, 'Tarea Actualizada')
        self.assertTrue(self.task.completed)
    
    def test_delete_task(self):
        """Test eliminación de tarea."""
        url = reverse('task-detail', kwargs={'pk': self.task.id})
        
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)  # DELETE retorna 204
        self.assertEqual(Task.objects.count(), 0)
    
    def test_toggle_task_endpoint(self):
        """Test endpoint de toggle de tarea usando PATCH."""
        url = reverse('task-detail', kwargs={'pk': self.task.id})
        
        # Usar PATCH para cambiar el estado completed
        response = self.client.patch(url, {'completed': True}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['completed'])
        
        # Verificar en DB
        self.task.refresh_from_db()
        self.assertTrue(self.task.completed)
    
    def test_get_stats_endpoint(self):
        """Test endpoint de estadísticas."""
        # Crear tareas adicionales para stats
        Task.objects.create(name='Completed Task', completed=True)
        Task.objects.create(name='Pending Task', completed=False)
        
        url = '/api/tasks/stats/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total', response.data)  # Cambio: 'total' en lugar de 'total_tasks'
        self.assertIn('completed', response.data)  # Cambio: 'completed' en lugar de 'completed_tasks'
        self.assertIn('pending', response.data)  # Cambio: 'pending' en lugar de 'pending_tasks'
        self.assertEqual(response.data['total'], 3)
        self.assertEqual(response.data['completed'], 1)
        self.assertEqual(response.data['pending'], 2)
    
    def test_get_completed_tasks(self):
        """Test endpoint de tareas completadas."""
        # Crear tarea completada
        Task.objects.create(name='Completed Task', completed=True)
        
        url = '/api/tasks/completed/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertTrue(response.data['results'][0]['completed'])
    
    def test_clear_completed_tasks(self):
        """Test endpoint para limpiar tareas completadas."""
        # Crear varias tareas completadas
        Task.objects.create(name='Completed 1', completed=True)
        Task.objects.create(name='Completed 2', completed=True)
        
        url = '/api/tasks/clear_completed/'
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('2 completed tasks deleted', response.data['message'])
        
        # Verificar que solo quedan tareas pendientes
        remaining_tasks = Task.objects.all()
        self.assertEqual(remaining_tasks.count(), 1)  # Solo la del setUp
        self.assertFalse(remaining_tasks.first().completed)
    
    def test_status_display_property(self):
        """Test de propiedad status_display."""
        task = Task.objects.create(**self.task_data)
        self.assertEqual(task.status_display, "Pendiente")
        
        task.completed = True
        self.assertEqual(task.status_display, "Completada")
    
    def test_name_validation(self):
        """Test de validación del nombre."""
        # Test nombre vacío
        with self.assertRaises(ValueError):
            Task(name="", completed=False).save()
        
        # Test nombre solo espacios
        with self.assertRaises(ValueError):
            Task(name="   ", completed=False).save()


class TaskAPITest(APITestCase):
    """Tests para la API de Tasks."""
    
    def setUp(self):
        """Configuración inicial para los tests de API."""
        self.task_data = {
            'name': 'Test Task API',
            'completed': False
        }
        self.task = Task.objects.create(**self.task_data)
    
    def test_get_task_list(self):
        """Test de obtener lista de tareas."""
        url = reverse('task-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
    
    def test_create_task_via_api(self):
        """Test de crear tarea vía API."""
        url = reverse('task-list')
        data = {
            'name': 'Nueva Tarea API',
            'completed': False
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], data['name'])
        self.assertEqual(response.data['completed'], data['completed'])
    
    def test_get_task_detail(self):
        """Test de obtener detalle de tarea."""
        url = reverse('task-detail', kwargs={'pk': self.task.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.task.name)
    
    def test_update_task(self):
        """Test de actualizar tarea."""
        url = reverse('task-detail', kwargs={'pk': self.task.id})
        data = {
            'name': 'Tarea Actualizada',
            'completed': True
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], data['name'])
        self.assertEqual(response.data['completed'], data['completed'])
    
    def test_partial_update_task(self):
        """Test de actualización parcial de tarea."""
        url = reverse('task-detail', kwargs={'pk': self.task.id})
        data = {'completed': True}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['completed'], True)
        self.assertEqual(response.data['name'], self.task.name)
    
    def test_delete_task(self):
        """Test eliminación de tarea."""
        url = reverse('task-detail', kwargs={'pk': self.task.id})
        
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)  # DELETE retorna 204
        self.assertEqual(Task.objects.count(), 0)
    
    def test_toggle_task_endpoint(self):
        """Test endpoint de toggle de tarea usando PATCH."""
        url = reverse('task-detail', kwargs={'pk': self.task.id})
        
        # Usar PATCH para cambiar el estado completed
        response = self.client.patch(url, {'completed': True}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['completed'])
        
        # Verificar en DB
        self.task.refresh_from_db()
        self.assertTrue(self.task.completed)
    
    def test_get_completed_tasks(self):
        """Test de obtener tareas completadas."""
        # Crear una tarea completada
        Task.objects.create(name='Tarea Completada', completed=True)
        
        url = reverse('task-completed')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verificar que solo devuelve tareas completadas
        for task in response.data['results']:
            self.assertTrue(task['completed'])
    
    def test_get_pending_tasks(self):
        """Test de obtener tareas pendientes."""
        url = reverse('task-pending')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verificar que solo devuelve tareas pendientes
        for task in response.data['results']:
            self.assertFalse(task['completed'])
    
    def test_get_task_stats(self):
        """Test de obtener estadísticas de tareas."""
        # Crear algunas tareas más para tener datos
        Task.objects.create(name='Tarea Completada 1', completed=True)
        Task.objects.create(name='Tarea Completada 2', completed=True)
        Task.objects.create(name='Tarea Pendiente', completed=False)
        
        url = '/api/tasks/stats/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verificar que devuelve las estadísticas correctas (nombres reales del modelo)
        self.assertIn('total', response.data)
        self.assertIn('completed', response.data)
        self.assertIn('pending', response.data)
        self.assertIn('completion_rate', response.data)
    
    def test_create_task_validation_error(self):
        """Test de validación de errores al crear tarea."""
        url = reverse('task-list')
        data = {'name': ''}  # Nombre vacío
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_search_tasks(self):
        """Test de búsqueda de tareas."""
        Task.objects.create(name='Tarea Específica', completed=False)
        
        url = reverse('task-list')
        response = self.client.get(url, {'search': 'Específica'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)
    
    def test_filter_tasks_by_completion(self):
        """Test de filtro de tareas por estado de completado."""
        Task.objects.create(name='Tarea Completada Filter', completed=True)
        
        url = reverse('task-list')
        response = self.client.get(url, {'completed': 'true'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        for task in response.data['results']:
            self.assertTrue(task['completed'])
