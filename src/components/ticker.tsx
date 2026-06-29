import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { fetchHistory } from '../api'
import { TICKER_CURRENCIES, DEFAULT_PAIR } from '../types'
import { formatNumber } from '../lib/utils'

interface TickerItem {
  pair: string
  rate: number
  change: number
}

export function Ticker() {
  const provider = useStore((s) => s.provider)
  const [items, setItems] = useState<TickerItem[]>([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      const results: TickerItem[] = []
      const base = DEFAULT_PAIR.from
      const today = new Date().toISOString().slice(0, 10)
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      for (const quote of TICKER_CURRENCIES) {
        if (quote === base) continue
        try {
          const data = await fetchHistory(base, quote, yesterday, today, provider)
          if (data.length >= 2) {
            const latest = data[data.length - 1].rate
            const previous = data[0].rate
            results.push({ pair: `${base}/${quote}`, rate: latest, change: ((latest - previous) / previous) * 100 })
          } else if (data.length === 1) {
            results.push({ pair: `${base}/${quote}`, rate: data[0].rate, change: 0 })
          }
        } catch {
          /* skip */
        }
      }
      if (!cancelled) setItems(results)
    }
    load()
    return () => { cancelled = true }
  }, [provider])

  if (!items.length) return null

  return (
    <div className="h-10 bg-neutral-700 flex items-center overflow-hidden">
      <span className="flex items-center gap-2 h-full px-4 bg-lime-500 shrink-0">
        <span className="w-[6px] h-[6px] rounded-full bg-neutral-900 shrink-0" />
        <span className="text-xs font-medium text-neutral-900 uppercase tracking-[0.5px]">
          Live markets
        </span>
      </span>
      <div className="flex items-center gap-4 overflow-x-auto px-3 [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const isUp = item.change >= 0
          return (
            <div key={item.pair} className="flex items-center gap-3 shrink-0 text-xs py-3 px-5 border-r border-neutral-500">
              <span className="text-neutral-50 font-medium">{item.pair}</span>
              <span className="text-neutral-50 font-bold">{formatNumber(item.rate, 4)}</span>
              <span className={`flex items-center gap-0.5 ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" className={isUp ? '' : 'rotate-180'}>
                  <path d="M4 0l4 5H0z" />
                </svg>
                {formatNumber(item.change, 1)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
