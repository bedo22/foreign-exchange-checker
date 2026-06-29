import type { Currency, Provider, Rate } from './types'

const BASE = 'https://api.frankfurter.dev/v2'

function providerParam(p?: Provider): string {
  return p === 'cbe' ? '?providers=CBE' : ''
}

export async function fetchCurrencies(): Promise<Currency[]> {
  const res = await fetch(`${BASE}/currencies`)
  if (!res.ok) throw new Error('Failed to fetch currencies')
  return res.json()
}

export async function fetchRate(
  base: string,
  quote: string,
  provider?: Provider,
): Promise<Rate> {
  const res = await fetch(`${BASE}/rate/${base}/${quote}${providerParam(provider)}`)
  if (!res.ok) throw new Error('Failed to fetch rate')
  return res.json()
}

export async function fetchHistory(
  base: string,
  quotes: string,
  from: string,
  to: string,
  provider?: Provider,
): Promise<Rate[]> {
  const params = new URLSearchParams({ base, quotes, from, to })
  if (provider === 'cbe') params.set('providers', 'CBE')
  const res = await fetch(`${BASE}/rates?${params}`)
  if (!res.ok) throw new Error('Failed to fetch history')
  return res.json()
}
