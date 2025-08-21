import { useCallback, useEffect, useState } from 'react'
import { Task, TaskFormData } from '../types';
import { useTaskContext } from './useTaskContext';

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

 useEffect(() => {
  fetchTasks(1);
 }, []);

 const handleCreateTask = useCallback(async (taskData: TaskFormData) => {
  try {
   await createTask(taskData);
   setIsCreating(true);
  } catch (error) {
   console.error('Error al crear tarea:', error);
  }
 }, [createTask]);

 const handleUpdateTask = useCallback(async (taskData: TaskFormData) => {
  if (!editingTask?.id) return;

  try {
   await updateTask(editingTask.id, taskData);
   setEditingTask(null);
   setIsCreating(true);
  } catch (error) {
   console.error('Error al actualizar tarea:', error);
  }
 }, [editingTask?.id, updateTask]);

 const handleEditTask = useCallback((task: Task) => {
  setEditingTask(task);
  setIsCreating(false);
  console.log('Editando tarea:', task);
 }, []);

 const handleCancelEdit = useCallback(() => {
  setEditingTask(null);
  setIsCreating(true);
 }, []);

 const handleToggleTask = useCallback(async (id: string) => {
  try {
   await toggleTask(id);
  } catch (error) {
   console.error('Error al cambiar estado de tarea:', error);
  }
 }, [toggleTask]);

 const handleDeleteTask = useCallback(async (id: string) => {
  try {
   await deleteTask(id);
  } catch (error) {
   console.error('Error al eliminar tarea:', error);
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