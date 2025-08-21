import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, cleanup } from '@testing-library/react'
import { TaskProvider } from '../context/TaskContext'
import { taskService } from '../services/taskService'
import { Task, TaskFormData } from '../types'
import { ReactNode } from 'react'
import { useTaskContext } from '../hooks/useTaskContext'

vi.mock('../services/taskService', () => ({
  taskService: {
    getTasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    toggleTaskCompletion: vi.fn(),
  }
}))

describe('TaskContext', () => {
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

  const wrapper = ({ children }: { children: ReactNode }) => (
    <TaskProvider>{children}</TaskProvider>
  )

  beforeEach(() => {
    vi.clearAllMocks()
    
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('debería proporcionar valores iniciales correctos', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper })
    
    expect(result.current.tasks).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.currentPage).toBe(1)
    expect(result.current.totalPages).toBe(1)
  })

  it('debería lanzar error cuando se usa fuera del provider', () => {
    const originalError = console.error
    console.error = vi.fn()
    
    expect(() => {
      renderHook(() => useTaskContext())
    }).toThrow('useTaskContext must be used within a TaskProvider')
    
    console.error = originalError
  })

  it('debería cargar tareas correctamente', async () => {
    vi.mocked(taskService.getTasks).mockResolvedValue({
      results: mockTasks,
      count: 25,
      next: null,
      previous: null
    })
    
    const { result } = renderHook(() => useTaskContext(), { wrapper })
    
    await act(async () => {
      await result.current.fetchTasks(1)
    })
    
    expect(taskService.getTasks).toHaveBeenCalledWith(1)
    expect(result.current.tasks).toEqual(mockTasks)
    expect(result.current.currentPage).toBe(1)
    expect(result.current.totalPages).toBe(3)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('debería manejar errores al cargar tareas', async () => {
    const errorMessage = 'Error de red'
    vi.mocked(taskService.getTasks).mockRejectedValue(new Error(errorMessage))
    
    const { result } = renderHook(() => useTaskContext(), { wrapper })
    
    await act(async () => {
      await result.current.fetchTasks(1)
    })
    
    expect(result.current.error).toBe(errorMessage)
    expect(result.current.loading).toBe(false)
    expect(result.current.tasks).toEqual([])
  })

  it('debería crear nueva tarea correctamente', async () => {
    const newTask: Task = {
      id: '3',
      name: 'Nueva tarea',
      completed: false,
      created_at: '2024-01-03T00:00:00Z',
      updated_at: '2024-01-03T00:00:00Z'
    }
    
    vi.mocked(taskService.createTask).mockResolvedValue(newTask)
    
    const { result } = renderHook(() => useTaskContext(), { wrapper })
    
    vi.mocked(taskService.getTasks).mockResolvedValue({
      results: mockTasks,
      count: 2,
      next: null,
      previous: null
    })
    
    await act(async () => {
      await result.current.fetchTasks(1)
    })
    
    const taskData: TaskFormData = { name: 'Nueva tarea', completed: false }
    
    await act(async () => {
      await result.current.createTask(taskData)
    })
    
    expect(taskService.createTask).toHaveBeenCalledWith(taskData)
    expect(result.current.tasks[0]).toEqual(newTask) 
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('debería manejar errores al crear tareas', async () => {
    const errorMessage = 'Error al crear tarea'
    vi.mocked(taskService.createTask).mockRejectedValue(new Error(errorMessage))
    
    const { result } = renderHook(() => useTaskContext(), { wrapper })
    
    const taskData: TaskFormData = { name: 'Nueva tarea', completed: false }
    
    let threwError = false
    
    await act(async () => {
      try {
        await result.current.createTask(taskData)
      } catch (error) {
        threwError = true
      }
    })
    
    expect(threwError).toBe(true)
    expect(result.current.error).toBe(errorMessage)
    expect(result.current.loading).toBe(false)
  })

  it('debería actualizar tarea correctamente', async () => {
    const updatedTask: Task = { ...mockTasks[0], name: 'Tarea actualizada' }
    vi.mocked(taskService.updateTask).mockResolvedValue(updatedTask)
    
    const { result } = renderHook(() => useTaskContext(), { wrapper })
    
    vi.mocked(taskService.getTasks).mockResolvedValue({
      results: mockTasks,
      count: 2,
      next: null,
      previous: null
    })
    
    await act(async () => {
      await result.current.fetchTasks(1)
    })
    
    const updateData = { name: 'Tarea actualizada' }
    
    await act(async () => {
      await result.current.updateTask('1', updateData)
    })
    
    expect(taskService.updateTask).toHaveBeenCalledWith('1', updateData)
    expect(result.current.tasks[0]).toEqual(updatedTask)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('debería eliminar tarea correctamente', async () => {
    vi.mocked(taskService.deleteTask).mockResolvedValue()
    
    const { result } = renderHook(() => useTaskContext(), { wrapper })
    
    vi.mocked(taskService.getTasks).mockResolvedValue({
      results: mockTasks,
      count: 2,
      next: null,
      previous: null
    })
    
    await act(async () => {
      await result.current.fetchTasks(1)
    })
    
    await act(async () => {
      await result.current.deleteTask('1')
    })
    
    expect(taskService.deleteTask).toHaveBeenCalledWith('1')
    expect(result.current.tasks.find(t => t.id === '1')).toBeUndefined()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('debería alternar estado de tarea correctamente', async () => {
    const toggledTask: Task = { ...mockTasks[0], completed: true }
    vi.mocked(taskService.toggleTaskCompletion).mockResolvedValue(toggledTask)
    
    const { result } = renderHook(() => useTaskContext(), { wrapper })
    
    vi.mocked(taskService.getTasks).mockResolvedValue({
      results: mockTasks,
      count: 2,
      next: null,
      previous: null
    })
    
    await act(async () => {
      await result.current.fetchTasks(1)
    })
    
    await act(async () => {
      await result.current.toggleTask('1')
    })
    
    expect(taskService.toggleTaskCompletion).toHaveBeenCalledWith('1', true)
    expect(result.current.tasks.find(t => t.id === '1')?.completed).toBe(true)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('debería manejar errores con información detallada de respuesta', async () => {
    const errorResponse = {
      response: {
        data: {
          message: 'Error personalizado del servidor'
        }
      }
    }
    
    vi.mocked(taskService.getTasks).mockRejectedValue(errorResponse)
    
    const { result } = renderHook(() => useTaskContext(), { wrapper })
    
    await act(async () => {
      await result.current.fetchTasks(1)
    })
    
    expect(result.current.error).toBe('Error personalizado del servidor')
  })

  it('debería manejar errores con detail en lugar de message', async () => {
    const errorResponse = {
      response: {
        data: {
          detail: 'Detalle del error'
        }
      }
    }
    
    vi.mocked(taskService.getTasks).mockRejectedValue(errorResponse)
    
    const { result } = renderHook(() => useTaskContext(), { wrapper })
    
    await act(async () => {
      await result.current.fetchTasks(1)
    })
    
    expect(result.current.error).toBe('Detalle del error')
  })

  it('debería mostrar estados de loading correctamente', async () => {
    let resolvePromise: (value: any) => void
    const promise = new Promise<any>(resolve => {
      resolvePromise = resolve
    })
    
    vi.mocked(taskService.getTasks).mockReturnValue(promise)
    
    const { result } = renderHook(() => useTaskContext(), { wrapper })
    
    act(() => {
      result.current.fetchTasks(1)
    })
    
    expect(result.current.loading).toBe(true)
    
    await act(async () => {
      resolvePromise({
        results: mockTasks,
        count: 2,
        next: null,
        previous: null
      })
      await promise
    })
    
    expect(result.current.loading).toBe(false)
  })

  it('no debería alternar tarea si no existe', async () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper })
    
    await act(async () => {
      await result.current.toggleTask('inexistente')
    })
    
    expect(taskService.toggleTaskCompletion).not.toHaveBeenCalled()
  })
})
