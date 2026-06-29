import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Currency, Favorite, LogEntry, Pair, Provider } from './types'
import { DEFAULT_PAIR } from './types'

interface AppState {
  provider: Provider
  pair: Pair
  amount: string
  favorites: Favorite[]
  log: LogEntry[]
  currencies: Currency[]

  setProvider: (p: Provider) => void
  setPair: (p: Pair) => void
  setAmount: (a: string) => void
  setCurrencies: (c: Currency[]) => void
  toggleFavorite: (pair: Pair) => void
  isFavorite: (pair: Pair) => boolean
  addLog: (entry: LogEntry) => void
  removeLog: (timestamp: string) => void
  clearLog: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      provider: 'blended',
      pair: DEFAULT_PAIR,
      amount: '1000',
      favorites: [],
      log: [],
      currencies: [],

      setProvider: (provider) => set({ provider }),
      setPair: (pair) => set({ pair }),
      setAmount: (amount) => set({ amount }),
      setCurrencies: (currencies) => set({ currencies }),

      toggleFavorite: (pair) => {
        const { favorites } = get()
        const key = (p: Pair) => `${p.from}-${p.to}`
        const exists = favorites.some((f) => key(f) === key(pair))
        set({
          favorites: exists
            ? favorites.filter((f) => key(f) !== key(pair))
            : [...favorites, pair],
        })
      },

      isFavorite: (pair) => {
        const key = (p: Pair) => `${p.from}-${p.to}`
        return get().favorites.some((f) => key(f) === key(pair))
      },

      addLog: (entry) => set((s) => ({ log: [entry, ...s.log] })),
      removeLog: (timestamp) =>
        set((s) => ({ log: s.log.filter((e) => e.timestamp !== timestamp) })),
      clearLog: () => set({ log: [] }),
    }),
    {
      name: 'fx-checker',
      partialize: (state) => ({
        favorites: state.favorites,
        log: state.log,
        pair: state.pair,
        amount: state.amount,
        provider: state.provider,
      }),
    },
  ),
)
