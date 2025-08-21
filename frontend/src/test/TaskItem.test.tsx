import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { Task } from '../types'
import TaskItem from '../components/TaskItem'

describe('TaskItem', () => {
  const mockTask: Task = {
    id: '1',
    name: 'Test Task',
    completed: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }

  const mockHandlers = {
    onToggle: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('debería renderizarse correctamente', () => {
    render(
      <TaskItem 
        task={mockTask}
        {...mockHandlers}
        loading={false}
      />
    )
    
    expect(screen.getByText('Test Task')).toBeDefined()
  })

  it('debería mostrar tarea completada', () => {
    const completedTask = { ...mockTask, completed: true }
    
    const { container } = render(
      <TaskItem 
        task={completedTask}
        {...mockHandlers}
        loading={false}
      />
    )
    
    const taskTextElement = container.querySelector('p.line-through')
    expect(taskTextElement).not.toBeNull()
    expect(taskTextElement?.textContent).toBe('Test Task')
  })
})
