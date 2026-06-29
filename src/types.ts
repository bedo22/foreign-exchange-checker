export type Provider = 'blended' | 'cbe'

export interface Currency {
  iso_code: string
  name: string
  symbol: string
}

export interface Pair {
  from: string
  to: string
}

export interface Rate {
  date: string
  base: string
  quote: string
  rate: number
}

export interface Favorite {
  from: string
  to: string
}

export interface LogEntry {
  from: string
  to: string
  amount: number
  received: number
  timestamp: string
}

export const POPULAR_CURRENCIES = ['USD', 'EUR', 'GBP'] as const

export const TICKER_CURRENCIES = ['EUR', 'GBP', 'EGP', 'SAR', 'AED', 'JPY', 'CHF']

export const COMPARE_CURRENCIES = ['EUR', 'GBP', 'USD', 'SAR', 'AED', 'JPY', 'CHF', 'CAD', 'AUD']

export const CBE_CURRENCIES = [
  'AED', 'AUD', 'BHD', 'CAD', 'CHF', 'CNY', 'DKK',
  'EGP', 'EUR', 'GBP', 'JOD', 'JPY', 'KWD',
  'NOK', 'OMR', 'QAR', 'SAR', 'SEK', 'USD',
]

export const DEFAULT_PAIR: Pair = { from: 'USD', to: 'EGP' }
