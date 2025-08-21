
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

  it('should render correctly with multiple pages', () => {
    render(<Pagination {...defaultProps} />)
    
    expect(screen.getByText('Previous')).toBeDefined()
    expect(screen.getByText('Next')).toBeDefined()
    expect(screen.getByText('Page 1 of 5')).toBeDefined()
  })

  it('should not render if there is only one page', () => {
    const { container } = render(
      <Pagination {...defaultProps} totalPages={1} />
    )
    
    expect(container.firstChild).toBeNull()
  })

  it('should not render if there are zero pages', () => {
    const { container } = render(
      <Pagination {...defaultProps} totalPages={0} />
    )
    
    expect(container.firstChild).toBeNull()
  })

  it('should disable previous button on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />)
    
    const previousButton = screen.getByText('Previous')
    expect(previousButton.getAttribute('disabled')).toBe('')
    expect(previousButton.className).toContain('cursor-not-allowed')
  })

  it('should disable next button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} totalPages={5} />)
    
    const nextButton = screen.getByText('Next')
    expect(nextButton.getAttribute('disabled')).toBe('')
    expect(nextButton.className).toContain('cursor-not-allowed')
  })

  it('should call onPageChange when clicking previous page', () => {
    render(<Pagination {...defaultProps} currentPage={3} />)
    
    const previousButton = screen.getByText('Previous')
    fireEvent.click(previousButton)
    
    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('should call onPageChange when clicking next page', () => {
    render(<Pagination {...defaultProps} currentPage={3} />)
    
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)
    
    expect(mockOnPageChange).toHaveBeenCalledWith(4)
  })

  it('should call onPageChange when clicking a page number', () => {
    render(<Pagination {...defaultProps} currentPage={1} />)
    
    const pageButton = screen.getByText('3')
    fireEvent.click(pageButton)
    
    expect(mockOnPageChange).toHaveBeenCalledWith(3)
  })

  it('should not allow navigation when loading', () => {
    render(<Pagination {...defaultProps} loading={true} currentPage={2} />)
    
    const previousButton = screen.getByText('Previous')
    const nextButton = screen.getByText('Next')
    const pageButton = screen.getByText('3')
    
    fireEvent.click(previousButton)
    fireEvent.click(nextButton)
    fireEvent.click(pageButton)
    
    expect(mockOnPageChange).not.toHaveBeenCalled()
  })

  it('should show current page with highlighted style', () => {
    render(<Pagination {...defaultProps} currentPage={3} />)
    
    const currentPageButton = screen.getByText('3')
    expect(currentPageButton.className).toContain('bg-primary-600')
    expect(currentPageButton.className).toContain('text-white')
    expect(currentPageButton.getAttribute('aria-current')).toBe('page')
  })

  it('should generate correct page numbers for middle pages', () => {
    render(<Pagination {...defaultProps} currentPage={5} totalPages={10} />)
    
    expect(screen.getByText('3')).toBeDefined()
    expect(screen.getByText('4')).toBeDefined()
    expect(screen.getByText('5')).toBeDefined()
    expect(screen.getByText('6')).toBeDefined()
    expect(screen.getByText('7')).toBeDefined()
  })

  it('should generate correct page numbers at the beginning', () => {
    render(<Pagination {...defaultProps} currentPage={1} totalPages={10} />)
    
    expect(screen.getByText('1')).toBeDefined()
    expect(screen.getByText('2')).toBeDefined()
    expect(screen.getByText('3')).toBeDefined()
    expect(screen.getByText('4')).toBeDefined()
    expect(screen.getByText('5')).toBeDefined()
  })

  it('should generate correct page numbers at the end', () => {
    render(<Pagination {...defaultProps} currentPage={10} totalPages={10} />)
    
    expect(screen.getByText('6')).toBeDefined()
    expect(screen.getByText('7')).toBeDefined()
    expect(screen.getByText('8')).toBeDefined()
    expect(screen.getByText('9')).toBeDefined()
    expect(screen.getByText('10')).toBeDefined()
  })

  it('should have correct accessibility attributes', () => {
    render(<Pagination {...defaultProps} />)
    
    const previousButton = screen.getByText('Previous')
    expect(previousButton.getAttribute('aria-label')).toBe('Previous page')
    
    const nextButton = screen.getByText('Next')
    expect(nextButton.getAttribute('aria-label')).toBe('Next page')
    
    const pageButton = screen.getByText('2')
    expect(pageButton.getAttribute('aria-label')).toBe('Go to page 2')
  })

  it('should show correct page information', () => {
    render(<Pagination {...defaultProps} currentPage={3} totalPages={7} />)
    
    expect(screen.getByText('Page 3 of 7')).toBeDefined()
  })
})
