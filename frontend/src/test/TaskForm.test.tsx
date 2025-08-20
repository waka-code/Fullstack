/**
 * @vitest-environment jsdom
 */
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

  it('debería renderizarse correctamente', () => {
    render(
      <TaskForm 
        onSubmit={mockOnSubmit}
        loading={false}
        initialValues={{ name: '', completed: false }}
        submitButtonText="Crear Tarea"
      />
    )
    
    expect(screen.getByPlaceholderText(/nombre de la tarea/i)).toBeDefined()
    expect(screen.getByText('Crear Tarea')).toBeDefined()
  })

  it('debería permitir escribir en el input', () => {
    const { container } = render(
      <TaskForm 
        onSubmit={mockOnSubmit}
        loading={false}
        initialValues={{ name: '', completed: false }}
        submitButtonText="Crear Tarea"
      />
    )
    
    // Usar querySelector para evitar duplicados
    const input = container.querySelector('input[name="name"]') as HTMLInputElement
    expect(input).not.toBeNull()
    
    fireEvent.change(input, { target: { value: 'Nueva tarea de test' } })
    
    expect(input.value).toBe('Nueva tarea de test')
  })

  it('debería mostrar botón de cancelar cuando está editando', () => {
    render(
      <TaskForm 
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={false}
        initialValues={{ name: 'Tarea existente', completed: false }}
        submitButtonText="Actualizar Tarea"
      />
    )
    
    expect(screen.getByText('Cancelar')).toBeDefined()
    expect(screen.getByText('Actualizar Tarea')).toBeDefined()
  })
})
