import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { useStore } from '../store'
import { DEFAULT_PAIR } from '../types'

beforeEach(() => {
  useStore.setState({
    provider: 'blended',
    pair: DEFAULT_PAIR,
    amount: '1000',
    favorites: [],
    log: [],
    currencies: [],
  })
})

const mockRate = { date: '2026-06-29', base: 'USD', quote: 'EGP', rate: 49.51 }
const mockCurrencies = [
  { iso_code: 'USD', name: 'United States Dollar', symbol: '$' },
  { iso_code: 'EUR', name: 'Euro', symbol: '€' },
  { iso_code: 'EGP', name: 'Egyptian Pound', symbol: 'E£' },
  { iso_code: 'GBP', name: 'British Pound', symbol: '£' },
]

const mockHistory = [
  { date: '2026-06-01', base: 'USD', quote: 'EGP', rate: 48.5 },
  { date: '2026-06-15', base: 'USD', quote: 'EGP', rate: 49.0 },
  { date: '2026-06-29', base: 'USD', quote: 'EGP', rate: 49.51 },
]

beforeEach(() => {
  vi.spyOn(globalThis, 'fetch').mockImplementation(async (url: string | URL | Request) => {
    const str = url.toString()
    if (str.includes('/currencies')) {
      return { ok: true, json: async () => mockCurrencies } as Response
    }
    if (str.includes('/rates?')) {
      return { ok: true, json: async () => mockHistory } as Response
    }
    return { ok: true, json: async () => mockRate } as Response
  })
})

describe('App', () => {
  it('renders the header with FX_CHECKER', () => {
    render(<App />)
    expect(screen.getByText('FX_CHECKER')).toBeInTheDocument()
  })

  it('renders the converter section', () => {
    render(<App />)
    expect(screen.getByText('Check the rate')).toBeInTheDocument()
    expect(screen.getByText('Send')).toBeInTheDocument()
    expect(screen.getByText('Receive')).toBeInTheDocument()
  })

  it('renders the ticker after fetch resolves', async () => {
    render(<App />)
    expect(await screen.findByText('Live markets')).toBeInTheDocument()
  })

  it('renders all four tabs', () => {
    render(<App />)
    expect(screen.getByText('History')).toBeInTheDocument()
    expect(screen.getByText('Compare')).toBeInTheDocument()
    expect(screen.getByText('Favorites')).toBeInTheDocument()
    expect(screen.getByText('Log')).toBeInTheDocument()
  })

  it('switches between tabs', async () => {
    render(<App />)
    fireEvent.click(screen.getByText('Compare'))
    expect(screen.getByText('Multi-currency')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Favorites'))
    expect(await screen.findByText(/Pin your favorite pairs/i)).toBeInTheDocument()

    fireEvent.click(screen.getByText('Log'))
    expect(screen.getByText('No conversions logged yet')).toBeInTheDocument()

    fireEvent.click(screen.getByText('History'))
    expect(await screen.findByText('Open')).toBeInTheDocument()
  })

  it('toggles provider', async () => {
    render(<App />)
    const toggle = screen.getByRole('button', { name: /switch/i })
    await userEvent.click(toggle)
    await waitFor(() => {
      expect(useStore.getState().provider).toBe('cbe')
    })
  })

  it('toggles favorite on converter after rate loads', async () => {
    render(<App />)
    const favBtn = await screen.findByRole('button', { name: /favorite/i })
    await userEvent.click(favBtn)
    expect(useStore.getState().favorites).toHaveLength(1)
    expect(useStore.getState().favorites[0]).toEqual(DEFAULT_PAIR)

    await userEvent.click(favBtn)
    expect(useStore.getState().favorites).toHaveLength(0)
  })

  it('logs a conversion after rate loads', async () => {
    render(<App />)
    const logBtn = await screen.findByText('Log conversion')
    expect(logBtn).not.toBeDisabled()
    await userEvent.click(logBtn)
    await waitFor(() => {
      expect(useStore.getState().log).toHaveLength(1)
    })
    expect(useStore.getState().log[0].from).toBe('USD')
    expect(useStore.getState().log[0].to).toBe('EGP')
  })

  it('shows empty state for favorites tab', () => {
    render(<App />)
    fireEvent.click(screen.getByText('Favorites'))
    expect(screen.getByText('Pin your favorite pairs to track them here')).toBeInTheDocument()
  })

  it('shows empty state for log tab', () => {
    render(<App />)
    fireEvent.click(screen.getByText('Log'))
    expect(screen.getByText('No conversions logged yet')).toBeInTheDocument()
  })

  it('shows badge counts on favorites and log tabs', () => {
    useStore.setState({
      favorites: [{ from: 'USD', to: 'EUR' }],
      log: [{
        from: 'USD', to: 'EGP', amount: 1000, received: 49510,
        timestamp: '2026-06-29T12:00:00.000Z',
      }],
    })
    render(<App />)
    const favTab = screen.getByText('Favorites')
    const logTab = screen.getByText('Log')
    expect(favTab.querySelector('span')?.textContent).toBe('1')
    expect(logTab.querySelector('span')?.textContent).toBe('1')
  })
})
