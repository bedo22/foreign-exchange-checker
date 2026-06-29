import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { fetchRate } from '../api'
import type { Rate } from '../types'
import { POPULAR_CURRENCIES, DEFAULT_PAIR } from '../types'

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
      for (const quote of POPULAR_CURRENCIES) {
        if (quote === base) continue
        try {
          const r: Rate = await fetchRate(base, quote, provider)
          results.push({ pair: `${base}/${quote}`, rate: r.rate, change: 0 })
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
    <div className="h-8 bg-lime-500 flex items-center overflow-hidden">
      <span className="flex items-center gap-2 h-full px-3 bg-lime-500 shrink-0">
        <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
        <span className="text-[10px] font-medium text-neutral-900 uppercase tracking-wider">
          Live markets
        </span>
      </span>
      <div className="flex items-center gap-4 overflow-x-auto px-3 [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <div key={item.pair} className="flex items-center gap-2 shrink-0 text-[10px]">
            <span className="text-neutral-900 font-medium">{item.pair}</span>
            <span className="text-neutral-900 font-bold">{item.rate.toFixed(4)}</span>
            <span className="flex items-center gap-0.5 text-neutral-900">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                <path d="M4 0l4 5H0z" />
              </svg>
              0.0%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
