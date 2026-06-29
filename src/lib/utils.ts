import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const COUNTRY_MAP: Record<string, string> = {
  USD: 'us', EUR: 'eu', GBP: 'gb', EGP: 'eg',
  JPY: 'jp', CNY: 'cn', SAR: 'sa', AED: 'ae',
  CHF: 'ch', CAD: 'ca', AUD: 'au', KWD: 'kw',
  BHD: 'bh', QAR: 'qa', OMR: 'om', JOD: 'jo',
  SEK: 'se', NOK: 'no', DKK: 'dk', INR: 'in',
  BRL: 'br', MXN: 'mx', ZAR: 'za', TRY: 'tr',
  RUB: 'ru', KRW: 'kr', SGD: 'sg', HKD: 'hk',
  NZD: 'nz',
}

export function currencyFlag(code: string): string {
  const cc = COUNTRY_MAP[code]
  return cc ? `/flags/${cc}.webp` : ''
}

export function formatNumber(value: number, decimals: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}
