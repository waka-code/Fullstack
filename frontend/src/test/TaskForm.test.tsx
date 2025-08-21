import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TaskForm, { TaskFormProps } from '../components/TaskForm';
import { useTaskForm } from '../hooks/useTaskForm';

vi.mock('../hooks/useTaskForm', () => ({
 useTaskForm: vi.fn(() => ({
  formData: { name: '', completed: false },
  errors: {},
  handleInputChange: vi.fn(),
  handleSubmit: vi.fn((e) => e.preventDefault()),
 })),
}));

vi.mock('../../_designSystem/Button', () => ({
 default: ({ children, loading, fullWidth, ...props }: any) => <button {...props}>{children}</button>,
}));

describe('TaskForm', () => {
 const defaultProps: TaskFormProps = {
  onSubmit: vi.fn(),
  loading: false,
  initialValues: { name: '', completed: false },
  submitButtonText: 'Create Task',
 };

 beforeEach(() => {
  vi.clearAllMocks();
 });

 it('renders form with correct initial values', () => {
  render(<TaskForm {...defaultProps} />);

  expect(screen.getByText('New Task')).toBeInTheDocument();
  expect(screen.getByLabelText('Task Name *')).toHaveValue('');
  expect(screen.getByLabelText('Mark as completed')).not.toBeChecked();
  expect(screen.getByText('Create Task')).toBeInTheDocument();
 });

 it('renders edit mode with initial task name', () => {
  const props = {
   ...defaultProps,
   initialValues: { name: 'Test Task', completed: true },
  };

  render(<TaskForm {...props} />);

  expect(screen.getByText('Edit Task')).toBeInTheDocument();
 });

 it('disables inputs and buttons when loading', () => {
  render(<TaskForm {...defaultProps} loading={true} />);

  expect(screen.getByLabelText('Task Name *')).toBeDisabled();
  expect(screen.getByLabelText('Mark as completed')).toBeDisabled();
  expect(screen.getByText('Create Task')).toBeDisabled();
 });

 it('calls handleInputChange when typing in name input', () => {
  const mockHandleInputChange = vi.fn();
  vi.mocked(useTaskForm).mockReturnValue({
   formData: { name: '', completed: false },
   errors: {},
   handleInputChange: mockHandleInputChange,
   handleSubmit: vi.fn(),
  });

  render(<TaskForm {...defaultProps} />);

  const input = screen.getByLabelText('Task Name *');
  fireEvent.change(input, { target: { value: 'New Task' } });

  expect(mockHandleInputChange).toHaveBeenCalled();
 });

 it('disables submit button when name is empty', () => {
  vi.mocked(useTaskForm).mockReturnValue({
   formData: { name: '', completed: false },
   errors: {},
   handleInputChange: vi.fn(),
   handleSubmit: vi.fn(),
  });

  render(<TaskForm {...defaultProps} />);

  expect(screen.getByText('Create Task')).toBeDisabled();
 });

 it('renders cancel button and calls onCancel when clicked', () => {
  const onCancel = vi.fn();
  render(<TaskForm {...defaultProps} onCancel={onCancel} />);

  const cancelButton = screen.getByText('Cancel');
  expect(cancelButton).toBeInTheDocument();

  fireEvent.click(cancelButton);
  expect(onCancel).toHaveBeenCalled();
 });

 it('displays error message when errors.name exists', () => {
  vi.mocked(useTaskForm).mockReturnValue({
   formData: { name: '', completed: false },
   errors: { name: 'Task name is required' },
   handleInputChange: vi.fn(),
   handleSubmit: vi.fn(),
  });

  render(<TaskForm {...defaultProps} />);

  expect(screen.getByText('Task name is required')).toBeInTheDocument();
  expect(screen.getByLabelText('Task Name *')).toHaveClass('border-red-500');
 });
});