import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { TaskProvider } from '../context/TaskContext'
import { taskService } from '../services/taskService'
import TaskList from '../components/TaskList'
import { Task } from '../types'

vi.mock('../services/taskService', () => ({
  taskService: {
    getTasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    toggleTaskCompletion: vi.fn(),
  }
}))

vi.mock('../components/TaskItem', () => ({
  default: ({ task, onToggle, onEdit, onDelete }: any) => (
    <div data-testid={`task-item-${task.id}`}>
      <span data-testid={`task-name-${task.id}`}>{task.name}</span>
      <span data-testid={`task-status-${task.id}`}>
        {task.completed ? 'Completada' : 'Pendiente'}
      </span>
      <button 
        data-testid={`toggle-${task.id}`}
        onClick={() => onToggle(task.id)}
      >
        {task.completed ? 'Marcar pendiente' : 'Marcar completada'}
      </button>
      <button 
        data-testid={`edit-${task.id}`}
        onClick={() => onEdit(task)}
      >
        Editar
      </button>
      <button 
        data-testid={`delete-${task.id}`}
        onClick={() => onDelete(task.id)}
      >
        Eliminar
      </button>
    </div>
  )
}))

vi.mock('../components/TaskForm', () => ({
  default: ({ onSubmit, initialValues, onCancel, submitButtonText }: any) => (
    <form data-testid="task-form" onSubmit={(e) => {
      e.preventDefault()
      const formData = new FormData(e.target as HTMLFormElement)
      onSubmit({
        name: formData.get('name') as string,
        completed: formData.get('completed') === 'on'
      })
    }}>
      <input 
        name="name" 
        data-testid="task-name-input"
        defaultValue={initialValues?.name || ''}
        placeholder="Nombre de la tarea"
      />
      <input 
        name="completed" 
        type="checkbox"
        data-testid="task-completed-input"
        defaultChecked={initialValues?.completed || false}
      />
      <button type="submit" data-testid="submit-button">
        {submitButtonText || 'Enviar'}
      </button>
      {onCancel && (
        <button 
          type="button" 
          data-testid="cancel-button"
          onClick={onCancel}
        >
          Cancelar
        </button>
      )}
    </form>
  )
}))

vi.mock('../components/LoadingSpinner', () => ({
  default: () => <div data-testid="loading-spinner">Cargando...</div>
}))

vi.mock('../components/Pagination', () => ({
  default: ({ currentPage, totalPages, onPageChange }: any) => 
    totalPages > 1 ? (
      <div data-testid="pagination">
        <button 
          data-testid="prev-page"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Anterior
        </button>
        <span data-testid="page-info">Página {currentPage} de {totalPages}</span>
        <button 
          data-testid="next-page"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Siguiente
        </button>
      </div>
    ) : null
}))

describe('Integración TaskList + TaskContext + TaskService', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      name: 'Tarea de prueba 1',
      completed: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Tarea de prueba 2',
      completed: true,
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    
    vi.mocked(taskService.getTasks).mockResolvedValue({
      results: mockTasks,
      count: mockTasks.length,
      next: null,
      previous: null
    })
    
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  const renderApp = () => {
    return render(
      <TaskProvider>
        <TaskList />
      </TaskProvider>
    )
  }

  it('debería renderizar la aplicación completa correctamente', async () => {
    renderApp()
    
    expect(screen.getByText('Gestor de Tareas')).toBeDefined()
    
    await waitFor(() => {
      expect(screen.getByTestId('task-form')).toBeDefined()
    }, { timeout: 3000 })
    
    await waitFor(() => {
      expect(screen.getByTestId('task-item-1')).toBeDefined()
      expect(screen.getByTestId('task-item-2')).toBeDefined()
    }, { timeout: 3000 })
    
    expect(screen.getByTestId('task-name-1')).toHaveTextContent('Tarea de prueba 1')
    expect(screen.getByTestId('task-name-2')).toHaveTextContent('Tarea de prueba 2')
    
    // Verificar estados
    expect(screen.getByTestId('task-status-1')).toHaveTextContent('Pendiente')
    expect(screen.getByTestId('task-status-2')).toHaveTextContent('Completada')
  })

  it('debería crear una nueva tarea correctamente', async () => {
    const newTask: Task = {
      id: '3',
      name: 'Nueva tarea de integración',
      completed: false,
      created_at: '2024-01-03T00:00:00Z',
      updated_at: '2024-01-03T00:00:00Z'
    }
    
    vi.mocked(taskService.createTask).mockResolvedValue(newTask)
    
    renderApp()
    
    await waitFor(() => {
      expect(screen.getByTestId('task-form')).toBeDefined()
    })
    
    const nameInput = screen.getByTestId('task-name-input')
    fireEvent.change(nameInput, { target: { value: 'Nueva tarea de integración' } })
    
    const submitButton = screen.getByTestId('submit-button')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(taskService.createTask).toHaveBeenCalledWith({
        name: 'Nueva tarea de integración',
        completed: false
      })
    })
  })

  it('debería alternar el estado de una tarea', async () => {
    const toggledTask: Task = { ...mockTasks[0], completed: true }
    vi.mocked(taskService.toggleTaskCompletion).mockResolvedValue(toggledTask)
    
    renderApp()
    
    await waitFor(() => {
      expect(screen.getByTestId('toggle-1')).toBeDefined()
    })
    
    const toggleButton = screen.getByTestId('toggle-1')
    fireEvent.click(toggleButton)
    
    await waitFor(() => {
      expect(taskService.toggleTaskCompletion).toHaveBeenCalledWith('1', true)
    })
  })

  it('debería editar una tarea existente', async () => {
    const updatedTask: Task = { ...mockTasks[0], name: 'Tarea editada' }
    vi.mocked(taskService.updateTask).mockResolvedValue(updatedTask)
    
    renderApp()
    
    await waitFor(() => {
      expect(screen.getByTestId('edit-1')).toBeDefined()
    })
    
    const editButton = screen.getByTestId('edit-1')
    fireEvent.click(editButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('cancel-button')).toBeDefined()
    })
    
    const nameInput = screen.getByTestId('task-name-input')
    expect(nameInput).toHaveValue('Tarea de prueba 1')
    
    fireEvent.change(nameInput, { target: { value: 'Tarea editada' } })
    const submitButton = screen.getByTestId('submit-button')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(taskService.updateTask).toHaveBeenCalledWith('1', {
        name: 'Tarea editada',
        completed: false
      })
    })
  })

  it('debería eliminar una tarea', async () => {
    vi.mocked(taskService.deleteTask).mockResolvedValue()
    
    renderApp()
    
    await waitFor(() => {
      expect(screen.getByTestId('delete-1')).toBeDefined()
    })
    
    const deleteButton = screen.getByTestId('delete-1')
    fireEvent.click(deleteButton)
    
    await waitFor(() => {
      expect(taskService.deleteTask).toHaveBeenCalledWith('1')
    })
  })

  it('debería mostrar estadísticas correctas', async () => {
    renderApp()
    
    await waitFor(() => {
      expect(screen.getByText('2')).toBeDefined() 
    })
    
    expect(screen.getByText('(1 pendientes, 1 completadas)')).toBeDefined()
    expect(screen.getByText('Total')).toBeDefined()
    expect(screen.getByText('Pendientes')).toBeDefined()
    expect(screen.getByText('Completadas')).toBeDefined()
  })

  it('debería manejar paginación correctamente', async () => {
    vi.mocked(taskService.getTasks).mockResolvedValue({
      results: mockTasks,
      count: 25, 
      next: 'next-url',
      previous: null
    })
    
    renderApp()
    
    await waitFor(() => {
      expect(screen.getByTestId('pagination')).toBeDefined()
      expect(screen.getByTestId('page-info')).toHaveTextContent('Página 1 de 3')
    })
    
    const nextButton = screen.getByTestId('next-page')
    fireEvent.click(nextButton)
    
    await waitFor(() => {
      expect(taskService.getTasks).toHaveBeenCalledWith(2)
    })
  })

  it('debería manejar errores de carga', async () => {
    const errorMessage = 'Error de conexión'
    vi.mocked(taskService.getTasks).mockRejectedValue(new Error(errorMessage))
    
    renderApp()
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeDefined()
    })
  })

  it('debería mostrar estado vacío cuando no hay tareas', async () => {
    vi.mocked(taskService.getTasks).mockResolvedValue({
      results: [],
      count: 0,
      next: null,
      previous: null
    })
    
    renderApp()
    
    await waitFor(() => {
      expect(screen.getByText('No hay tareas')).toBeDefined()
      expect(screen.getByText('Comienza creando tu primera tarea usando el formulario de arriba.')).toBeDefined()
    })
  })

  it('debería cancelar edición de tarea', async () => {
    renderApp()
    
    await waitFor(() => {
      expect(screen.getByTestId('edit-1')).toBeDefined()
    })
    
    const editButton = screen.getByTestId('edit-1')
    fireEvent.click(editButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('cancel-button')).toBeDefined()
    })
    
    const cancelButton = screen.getByTestId('cancel-button')
    fireEvent.click(cancelButton)
    
    await waitFor(() => {
      expect(screen.queryByTestId('cancel-button')).toBeNull()
    })
  })

  it('debería manejar múltiples operaciones simultáneas', async () => {
    const newTask: Task = {
      id: '3',
      name: 'Tarea simultánea',
      completed: false,
      created_at: '2024-01-03T00:00:00Z',
      updated_at: '2024-01-03T00:00:00Z'
    }
    
    vi.mocked(taskService.createTask).mockResolvedValue(newTask)
    vi.mocked(taskService.deleteTask).mockResolvedValue()
    
    renderApp()
    
    await waitFor(() => {
      expect(screen.getByTestId('task-form')).toBeDefined()
      expect(screen.getByTestId('delete-1')).toBeDefined()
    })
    
    const nameInput = screen.getByTestId('task-name-input')
    fireEvent.change(nameInput, { target: { value: 'Tarea simultánea' } })
    
    const submitButton = screen.getByTestId('submit-button')
    const deleteButton = screen.getByTestId('delete-1')
    
    fireEvent.click(submitButton)
    fireEvent.click(deleteButton)
    
    await waitFor(() => {
      expect(taskService.createTask).toHaveBeenCalledWith({
        name: 'Tarea simultánea',
        completed: false
      })
      expect(taskService.deleteTask).toHaveBeenCalledWith('1')
    })
  })
})
