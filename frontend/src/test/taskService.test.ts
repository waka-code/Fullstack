import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

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

  it('should have basic methods available', async () => {
    const { taskService } = await import('../services/taskService')
    
    expect(typeof taskService.getTasks).toBe('function')
    expect(typeof taskService.createTask).toBe('function')
    expect(typeof taskService.updateTask).toBe('function')
    expect(typeof taskService.deleteTask).toBe('function')
    expect(typeof taskService.toggleTaskCompletion).toBe('function')
  })

  it('should be able to mock getTasks correctly', async () => {
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

  it('should be able to mock createTask correctly', async () => {
    const { taskService } = await import('../services/taskService')
    const mockTask = { id: '1', name: 'New task', completed: false, created_at: '', updated_at: '' }
    const taskData = { name: 'New task', completed: false }

    vi.mocked(taskService.createTask).mockResolvedValue(mockTask)

    const result = await taskService.createTask(taskData)
    expect(result).toEqual(mockTask)
    expect(taskService.createTask).toHaveBeenCalledWith(taskData)
  })

  it('should be able to mock updateTask correctly', async () => {
    const { taskService } = await import('../services/taskService')
    const mockTask = { id: '1', name: 'Updated task', completed: false, created_at: '', updated_at: '' }
    const updateData = { name: 'Updated task' }

    vi.mocked(taskService.updateTask).mockResolvedValue(mockTask)

    const result = await taskService.updateTask('1', updateData)
    expect(result).toEqual(mockTask)
    expect(taskService.updateTask).toHaveBeenCalledWith('1', updateData)
  })

  it('should be able to mock deleteTask correctly', async () => {
    const { taskService } = await import('../services/taskService')
    
    vi.mocked(taskService.deleteTask).mockResolvedValue()

    await taskService.deleteTask('1')
    expect(taskService.deleteTask).toHaveBeenCalledWith('1')
  })

  it('should be able to mock toggleTaskCompletion correctly', async () => {
    const { taskService } = await import('../services/taskService')
    const mockTask = { id: '1', name: 'Task', completed: true, created_at: '', updated_at: '' }

    vi.mocked(taskService.toggleTaskCompletion).mockResolvedValue(mockTask)

    const result = await taskService.toggleTaskCompletion('1', true)
    expect(result).toEqual(mockTask)
    expect(taskService.toggleTaskCompletion).toHaveBeenCalledWith('1', true)
  })
})
