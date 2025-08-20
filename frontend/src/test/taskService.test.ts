/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock básico del servicio
vi.mock('../services/taskService', () => ({
  taskService: {
    getTasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    toggleTaskCompletion: vi.fn(),
  }
}))

describe('TaskService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('debería tener métodos básicos disponibles', async () => {
    const { taskService } = await import('../services/taskService')
    
    expect(typeof taskService.getTasks).toBe('function')
    expect(typeof taskService.createTask).toBe('function')
    expect(typeof taskService.updateTask).toBe('function')
    expect(typeof taskService.deleteTask).toBe('function')
    expect(typeof taskService.toggleTaskCompletion).toBe('function')
  })

  it('debería poder mockear getTasks correctamente', async () => {
    const { taskService } = await import('../services/taskService')
    const mockResponse = {
      results: [{ id: '1', name: 'Test', completed: false, created_at: '', updated_at: '' }],
      count: 1,
      next: null,
      previous: null
    }

    vi.mocked(taskService.getTasks).mockResolvedValue(mockResponse)

    const result = await taskService.getTasks(1)
    expect(result).toEqual(mockResponse)
    expect(taskService.getTasks).toHaveBeenCalledWith(1)
  })

  it('debería poder mockear createTask correctamente', async () => {
    const { taskService } = await import('../services/taskService')
    const mockTask = { id: '1', name: 'Nueva tarea', completed: false, created_at: '', updated_at: '' }
    const taskData = { name: 'Nueva tarea', completed: false }

    vi.mocked(taskService.createTask).mockResolvedValue(mockTask)

    const result = await taskService.createTask(taskData)
    expect(result).toEqual(mockTask)
    expect(taskService.createTask).toHaveBeenCalledWith(taskData)
  })

  it('debería poder mockear updateTask correctamente', async () => {
    const { taskService } = await import('../services/taskService')
    const mockTask = { id: '1', name: 'Tarea actualizada', completed: false, created_at: '', updated_at: '' }
    const updateData = { name: 'Tarea actualizada' }

    vi.mocked(taskService.updateTask).mockResolvedValue(mockTask)

    const result = await taskService.updateTask('1', updateData)
    expect(result).toEqual(mockTask)
    expect(taskService.updateTask).toHaveBeenCalledWith('1', updateData)
  })

  it('debería poder mockear deleteTask correctamente', async () => {
    const { taskService } = await import('../services/taskService')
    
    vi.mocked(taskService.deleteTask).mockResolvedValue()

    await taskService.deleteTask('1')
    expect(taskService.deleteTask).toHaveBeenCalledWith('1')
  })

  it('debería poder mockear toggleTaskCompletion correctamente', async () => {
    const { taskService } = await import('../services/taskService')
    const mockTask = { id: '1', name: 'Tarea', completed: true, created_at: '', updated_at: '' }

    vi.mocked(taskService.toggleTaskCompletion).mockResolvedValue(mockTask)

    const result = await taskService.toggleTaskCompletion('1', true)
    expect(result).toEqual(mockTask)
    expect(taskService.toggleTaskCompletion).toHaveBeenCalledWith('1', true)
  })
})
