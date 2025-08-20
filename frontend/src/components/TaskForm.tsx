import { TaskFormData } from '../types';
import { useTaskForm } from '../hooks/useTaskForm';

export interface TaskFormProps {
  onSubmit: (task: TaskFormData) => Promise<void>;
  loading?: boolean;
  initialValues?: TaskFormData;
  submitButtonText?: string;
  onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  loading = false,
  initialValues = { name: '', completed: false },
  submitButtonText = 'Crear Tarea',
  onCancel
}) => {

  const { formData, errors, handleInputChange, handleSubmit } = useTaskForm({
    onSubmit,
    initialValues
  });

  return (
    <form onSubmit={handleSubmit} className="card mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {initialValues.name ? 'Editar Tarea' : 'Nueva Tarea'}
      </h2>

      <div className="space-y-4">
        {/* Campo de nombre */}
        <div>
          <label htmlFor="taskName" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la tarea *
          </label>
          <input
            type="text"
            id="taskName"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Ingresa el nombre de la tarea..."
            disabled={loading}
            maxLength={255}
            required
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        {/* Campo de estado completado */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="taskCompleted"
            name="completed"
            checked={formData.completed}
            onChange={handleInputChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            disabled={loading}
          />
          <label htmlFor="taskCompleted" className="ml-2 block text-sm text-gray-700">
            Marcar como completada
          </label>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading || !formData.name.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : submitButtonText}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default TaskForm;
