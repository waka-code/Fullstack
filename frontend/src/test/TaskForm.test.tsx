import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import TaskForm from '../components/TaskForm'

describe('TaskForm', () => {
  const mockOnSubmit = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('should render correctly', () => {
    render(
      <TaskForm 
        onSubmit={mockOnSubmit}
        loading={false}
        initialValues={{ name: '', completed: false }}
        submitButtonText="Create Task"
      />
    )
    
    expect(screen.getByPlaceholderText(/task name/i)).toBeDefined()
    expect(screen.getByText('Create Task')).toBeDefined()
  })

  it('should allow typing in the input', () => {
    const { container } = render(
      <TaskForm 
        onSubmit={mockOnSubmit}
        loading={false}
        initialValues={{ name: '', completed: false }}
        submitButtonText="Create Task"
      />
    )
    
    const input = container.querySelector('input[name="name"]') as HTMLInputElement
    expect(input).not.toBeNull()
    
    fireEvent.change(input, { target: { value: 'New test task' } })
    
    expect(input.value).toBe('New test task')
  })

  it('should show cancel button when editing', () => {
    render(
      <TaskForm 
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={false}
        initialValues={{ name: 'Existing task', completed: false }}
        submitButtonText="Update Task"
      />
    )
    
    expect(screen.getByText('Cancel')).toBeDefined()
    expect(screen.getByText('Update Task')).toBeDefined()
  })
})
