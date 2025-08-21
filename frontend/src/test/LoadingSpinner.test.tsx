import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import LoadingSpinner from '../../_designSystem/LoadingSpinner'

describe('LoadingSpinner', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render with default configuration', () => {
    render(<LoadingSpinner />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toBeDefined()
    expect(spinner.getAttribute('aria-label')).toBe('Loading...')
    
    const text = screen.getByText('Loading...')
    expect(text).toBeDefined()
  })

  it('should render with small size', () => {
    const { container } = render(<LoadingSpinner size="sm" />)
    
    const spinnerDiv = container.querySelector('.h-4.w-4')
    expect(spinnerDiv).not.toBeNull()
  })

  it('should render with medium size by default', () => {
    const { container } = render(<LoadingSpinner />)
    
    const spinnerDiv = container.querySelector('.h-8.w-8')
    expect(spinnerDiv).not.toBeNull()
  })

  it('should render with large size', () => {
    const { container } = render(<LoadingSpinner size="lg" />)
    
    const spinnerDiv = container.querySelector('.h-12.w-12')
    expect(spinnerDiv).not.toBeNull()
  })

  it('should apply custom CSS classes', () => {
    const customClass = 'my-custom-class'
    const { container } = render(<LoadingSpinner className={customClass} />)
    
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain(customClass)
  })

  it('should have correct animation classes', () => {
    const { container } = render(<LoadingSpinner />)
    
    const spinnerDiv = container.querySelector('.animate-spin')
    expect(spinnerDiv).not.toBeNull()
    
    const roundedSpinner = container.querySelector('.rounded-full')
    expect(roundedSpinner).not.toBeNull()
    
    const borderedSpinner = container.querySelector('.border-4')
    expect(borderedSpinner).not.toBeNull()
  })

  it('should have correct accessibility attributes', () => {
    render(<LoadingSpinner />)
    
    const spinner = screen.getByRole('status')
    expect(spinner.getAttribute('aria-label')).toBe('Loading...')
    
    const hiddenText = screen.getByText('Loading...')
    expect(hiddenText.className).toContain('sr-only')
  })
})
