from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.core.cache import cache
from .models import Task

class TaskModelTest(TestCase):
    def setUp(self):
        self.task_data = {
            'name': 'Test Task',
            'completed': False
        }
    
    def test_create_task(self):
        task = Task.objects.create(**self.task_data)
        self.assertEqual(task.name, 'Test Task')
        self.assertFalse(task.completed)
        self.assertIsNotNone(task.id)
        self.assertIsNotNone(task.created_at)
        self.assertIsNotNone(task.updated_at)
    
    def test_task_str_representation(self):
        task = Task.objects.create(**self.task_data)
        expected = f"{task.name} ({'✓' if task.completed else '✗'})"
        self.assertEqual(str(task), expected)
        
        task.completed = True
        task.save()
        expected = f"{task.name} ({'✓' if task.completed else '✗'})"
        self.assertEqual(str(task), expected)
    
    def test_toggle_completion(self):
        task = Task.objects.create(**self.task_data)
        self.assertFalse(task.completed)
        
        result = task.toggle_completion()
        self.assertTrue(result.completed)
        self.assertTrue(task.completed)
        
        result = task.toggle_completion()
        self.assertFalse(result.completed) 
        self.assertFalse(task.completed)

class TaskAPITest(APITestCase):
    def setUp(self):
        self.task_data = {
            'name': 'Test Task API',
            'completed': False
        }
        self.task = Task.objects.create(**self.task_data)
    
    def test_get_task_list(self):
        url = reverse('task-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
    
    def test_create_task_via_api(self):
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
        url = reverse('task-detail', kwargs={'pk': self.task.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.task.name)
    
    def test_update_task(self):
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
        url = reverse('task-detail', kwargs={'pk': self.task.id})
        data = {'completed': True}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['completed'], True)
        self.assertEqual(response.data['name'], self.task.name)
    
    def test_delete_task(self):
        url = reverse('task-detail', kwargs={'pk': self.task.id})
        
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)  
        self.assertEqual(Task.objects.count(), 0)
    
    def test_toggle_task_endpoint(self):
        url = reverse('task-detail', kwargs={'pk': self.task.id})
        
        response = self.client.patch(url, {'completed': True}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['completed'])
        
        self.task.refresh_from_db()
        self.assertTrue(self.task.completed)
    
    def test_get_completed_tasks(self):
        Task.objects.create(name='Tarea Completada', completed=True)
        
        url = reverse('task-completed')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        for task in response.data['results']:
            self.assertTrue(task['completed'])
    
    def test_get_pending_tasks(self):
        url = reverse('task-pending')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        for task in response.data['results']:
            self.assertFalse(task['completed'])
    
    def test_get_task_stats(self):
        Task.objects.create(name='Tarea Completada 1', completed=True)
        Task.objects.create(name='Tarea Completada 2', completed=True)
        Task.objects.create(name='Tarea Pendiente', completed=False)
        
        url = '/api/tasks/stats/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.assertIn('total', response.data)
        self.assertIn('completed', response.data)
        self.assertIn('pending', response.data)
        self.assertIn('completion_rate', response.data)
    
    def test_create_task_validation_error(self):
        url = reverse('task-list')
        data = {'name': ''}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_search_tasks(self):
        Task.objects.create(name='Tarea Específica', completed=False)
        
        url = reverse('task-list')
        response = self.client.get(url, {'search': 'Específica'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)
    
    def test_filter_tasks_by_completion(self):
        Task.objects.create(name='Tarea Completada Filter', completed=True)
        
        url = reverse('task-list')
        response = self.client.get(url, {'completed': 'true'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        for task in response.data['results']:
            self.assertTrue(task['completed'])
