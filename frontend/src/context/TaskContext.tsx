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
      setTotalPages(Math.ceil(response.count / 5));
    } catch (error) {
      handleError(error, 'Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  }, [handleError, taskService.getTasks]);

  const createTask = useCallback(async (taskData: TaskFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      await taskService.createTask(taskData);
      await fetchTasks(1); 
    } catch (error) {
      handleError(error, 'Error al crear la tarea');
      throw error; 
    } finally {
      setLoading(false);
    }
  }, [handleError, fetchTasks,  taskService.createTask]);

  const updateTask = useCallback(async (id: string, taskData: Partial<TaskFormData>) => {
    setLoading(true);
    setError(null);
    
    try {
      await taskService.updateTask(id, taskData);
      await fetchTasks(currentPage);
    } catch (error) {
      handleError(error, 'Error al actualizar la tarea');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError, fetchTasks, currentPage, taskService.updateTask]);

  const deleteTask = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await taskService.deleteTask(id);
      const remainingTasksOnPage = tasks.length - 1;
      const targetPage = remainingTasksOnPage === 0 && currentPage > 1 ? currentPage - 1 : currentPage;
      await fetchTasks(targetPage);
    } catch (error) {
      handleError(error, 'Error al eliminar la tarea');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError, fetchTasks, currentPage, tasks.length, taskService.deleteTask]);

  const toggleTask = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    setError(null);
    
    try {
      await taskService.toggleTaskCompletion(id, !task.completed);
      await fetchTasks(currentPage);
    } catch (error) {
      handleError(error, 'Error al cambiar el estado de la tarea');
      throw error;
    }
  }, [tasks, handleError, fetchTasks, currentPage, taskService.toggleTaskCompletion]);

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


