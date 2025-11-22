import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ element }: { element: React.ReactNode }) => <div>{element}</div>,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useLocation: () => ({ pathname: '/' }),
  useSearchParams: () => [new URLSearchParams(), () => {}],
}))

// Mock API service
vi.mock('./services/api', () => ({
  default: {
    getHealth: vi.fn().mockResolvedValue({
      status: 'healthy',
      model_loaded: true,
      version: '1.0.0'
    }),
    getInfo: vi.fn().mockResolvedValue({
      message: 'API is running'
    })
  }
}))

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    // Just verify the app renders and contains the main brand name
    expect(screen.getAllByText('Sentiment AI')).toHaveLength(2)
  })
  
  it('has navigation', () => {
    render(<App />)
    // Just verify navigation exists
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
  })
})