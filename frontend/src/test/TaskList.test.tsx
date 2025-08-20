/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'
import TaskList from '../components/TaskList'
import { TaskProvider } from '../context/TaskContext'
import { taskService } from '../services/taskService'
import { Task } from '../types'

// Mock de los servicios
vi.mock('../services/taskService', () => ({
  taskService: {
    getTasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    toggleTaskCompletion: vi.fn(),
  }
}))

// Mock de los componentes lazy para evitar problemas con Suspense en tests
vi.mock('../components/TaskItem', () => ({
  default: ({ task, onToggle, onEdit, onDelete }: any) => (
    <div data-testid={`task-${task.id}`}>
      <span>{task.name}</span>
      <button onClick={() => onToggle(task.id)}>Toggle</button>
      <button onClick={() => onEdit(task)}>Edit</button>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </div>
  )
}))

vi.mock('../components/TaskForm', () => ({
  default: ({ onSubmit, initialValues, onCancel }: any) => (
    <div data-testid="task-form">
      <input 
        data-testid="task-input"
        defaultValue={initialValues?.name || ''}
        onChange={(e) => {
          // Simular envío del formulario
          if (e.target.value.endsWith('submit')) {
            onSubmit({ name: e.target.value.replace('submit', ''), completed: false })
          }
        }}
      />
      {onCancel && <button onClick={onCancel}>Cancel</button>}
    </div>
  )
}))

vi.mock('../components/LoadingSpinner', () => ({
  default: () => <div data-testid="loading-spinner">Loading...</div>
}))

vi.mock('../components/Pagination', () => ({
  default: ({ currentPage, totalPages, onPageChange }: any) => (
    <div data-testid="pagination">
      <button onClick={() => onPageChange(currentPage - 1)}>Previous</button>
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
    </div>
  )
}))

describe('TaskList', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      name: 'Tarea 1',
      completed: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Tarea 2',
      completed: true,
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock exitoso por defecto
    vi.mocked(taskService.getTasks).mockResolvedValue({
      results: mockTasks,
      count: mockTasks.length,
      next: null,
      previous: null
    })
  })

  afterEach(() => {
    cleanup()
  })

  const renderTaskList = () => {
    return render(
      <TaskProvider>
        <TaskList />
      </TaskProvider>
    )
  }

  it('debería renderizarse correctamente con el título', async () => {
    renderTaskList()
    
    expect(screen.getByText('Gestor de Tareas')).toBeDefined()
    expect(screen.getByText('Organiza y gestiona tus tareas de manera eficiente')).toBeDefined()
    
    await waitFor(() => {
      expect(screen.getByText('Mis Tareas')).toBeDefined()
    })
  })

  it('debería cargar tareas al montar el componente', async () => {
    renderTaskList()
    
    await waitFor(() => {
      expect(taskService.getTasks).toHaveBeenCalledWith(1)
      expect(screen.getByTestId('task-1')).toBeDefined()
      expect(screen.getByTestId('task-2')).toBeDefined()
    })
  })

  it('debería mostrar mensaje cuando no hay tareas', async () => {
    vi.mocked(taskService.getTasks).mockResolvedValue({
      results: [],
      count: 0,
      next: null,
      previous: null
    })
    
    renderTaskList()
    
    await waitFor(() => {
      expect(screen.getByText('No hay tareas')).toBeDefined()
      expect(screen.getByText('Comienza creando tu primera tarea usando el formulario de arriba.')).toBeDefined()
    })
  })

  it('debería mostrar spinner de carga mientras cargan las tareas', async () => {
    // Mock que tarda en resolver
    vi.mocked(taskService.getTasks).mockImplementation(() => new Promise(resolve => 
      setTimeout(() => resolve({
        results: mockTasks,
        count: mockTasks.length,
        next: null,
        previous: null
      }), 100)
    ))
    
    renderTaskList()
    
    expect(screen.getByText('Cargando tareas...')).toBeDefined()
    
    await waitFor(() => {
      expect(screen.getByTestId('task-1')).toBeDefined()
    })
  })

  it('debería mostrar error cuando falla la carga de tareas', async () => {
    const errorMessage = 'Error de red'
    vi.mocked(taskService.getTasks).mockRejectedValue(new Error(errorMessage))
    
    renderTaskList()
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeDefined()
    })
  })

  it('debería mostrar estadísticas de tareas', async () => {
    renderTaskList()
    
    await waitFor(() => {
      expect(screen.getByText('Total')).toBeDefined()
      expect(screen.getByText('Pendientes')).toBeDefined()
      expect(screen.getByText('Completadas')).toBeDefined()
      
      // Verificar valores específicos usando selectores más precisos
      const totalElements = screen.getAllByText('2')
      const pendingElements = screen.getAllByText('1')
      
      // Debe haber al menos un elemento con "2" (total)
      expect(totalElements.length).toBeGreaterThan(0)
      // Debe haber al menos dos elementos con "1" (pendientes y completadas)
      expect(pendingElements.length).toBeGreaterThanOrEqual(2)
    })
  })

  it('debería mostrar contador de tareas en el título', async () => {
    renderTaskList()
    
    await waitFor(() => {
      expect(screen.getByText('(1 pendientes, 1 completadas)')).toBeDefined()
    })
  })

  it('debería crear nueva tarea', async () => {
    const newTask = { id: '3', name: 'Nueva tarea', completed: false, created_at: '2024-01-03T00:00:00Z', updated_at: '2024-01-03T00:00:00Z' }
    vi.mocked(taskService.createTask).mockResolvedValue(newTask)
    
    renderTaskList()
    
    await waitFor(() => {
      const input = screen.getByTestId('task-input')
      fireEvent.change(input, { target: { value: 'Nueva tareasubmit' } })
    })
    
    await waitFor(() => {
      expect(taskService.createTask).toHaveBeenCalledWith({ name: 'Nueva tarea', completed: false })
    })
  })

  it('debería alternar el estado de una tarea', async () => {
    const updatedTask = { ...mockTasks[0], completed: true }
    vi.mocked(taskService.toggleTaskCompletion).mockResolvedValue(updatedTask)
    
    renderTaskList()
    
    await waitFor(() => {
      const toggleButton = screen.getAllByText('Toggle')[0]
      fireEvent.click(toggleButton)
    })
    
    await waitFor(() => {
      expect(taskService.toggleTaskCompletion).toHaveBeenCalledWith('1', true)
    })
  })

  it('debería editar una tarea', async () => {
    const updatedTask = { ...mockTasks[0], name: 'Tarea editada' }
    vi.mocked(taskService.updateTask).mockResolvedValue(updatedTask)
    
    renderTaskList()
    
    await waitFor(() => {
      const editButton = screen.getAllByText('Edit')[0]
      fireEvent.click(editButton)
    })
    
    // Verificar que se cambió a modo edición
    await waitFor(() => {
      const cancelButton = screen.getByText('Cancel')
      expect(cancelButton).toBeDefined()
    })
  })

  it('debería eliminar una tarea', async () => {
    vi.mocked(taskService.deleteTask).mockResolvedValue()
    
    renderTaskList()
    
    await waitFor(() => {
      const deleteButton = screen.getAllByText('Delete')[0]
      fireEvent.click(deleteButton)
    })
    
    await waitFor(() => {
      expect(taskService.deleteTask).toHaveBeenCalledWith('1')
    })
  })

  it('debería mostrar paginación cuando hay múltiples páginas', async () => {
    vi.mocked(taskService.getTasks).mockResolvedValue({
      results: mockTasks,
      count: 25, // Más de 10 para mostrar paginación
      next: 'next-url',
      previous: null
    })
    
    renderTaskList()
    
    await waitFor(() => {
      expect(screen.getByTestId('pagination')).toBeDefined()
      expect(screen.getByText('Page 1 of 3')).toBeDefined()
    })
  })

  it('debería cambiar de página', async () => {
    vi.mocked(taskService.getTasks).mockResolvedValue({
      results: mockTasks,
      count: 25,
      next: 'next-url',
      previous: null
    })
    
    renderTaskList()
    
    await waitFor(() => {
      const nextButton = screen.getByText('Next')
      fireEvent.click(nextButton)
    })
    
    await waitFor(() => {
      expect(taskService.getTasks).toHaveBeenCalledWith(2)
    })
  })

  it('debería manejar errores de creación de tareas', async () => {
    vi.mocked(taskService.createTask).mockRejectedValue(new Error('Error al crear'))
    
    renderTaskList()
    
    // Mock console.error para evitar ruido en tests
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    await waitFor(() => {
      const input = screen.getByTestId('task-input')
      fireEvent.change(input, { target: { value: 'Nueva tareasubmit' } })
    })
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error al crear tarea:', expect.any(Error))
    })
    
    consoleSpy.mockRestore()
  })
})
