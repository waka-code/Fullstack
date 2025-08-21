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
  const [allTasks, setAllTasks] = useState<Task[]>([]);

  const handleError = useCallback((error: any, defaultMessage: string) => {
    let errorMessage = defaultMessage;
    if (error?.message) {
      errorMessage = error.message;
    } else if (error?.response?.data) {
      if (error.response.data.name && Array.isArray(error.response.data.name)) {
        errorMessage = error.response.data.name[0];
      } else if (typeof error.response.data.detail === 'string') {
        errorMessage = error.response.data.detail;
      } else if (typeof error.response.data.message === 'string') {
        errorMessage = error.response.data.message;
      }
    }
    setError(errorMessage);
  }, []);

  const fetchAllTasks = useCallback(async () => {
    try {
      const response = await taskService.getAllTasks();
      setAllTasks(response);
    } catch (error) {
      handleError(error, 'Error loading tasks');
    }
  }, [handleError, taskService.getAllTasks]);

  const fetchTasks = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await taskService.getTasks(page);
      setTasks(response.results);
      setCurrentPage(page);
      setTotalPages(Math.ceil(response.count / 5)); 
    } catch (error) {
      handleError(error, 'Error loading tasks');
    } finally {
      setLoading(false);
    }
  }, [handleError, taskService.getTasks]);

  const createTask = useCallback(async (taskData: TaskFormData) => {
    setLoading(true);
    setError(null);

    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prevTasks => [newTask, ...prevTasks]);
      await fetchTasks(1);
    } catch (error) {
      handleError(error, 'Error creating task');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError, fetchTasks, taskService.createTask]);

  const updateTask = useCallback(async (id: string, taskData: Partial<TaskFormData>) => {
    setLoading(true);
    setError(null);

    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? updatedTask : task
        )
      );
    } catch (error) {
      handleError(error, 'Error updating task');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError, taskService.updateTask]);

  const deleteTask = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await taskService.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      const remainingTasksOnPage = tasks.length - 1;
      const targetPage = remainingTasksOnPage === 0 && currentPage > 1 ? currentPage - 1 : currentPage;
      await fetchTasks(targetPage);
    } catch (error) {
      handleError(error, 'Error deleting task');
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
      const updatedTask = await taskService.toggleTaskCompletion(id, !task.completed);
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? updatedTask : task
        )
      );
    } catch (error) {
      handleError(error, 'Error toggling task status');
      throw error;
    }
  }, [tasks, handleError, taskService.toggleTaskCompletion]);

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
    fetchAllTasks,
    allTasks
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};


