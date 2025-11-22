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
    expect(screen.getByText('Sentiment AI')).toBeInTheDocument()
  })
  
  it('displays navigation menu', () => {
    render(<App />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Analyze Text')).toBeInTheDocument()
    expect(screen.getByText('Batch Upload')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })
})