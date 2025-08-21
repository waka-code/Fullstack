import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import LoadingSpinner from '../../_designSystem/LoadingSpinner'

describe('LoadingSpinner', () => {
  afterEach(() => {
    cleanup()
  })

  it('debería renderizarse con configuración por defecto', () => {
    render(<LoadingSpinner />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toBeDefined()
    expect(spinner.getAttribute('aria-label')).toBe('Cargando...')
    
    const text = screen.getByText('Cargando...')
    expect(text).toBeDefined()
  })

  it('debería renderizarse con tamaño pequeño', () => {
    const { container } = render(<LoadingSpinner size="sm" />)
    
    const spinnerDiv = container.querySelector('.h-4.w-4')
    expect(spinnerDiv).not.toBeNull()
  })

  it('debería renderizarse con tamaño mediano por defecto', () => {
    const { container } = render(<LoadingSpinner />)
    
    const spinnerDiv = container.querySelector('.h-8.w-8')
    expect(spinnerDiv).not.toBeNull()
  })

  it('debería renderizarse con tamaño grande', () => {
    const { container } = render(<LoadingSpinner size="lg" />)
    
    const spinnerDiv = container.querySelector('.h-12.w-12')
    expect(spinnerDiv).not.toBeNull()
  })

  it('debería aplicar clases CSS personalizadas', () => {
    const customClass = 'my-custom-class'
    const { container } = render(<LoadingSpinner className={customClass} />)
    
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain(customClass)
  })

  it('debería tener las clases de animación correctas', () => {
    const { container } = render(<LoadingSpinner />)
    
    const spinnerDiv = container.querySelector('.animate-spin')
    expect(spinnerDiv).not.toBeNull()
    
    const roundedSpinner = container.querySelector('.rounded-full')
    expect(roundedSpinner).not.toBeNull()
    
    const borderedSpinner = container.querySelector('.border-4')
    expect(borderedSpinner).not.toBeNull()
  })

  it('debería tener los atributos de accesibilidad correctos', () => {
    render(<LoadingSpinner />)
    
    const spinner = screen.getByRole('status')
    expect(spinner.getAttribute('aria-label')).toBe('Cargando...')
    
    const hiddenText = screen.getByText('Cargando...')
    expect(hiddenText.className).toContain('sr-only')
  })
})
