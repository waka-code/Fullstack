import { useCallback, useState } from 'react'
import { TaskItemProps } from '../components/TaskItem';

function useTaskItem({ task,
 onToggle,
 onEdit,
 onDelete,
 loading = false }: TaskItemProps) {
 const [showConfirm, setShowConfirm] = useState(false);

 const handleToggle = useCallback(async () => {
  if (!loading && task.id) {
   await onToggle(task.id);
  }
 }, [loading, onToggle, task.id]);

 const handleDelete = useCallback(async () => {
  if (!loading && task.id) {
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
  handleEdit,
  handleDelete,
  showConfirm,
  setShowConfirm
 }
}

export default useTaskItem