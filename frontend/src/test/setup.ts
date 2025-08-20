import '@testing-library/jest-dom'
import { afterAll, beforeAll } from 'vitest'

// Mock de console para evitar warnings en tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args: any) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
