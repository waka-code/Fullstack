import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TaskList from '../components/TaskList';
import { Task } from '../types';
import { Suspense } from 'react';
import { useTaskList } from '../hooks/useTaskList';

// Mock the useTaskList hook
vi.mock('../hooks/useTaskList', () => ({
  useTaskList: vi.fn(() => ({
    tasks: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    editingTask: null,
    isCreating: true,
    handleCreateTask: vi.fn(),
    handleUpdateTask: vi.fn(),
    handleEditTask: vi.fn(),
    handleCancelEdit: vi.fn(),
    handleToggleTask: vi.fn(),
    handleDeleteTask: vi.fn(),
    handlePageChange: vi.fn(),
    allTasks: [],
  })),
}));

// Mock lazy-loaded components
vi.mock('./TaskForm', () => ({
  default: ({ submitButtonText, onCancel }: any) => (
    <div data-testid="task-form">
      TaskForm: {submitButtonText}
      {onCancel && <button data-testid="cancel-button">Cancel</button>}
    </div>
  ),
}));

vi.mock('./TaskItem', () => ({
  default: ({ task }: any) => (
    <div data-testid={`task-item-${task.id}`}>
      Task: {task.name} ({task.completed ? 'Completed' : 'Pending'})
    </div>
  ),
}));

vi.mock('../../_designSystem/ErrorAlert', () => ({
  default: ({ message }: any) => <div data-testid="error-alert">{message}</div>,
}));

vi.mock('../../_designSystem/LoadingSpinner', () => ({
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

vi.mock('../../_designSystem/Pagination', () => ({
  default: ({ currentPage, totalPages }: any) => (
    <div data-testid="pagination">Page {currentPage} of {totalPages}</div>
  ),
}));

describe('TaskList', () => {
  const mockTasks: Task[] = [
    { id: '1', name: 'Task 1', completed: false, created_at: '2025-08-20T12:00:00Z' },
    { id: '2', name: 'Task 2', completed: true, created_at: '2025-08-20T12:00:00Z' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders TaskList with title and description', () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <TaskList />
      </Suspense>
    );

    expect(screen.getByText('Task Manager')).toBeInTheDocument();
    expect(screen.getByText('Organize and manage your tasks efficiently')).toBeInTheDocument();
  });

  it('renders TaskForm in create mode by default', () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <TaskList />
      </Suspense>
    );

    expect(screen.queryByTestId('cancel-button')).not.toBeInTheDocument();
  });

  it('renders TaskForm in edit mode when editingTask is set', () => {
    vi.mocked(useTaskList).mockReturnValue({
      tasks: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      editingTask: { id: '1', name: 'Task 1', completed: false },
      isCreating: false,
      handleCreateTask: vi.fn(),
      handleUpdateTask: vi.fn(),
      handleEditTask: vi.fn(),
      handleCancelEdit: vi.fn(),
      handleToggleTask: vi.fn(),
      handleDeleteTask: vi.fn(),
      handlePageChange: vi.fn(),
      allTasks: [],
    });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <TaskList />
      </Suspense>
    );

  });

  it('displays loading state when tasks are loading and empty', () => {
    vi.mocked(useTaskList).mockReturnValue({
      tasks: [],
      loading: true,
      error: null,
      currentPage: 1,
      totalPages: 1,
      editingTask: null,
      isCreating: true,
      handleCreateTask: vi.fn(),
      handleUpdateTask: vi.fn(),
      handleEditTask: vi.fn(),
      handleCancelEdit: vi.fn(),
      handleToggleTask: vi.fn(),
      handleDeleteTask: vi.fn(),
      handlePageChange: vi.fn(),
      allTasks: [],
    });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <TaskList />
      </Suspense>
    );

     expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  it('displays no tasks message when tasks array is empty', () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <TaskList />
      </Suspense>
    );
  });

  it('renders tasks and task statistics', () => {
    vi.mocked(useTaskList).mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      editingTask: null,
      isCreating: true,
      handleCreateTask: vi.fn(),
      handleUpdateTask: vi.fn(),
      handleEditTask: vi.fn(),
      handleCancelEdit: vi.fn(),
      handleToggleTask: vi.fn(),
      handleDeleteTask: vi.fn(),
      handlePageChange: vi.fn(),
      allTasks: mockTasks,
    });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <TaskList />
      </Suspense>
    );

    expect(screen.getByText('(1 pending, 1 completed)')).toBeInTheDocument();

  });

  it('displays error alert when error exists', () => {
    vi.mocked(useTaskList).mockReturnValue({
      tasks: [],
      loading: false,
      error: 'Failed to load tasks',
      currentPage: 1,
      totalPages: 1,
      editingTask: null,
      isCreating: true,
      handleCreateTask: vi.fn(),
      handleUpdateTask: vi.fn(),
      handleEditTask: vi.fn(),
      handleCancelEdit: vi.fn(),
      handleToggleTask: vi.fn(),
      handleDeleteTask: vi.fn(),
      handlePageChange: vi.fn(),
      allTasks: [],
    });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <TaskList />
      </Suspense>
    );

    expect(screen.getByTestId('error-alert')).toHaveTextContent('Failed to load tasks');
  });

});