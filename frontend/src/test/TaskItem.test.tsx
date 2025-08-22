import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TaskItem, { TaskItemProps } from '../components/TaskItem';
import { useTaskItem } from '../hooks/useTaskItem';

vi.mock('../hooks/useTaskItem', () => ({
  useTaskItem: vi.fn(() => ({
    handleToggle: vi.fn(),
    handleEdit: vi.fn(),
    handleDelete: vi.fn(),
    showConfirm: false,
    setShowConfirm: vi.fn(),
  })),
}));

vi.mock('../asset/svg/IconCompleted', () => ({
  IconCompleted: ({ loading, onclick, isCompleted }: { loading: boolean; onclick: () => void; isCompleted: boolean }) => (
    <button data-testid="completed-icon" disabled={loading} onClick={onclick}>
      {isCompleted ? 'Completed' : 'Not Completed'}
    </button>
  ),
}));

vi.mock('../asset/svg/IconEdit', () => ({
  IconEdit: ({ loading, onclick }: { loading: boolean; onclick: () => void }) => (
    <button data-testid="edit-icon" disabled={loading} onClick={onclick}>
      Edit
    </button>
  ),
}));

vi.mock('../asset/svg/IconDelete', () => ({
  IconDelete: ({ loading, onclick }: { loading: boolean; onclick: () => void }) => (
    <button data-testid="delete-icon" disabled={loading} onClick={onclick}>
      Delete
    </button>
  ),
}));

// Mock the ConfirmPopover component
vi.mock('../../_designSystem/ConfirmPopover', () => ({
  ConfirmPopover: ({ open, message, onConfirm, onCancel }: { open: boolean; message: string; onConfirm: () => void; onCancel: () => void }) =>
    open ? (
      <div data-testid="confirm-popover">
        <p>{message}</p>
        <button data-testid="confirm-button" onClick={onConfirm}>
          Confirm
        </button>
        <button data-testid="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    ) : null,
}));

describe('TaskItem', () => {
  const defaultProps: TaskItemProps = {
    task: {
      id: '1',
      name: 'Test Task',
      completed: false,
      created_at: '2025-08-20T12:00:00Z',
    },
    onToggle: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    loading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders task item with correct details', () => {
    render(<TaskItem {...defaultProps} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toHaveClass('bg-yellow-100');
    expect(screen.getByText(/Created: 8\/20\/2025/)).toBeInTheDocument();
    expect(screen.getByTestId('completed-icon')).toHaveTextContent('Not Completed');
  });

  it('disables interactions when loading', () => {
    render(<TaskItem {...defaultProps} loading={true} />);
    
    expect(screen.getByTestId('completed-icon')).toBeDisabled();
    expect(screen.getByTestId('edit-icon')).toBeDisabled();
    expect(screen.getByTestId('delete-icon')).toBeDisabled();
  });

  it('calls handleToggle when completed icon is clicked', () => {
    const mockHandleToggle = vi.fn();
    vi.mocked(useTaskItem).mockReturnValue({
      handleToggle: mockHandleToggle,
      handleEdit: vi.fn(),
      handleDelete: vi.fn(),
      showConfirm: false,
      setShowConfirm: vi.fn(),
    });

    render(<TaskItem {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('completed-icon'));
    
    expect(mockHandleToggle).toHaveBeenCalled();
  });

  it('calls handleEdit when edit icon is clicked', () => {
    const mockHandleEdit = vi.fn();
    vi.mocked(useTaskItem).mockReturnValue({
      handleToggle: vi.fn(),
      handleEdit: mockHandleEdit,
      handleDelete: vi.fn(),
      showConfirm: false,
      setShowConfirm: vi.fn(),
    });

    render(<TaskItem {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('edit-icon'));
    
    expect(mockHandleEdit).toHaveBeenCalled();
  });

  it('shows confirm popover when delete icon is clicked', () => {
    const mockSetShowConfirm = vi.fn();
    vi.mocked(useTaskItem).mockReturnValue({
      handleToggle: vi.fn(),
      handleEdit: vi.fn(),
      handleDelete: vi.fn(),
      showConfirm: false,
      setShowConfirm: mockSetShowConfirm,
    });

    render(<TaskItem {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('delete-icon'));
    
    expect(mockSetShowConfirm).toHaveBeenCalledWith(true);
  });

  it('renders confirm popover and handles confirm/cancel', async () => {
    const mockHandleDelete = vi.fn();
    const mockSetShowConfirm = vi.fn();
    vi.mocked(useTaskItem).mockReturnValue({
      handleToggle: vi.fn(),
      handleEdit: vi.fn(),
      handleDelete: mockHandleDelete,
      showConfirm: true,
      setShowConfirm: mockSetShowConfirm,
    });

    render(<TaskItem {...defaultProps} />);
    
    expect(screen.getByTestId('confirm-popover')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this task?')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId('confirm-button'));
    await waitFor(() => {
      expect(mockHandleDelete).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByTestId('cancel-button'));
    expect(mockSetShowConfirm).toHaveBeenCalledWith(false);
  });
});