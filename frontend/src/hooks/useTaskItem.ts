import { useCallback } from 'react'
import { TaskItemProps } from '../components/TaskItem';

function useTaskItem({ task,
 onToggle,
 onEdit,
 onDelete,
 loading = false }: TaskItemProps) {
 const handleToggle = useCallback(async () => {
  if (!loading && task.id) {
   await onToggle(task.id);
  }
 }, [loading, onToggle, task.id]);

 const handleDelete = useCallback(async () => {
  if (!loading && task.id && window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
   await onDelete(task.id);
  }
 }, [loading, onDelete, task.id]);

 const handleEdit = useCallback(() => {
  if (!loading) {
   onEdit(task);
  }
 }, [loading, onEdit, task]);
 return {
  handleToggle,
  handleDelete,
  handleEdit
 }
}

export default useTaskItem