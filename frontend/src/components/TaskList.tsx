import React from 'react';
import useTaskList from '../hooks/useTaskList';
import ErrorAlert from '../../_designSystem/ErrorAlert';

const TaskItem = React.lazy(() => import('./TaskItem'));
const TaskForm = React.lazy(() => import('./TaskForm'));
const LoadingSpinner = React.lazy(() => import('../../_designSystem/LoadingSpinner'));
const Pagination = React.lazy(() => import('../../_designSystem/Pagination'));

const TaskList: React.FC = () => {
  const {
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
  } = useTaskList()

  return (
    <div className="min-h-screen bg-gray-50 py-2">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Task Manager
          </h1>
          <p className="text-gray-600">
            Organize and manage your tasks efficiently
          </p>
        </div>

        <React.Suspense fallback={<div className="animate-pulse h-20 bg-gray-200 rounded-lg mb-2"></div>}>
          <TaskForm
            onSubmit={isCreating ? handleCreateTask : handleUpdateTask}
            loading={loading}
            initialValues={
              editingTask
                ? { name: editingTask.name, completed: editingTask.completed }
                : { name: '', completed: false }
            }
            submitButtonText={isCreating ? 'Create Task' : 'Update Task'}
            onCancel={!isCreating ? handleCancelEdit : undefined}
          />
        </React.Suspense>

        {error && (
          <React.Suspense fallback={<LoadingSpinner />}>
            <ErrorAlert message={error} />
          </React.Suspense>
        )}

        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-1 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              My Tasks
              {tasks.length > 0 && (
                <span className="ml-2 text-sm text-gray-500">
                  ({tasks.filter(t => !t.completed).length} pending, {tasks.filter(t => t.completed).length} completed)
                </span>
              )}
            </h2>
          </div>

          <div className="p-6">
            {loading && tasks.length === 0 ? (
              <div className="text-center py-12">
                <React.Suspense fallback={<div className="animate-spin h-8 w-8 border-2 border-blue-600 rounded-full border-t-transparent mx-auto"></div>}>
                  <LoadingSpinner size="lg" />
                </React.Suspense>
                <p className="mt-4 text-gray-500">Loading tasks...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first task using the form above.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <React.Suspense fallback={<div className="animate-pulse space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>)}</div>}>
                  {tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      loading={loading}
                    />
                  ))}
                </React.Suspense>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="px-2 py-2 border-t border-gray-200">
              <React.Suspense fallback={<div className="animate-pulse h-8 bg-gray-200 rounded"></div>}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  loading={loading}
                />
              </React.Suspense>
            </div>
          )}
        </div>

        {tasks.length > 0 && (
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {tasks.filter(t => !t.completed).length}
                </div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {tasks.filter(t => t.completed).length}
                </div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
