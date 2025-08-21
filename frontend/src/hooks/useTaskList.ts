import { useCallback, useEffect, useState } from 'react'
import { Task, TaskFormData } from '../types';
import { useTaskContext } from './useTaskContext';
import { useNavigate } from 'react-router-dom';

function useTaskList() {
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
    toggleTask
  } = useTaskContext();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks(1);
  }, [fetchTasks]);

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
    } catch (error) {
      console.error('Error toggling task status:', error);
    }
  }, [toggleTask]);

  const handleDeleteTask = useCallback(async (id: string) => {
    try {
      await deleteTask(id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }, [deleteTask]);

  const handlePageChange = useCallback((page: number) => {
    fetchTasks(page);
  }, [fetchTasks]);
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
    handlePageChange
  }
}

export default useTaskList