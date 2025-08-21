import { Task } from '../types';
import useTaskItem from '../hooks/useTaskItem';
import { IconCompleted } from '../asset/svg/IconCompleted';
import { IconEdit } from '../asset/svg/IconEdit';
import { IconDelete } from '../asset/svg/IconDelete';

export interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  loading = false
}) => {
  const { handleToggle, handleDelete, handleEdit } = useTaskItem({
    task,
    onToggle,
    onEdit,
    onDelete,
    loading
  });

  return (
    <div className={`
      card transition-all duration-200 hover:shadow-lg 
      ${task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}
      ${loading ? 'opacity-50 pointer-events-none' : ''}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 p-1">
          <IconCompleted loading={loading} onclick={handleToggle} isCompleted={task.completed} />

          <div className="flex-1 min-w-0">
            <p className={`
              text-sm font-medium transition-colors duration-200
              ${task.completed
                ? 'text-green-700 line-through'
                : 'text-gray-900'
              }
            `}>
              {task.name}
            </p>

            <div className="flex items-center space-x-2 m-1">
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${task.completed
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
                }
              `}>
                {task.completed ? 'Completada' : 'Pendiente'}
              </span>

              {task.created_at && (
                <span className="text-xs text-gray-500">
                  Creada: {new Date(task.created_at).toLocaleDateString('es-ES')}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <IconEdit loading={loading} onclick={handleEdit} />
          <IconDelete
            loading={loading}
            onclick={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
