import React, { useCallback } from 'react';
import { Task } from '../types';
import useTaskItem from '../hooks/useTaskItem';

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
        {/* Contenido de la tarea */}
        <div className="flex items-center space-x-3 flex-1">
          {/* Checkbox */}
          <button
            onClick={handleToggle}
            disabled={loading}
            className={`
              w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200
              ${task.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-green-400'
              }
              ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
            aria-label={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
          >
            {task.completed && (
              <svg
                className="w-3 h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          {/* Texto de la tarea */}
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

            {/* Información adicional */}
            <div className="flex items-center space-x-2 mt-1">
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

        {/* Botones de acción */}
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={handleEdit}
            disabled={loading}
            className={`
              p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200 rounded-md
              ${loading ? 'cursor-not-allowed' : 'hover:bg-blue-50'}
            `}
            aria-label="Editar tarea"
            title="Editar tarea"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className={`
              p-2 text-gray-400 hover:text-red-600 transition-colors duration-200 rounded-md
              ${loading ? 'cursor-not-allowed' : 'hover:bg-red-50'}
            `}
            aria-label="Eliminar tarea"
            title="Eliminar tarea"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
