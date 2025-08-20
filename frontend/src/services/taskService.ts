import axios from 'axios';
import { Task, TaskFormData, ApiResponse } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Configuración de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const taskService = {
  // Obtener todas las tareas con paginación
  async getTasks(page: number = 1): Promise<ApiResponse<Task>> {
    const response = await api.get<ApiResponse<Task>>(`/tasks/?page=${page}`);
    return response.data;
  },

  // Obtener una tarea por ID
  async getTask(id: string): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${id}/`);
    return response.data;
  },

  // Crear una nueva tarea
  async createTask(taskData: TaskFormData): Promise<Task> {
    const response = await api.post<Task>('/tasks/', taskData);
    return response.data;
  },

  // Actualizar una tarea existente
  async updateTask(id: string, taskData: Partial<TaskFormData>): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${id}/`, taskData);
    return response.data;
  },

  // Actualizar parcialmente una tarea
  async patchTask(id: string, taskData: Partial<TaskFormData>): Promise<Task> {
    const response = await api.patch<Task>(`/tasks/${id}/`, taskData);
    return response.data;
  },

  // Eliminar una tarea
  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}/`);
  },

  // Alternar estado de completado de una tarea
  async toggleTaskCompletion(id: string, completed: boolean): Promise<Task> {
    const response = await api.patch<Task>(`/tasks/${id}/`, { completed });
    return response.data;
  },
};

export default api;
