import axios from 'axios';
import { Task, TaskFormData, ApiResponse } from '../types';

const API_BASE_URL = (import.meta as any).env?.API_BASE_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const taskService = {
  async getTasks(page: number = 1): Promise<ApiResponse<Task>> {
    const response = await api.get<ApiResponse<Task>>(`/tasks/?page=${page}`);
    return response.data;
  },

  async getAllTasks(): Promise<Task[]> {
    const response = await api.get<Task[]>(`/tasks/all/`);
    return response.data;
  },

  async getTask(id: string): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${id}/`);
    return response.data;
  },

  async createTask(taskData: TaskFormData): Promise<Task> {
    const response = await api.post<Task>('/tasks/', taskData);
    return response.data;
  },

  async updateTask(id: string, taskData: Partial<TaskFormData>): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${id}/`, taskData);
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}/`);
  },

  async toggleTaskCompletion(id: string, completed: boolean): Promise<Task> {
    const response = await api.patch<Task>(`/tasks/${id}/`, { completed });
    return response.data;
  },
};

export default api;
