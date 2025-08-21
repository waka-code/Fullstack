
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import Pagination from '../../_designSystem/Pagination'

describe('Pagination', () => {
  const mockOnPageChange = vi.fn()

  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPageChange: mockOnPageChange,
    loading: false
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('debería renderizarse correctamente con páginas múltiples', () => {
    render(<Pagination {...defaultProps} />)
    
    expect(screen.getByText('Anterior')).toBeDefined()
    expect(screen.getByText('Siguiente')).toBeDefined()
    expect(screen.getByText('Página 1 de 5')).toBeDefined()
  })

  it('no debería renderizarse si hay solo una página', () => {
    const { container } = render(
      <Pagination {...defaultProps} totalPages={1} />
    )
    
    expect(container.firstChild).toBeNull()
  })

  it('no debería renderizarse si hay cero páginas', () => {
    const { container } = render(
      <Pagination {...defaultProps} totalPages={0} />
    )
    
    expect(container.firstChild).toBeNull()
  })

  it('debería deshabilitar el botón anterior en la primera página', () => {
    render(<Pagination {...defaultProps} currentPage={1} />)
    
    const previousButton = screen.getByText('Anterior')
    expect(previousButton.getAttribute('disabled')).toBe('')
    expect(previousButton.className).toContain('cursor-not-allowed')
  })

  it('debería deshabilitar el botón siguiente en la última página', () => {
    render(<Pagination {...defaultProps} currentPage={5} totalPages={5} />)
    
    const nextButton = screen.getByText('Siguiente')
    expect(nextButton.getAttribute('disabled')).toBe('')
    expect(nextButton.className).toContain('cursor-not-allowed')
  })

  it('debería llamar onPageChange al hacer clic en página anterior', () => {
    render(<Pagination {...defaultProps} currentPage={3} />)
    
    const previousButton = screen.getByText('Anterior')
    fireEvent.click(previousButton)
    
    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('debería llamar onPageChange al hacer clic en página siguiente', () => {
    render(<Pagination {...defaultProps} currentPage={3} />)
    
    const nextButton = screen.getByText('Siguiente')
    fireEvent.click(nextButton)
    
    expect(mockOnPageChange).toHaveBeenCalledWith(4)
  })

  it('debería llamar onPageChange al hacer clic en un número de página', () => {
    render(<Pagination {...defaultProps} currentPage={1} />)
    
    const pageButton = screen.getByText('3')
    fireEvent.click(pageButton)
    
    expect(mockOnPageChange).toHaveBeenCalledWith(3)
  })

  it('no debería permitir navegación cuando está cargando', () => {
    render(<Pagination {...defaultProps} loading={true} currentPage={2} />)
    
    const previousButton = screen.getByText('Anterior')
    const nextButton = screen.getByText('Siguiente')
    const pageButton = screen.getByText('3')
    
    fireEvent.click(previousButton)
    fireEvent.click(nextButton)
    fireEvent.click(pageButton)
    
    expect(mockOnPageChange).not.toHaveBeenCalled()
  })

  it('debería mostrar la página actual con estilo destacado', () => {
    render(<Pagination {...defaultProps} currentPage={3} />)
    
    const currentPageButton = screen.getByText('3')
    expect(currentPageButton.className).toContain('bg-primary-600')
    expect(currentPageButton.className).toContain('text-white')
    expect(currentPageButton.getAttribute('aria-current')).toBe('page')
  })

  it('debería generar los números de página correctos para páginas centrales', () => {
    render(<Pagination {...defaultProps} currentPage={5} totalPages={10} />)
    
    expect(screen.getByText('3')).toBeDefined()
    expect(screen.getByText('4')).toBeDefined()
    expect(screen.getByText('5')).toBeDefined()
    expect(screen.getByText('6')).toBeDefined()
    expect(screen.getByText('7')).toBeDefined()
  })

  it('debería generar los números de página correctos al inicio', () => {
    render(<Pagination {...defaultProps} currentPage={1} totalPages={10} />)
    
    expect(screen.getByText('1')).toBeDefined()
    expect(screen.getByText('2')).toBeDefined()
    expect(screen.getByText('3')).toBeDefined()
    expect(screen.getByText('4')).toBeDefined()
    expect(screen.getByText('5')).toBeDefined()
  })

  it('debería generar los números de página correctos al final', () => {
    render(<Pagination {...defaultProps} currentPage={10} totalPages={10} />)
    
    expect(screen.getByText('6')).toBeDefined()
    expect(screen.getByText('7')).toBeDefined()
    expect(screen.getByText('8')).toBeDefined()
    expect(screen.getByText('9')).toBeDefined()
    expect(screen.getByText('10')).toBeDefined()
  })

  it('debería tener atributos de accesibilidad correctos', () => {
    render(<Pagination {...defaultProps} />)
    
    const previousButton = screen.getByText('Anterior')
    expect(previousButton.getAttribute('aria-label')).toBe('Página anterior')
    
    const nextButton = screen.getByText('Siguiente')
    expect(nextButton.getAttribute('aria-label')).toBe('Página siguiente')
    
    const pageButton = screen.getByText('2')
    expect(pageButton.getAttribute('aria-label')).toBe('Ir a página 2')
  })

  it('debería mostrar información de página correcta', () => {
    render(<Pagination {...defaultProps} currentPage={3} totalPages={7} />)
    
    expect(screen.getByText('Página 3 de 7')).toBeDefined()
  })
})
