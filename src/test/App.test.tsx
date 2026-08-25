import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import App from '../App'

// jsdom has no canvas 2D context; stub it so LowPolyV3 doesn't throw.
beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    scale: vi.fn(),
    setTransform: vi.fn(),
  })) as unknown as typeof HTMLCanvasElement.prototype.getContext
})

describe('App', () => {
  it('renders the primary navigation links', () => {
    render(<App />)
    const nav = screen.getByRole('navigation', { name: /primary/i })
    expect(within(nav).getByRole('link', { name: 'About' })).toBeInTheDocument()
    expect(within(nav).getByRole('link', { name: 'Skills' })).toBeInTheDocument()
    expect(within(nav).getByRole('link', { name: 'Projects' })).toBeInTheDocument()
    expect(within(nav).getByRole('link', { name: 'Contact' })).toBeInTheDocument()
  })

  it('renders the hero headline', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { level: 1 })
    ).toHaveTextContent(/build interfaces/i)
  })

  it('renders all project cards from data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /this site/i })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /project|site/i }).length).toBeGreaterThan(0)
  })

  it('renders a working mailto contact link', () => {
    render(<App />)
    const link = screen.getByRole('link', { name: /bbesase51@gmail\.com/i })
    expect(link).toHaveAttribute('href', 'mailto:bbesase51@gmail.com')
  })
})
