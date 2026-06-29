import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { fetchRate } from '../api'
import { formatNumber } from '../lib/utils'
import type { Rate, Favorite } from '../types'

export function Favorites() {
  const favorites = useStore((s) => s.favorites)
  const toggleFavorite = useStore((s) => s.toggleFavorite)
  const provider = useStore((s) => s.provider)
  const [rates, setRates] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!favorites.length) return
    let cancelled = false
    async function load() {
      setLoading(true)
      const result: Record<string, number> = {}
      for (const f of favorites) {
        try {
          const r: Rate = await fetchRate(f.from, f.to, provider)
          result[`${f.from}-${f.to}`] = r.rate
        } catch {
          /* skip */
        }
      }
      if (!cancelled) {
        setRates(result)
        setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [favorites, provider])

  if (!favorites.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <img src="/icons/icon-star.svg" alt="" className="w-6 h-6 opacity-40 mb-3" />
        <span className="text-xs text-neutral-200">
          Pin your favorite pairs to track them here
        </span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-base font-bold uppercase tracking-[1px] text-neutral-50">Pinned pairs</span>
        <span className="text-xs text-neutral-200 tracking-[0.5px]">
          {favorites.length} {favorites.length === 1 ? 'Favorite' : 'Favorites'}
        </span>
      </div>
      <div className="space-y-2">
        {favorites.map((f: Favorite) => {
          const key = `${f.from}-${f.to}`
          const rate = rates[key]
          return (
            <div
              key={key}
              className="flex items-center gap-3 bg-neutral-600 rounded-lg p-3 hover:bg-neutral-500 transition-colors"
            >
              <div className="flex-1">
                <span className="text-base font-medium text-neutral-50 tracking-[1px]">
                  {f.from} <span className="text-neutral-200">&rarr;</span> {f.to}
                </span>
              </div>
              <span className="text-xl font-bold text-neutral-50 tracking-[-0.5px]">
                {loading ? '—' : rate ? formatNumber(rate, 4) : '—'}
              </span>
              <button
                onClick={() => toggleFavorite(f)}
                className="shrink-0 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded transition-transform"
                aria-label="Unpin favorite"
              >
                <img src="/icons/icon-star-filled.svg" alt="" className="w-3.5 h-3.5" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
