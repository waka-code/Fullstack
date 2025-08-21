import { useCallback, useEffect, useState } from 'react'
import { Task, TaskFormData } from '../types';
import { useTaskContext } from './useTaskContext';
import { useNavigate } from 'react-router-dom';

export function useTaskList() {
  const {
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
    allTasks,
    fetchAllTasks
  } = useTaskContext();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks(1);
    fetchAllTasks()
  }, [fetchTasks, fetchAllTasks]);

  const handleCreateTask = useCallback(async (taskData: TaskFormData) => {
    try {
      await createTask(taskData);
      setIsCreating(true);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  }, [createTask]);

  const handleUpdateTask = useCallback(async (taskData: TaskFormData) => {
    if (!editingTask?.id) return;

    try {
      await updateTask(editingTask.id, taskData);
      setEditingTask(null);
      setIsCreating(true);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }, [editingTask?.id, updateTask]);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    navigate(`/`, {
      state: {
        task: {
          name: task.name,
          completed: task.completed
        }
      }
    });
    setIsCreating(false);
  }, [navigate]);

  const handleCancelEdit = useCallback(() => {
    setEditingTask(null);
    setIsCreating(true);
  }, []);

  const handleToggleTask = useCallback(async (id: string) => {
    try {
      await toggleTask(id);
      fetchAllTasks();
    } catch (error) {
      console.error('Error toggling task status:', error);
    }
  }, [toggleTask, fetchAllTasks]);

  const handleDeleteTask = useCallback(async (id: string) => {
    try {
      await deleteTask(id);
      fetchAllTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }, [deleteTask, fetchAllTasks]);

  const handlePageChange = useCallback((page: number) => {
    fetchTasks(page);
    fetchAllTasks();
  }, [fetchTasks, fetchAllTasks]);
  return {
    tasks,
    loading,
    error,
    currentPage,
    totalPages,
    editingTask,
    isCreating,
    handleCreateTask,
    handleUpdateTask,
    handleEditTask,
    handleCancelEdit,
    handleToggleTask,
    handleDeleteTask,
    handlePageChange,
    allTasks
  }
}
