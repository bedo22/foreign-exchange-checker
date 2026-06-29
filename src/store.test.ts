import { describe, it, expect } from 'vitest'
import { useStore } from './store'
import { DEFAULT_PAIR } from './types'

function resetStore() {
  useStore.setState({
    provider: 'blended',
    pair: DEFAULT_PAIR,
    amount: '1000',
    favorites: [],
    log: [],
    currencies: [],
  })
}

describe('store', () => {
  beforeEach(() => resetStore())

  it('has default state', () => {
    const s = useStore.getState()
    expect(s.provider).toBe('blended')
    expect(s.pair).toEqual(DEFAULT_PAIR)
    expect(s.amount).toBe('1000')
    expect(s.favorites).toEqual([])
    expect(s.log).toEqual([])
  })

  it('toggles provider', () => {
    useStore.getState().setProvider('cbe')
    expect(useStore.getState().provider).toBe('cbe')
    useStore.getState().setProvider('blended')
    expect(useStore.getState().provider).toBe('blended')
  })

  it('sets pair and amount', () => {
    useStore.getState().setPair({ from: 'EUR', to: 'GBP' })
    expect(useStore.getState().pair).toEqual({ from: 'EUR', to: 'GBP' })

    useStore.getState().setAmount('500')
    expect(useStore.getState().amount).toBe('500')
  })

  it('toggles favorites', () => {
    const pair = { from: 'USD', to: 'EUR' }
    expect(useStore.getState().isFavorite(pair)).toBe(false)

    useStore.getState().toggleFavorite(pair)
    expect(useStore.getState().favorites).toEqual([pair])
    expect(useStore.getState().isFavorite(pair)).toBe(true)

    useStore.getState().toggleFavorite(pair)
    expect(useStore.getState().favorites).toEqual([])
    expect(useStore.getState().isFavorite(pair)).toBe(false)
  })

  it('manages log entries', () => {
    const entry = {
      from: 'USD',
      to: 'EGP',
      amount: 1000,
      received: 49510,
      timestamp: '2026-06-29T12:00:00.000Z',
    }

    useStore.getState().addLog(entry)
    expect(useStore.getState().log).toEqual([entry])

    const entry2 = {
      from: 'EUR',
      to: 'GBP',
      amount: 500,
      received: 420,
      timestamp: '2026-06-29T13:00:00.000Z',
    }
    useStore.getState().addLog(entry2)
    expect(useStore.getState().log).toHaveLength(2)
    expect(useStore.getState().log[0]).toEqual(entry2)

    useStore.getState().removeLog(entry.timestamp)
    expect(useStore.getState().log).toEqual([entry2])

    useStore.getState().clearLog()
    expect(useStore.getState().log).toEqual([])
  })
})
