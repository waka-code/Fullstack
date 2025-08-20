import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Task, TaskFormData, TaskContextType } from '../types';
import { taskService } from '../services/taskService';

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const handleError = useCallback((error: any, defaultMessage: string) => {
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.detail || 
                        error.message || 
                        defaultMessage;
    setError(errorMessage);
  },[])

  const fetchTasks = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await taskService.getTasks(page);
      setTasks(response.results);
      setCurrentPage(page);
      setTotalPages(Math.ceil(response.count / 10));
    } catch (error) {
      handleError(error, 'Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData: TaskFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prevTasks => [newTask, ...prevTasks]);
    } catch (error) {
      handleError(error, 'Error al crear la tarea');
      throw error; 
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (id: string, taskData: Partial<TaskFormData>) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === id ? updatedTask : task)
      );
    } catch (error) {
      handleError(error, 'Error al actualizar la tarea');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await taskService.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (error) {
      handleError(error, 'Error al eliminar la tarea');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleTask = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    setError(null);
    
    try {
      const updatedTask = await taskService.toggleTaskCompletion(id, !task.completed);
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === id ? updatedTask : t)
      );
    } catch (error) {
      handleError(error, 'Error al cambiar el estado de la tarea');
      throw error;
    }
  }, [tasks]);

  const contextValue: TaskContextType = {
    tasks,
    loading,
    error,
    currentPage,
    totalPages,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};


