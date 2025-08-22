import { TaskFormData } from '../types';
import { useTaskForm } from '../hooks/useTaskForm';
import Button from '../../_designSystem/Button';

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
  initialValues = { name: undefined, completed: false },
  submitButtonText = 'Create Task',
  onCancel
}) => {

  const { formData, errors, handleInputChange, handleSubmit } = useTaskForm({
    onSubmit,
    initialValues
  });

  return (
    <form onSubmit={handleSubmit} className="card mb-2">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {initialValues.name ? 'Edit Task' : 'New Task'}
      </h2>

      <div className="space-y-4">
        <div className="w-full border-amber-300">
          <label htmlFor="taskName" className="block text-sm font-medium text-gray-700 mb-2">
            Task Name *
          </label>
          <div className="w-full">
            <input
              type="text"
              id="taskName"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              placeholder="Enter task name..."
              disabled={loading}
              maxLength={255}
              required
            />
          </div>

          {errors.name && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.name}
            </p>
          )}
        </div>

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
            Mark as completed
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !formData.name?.trim()}
            loading={loading}
            fullWidth
          >
            {submitButtonText}
          </Button>

          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default TaskForm;
