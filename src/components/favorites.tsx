import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { fetchRate } from '../api'
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-neutral-400 mb-3">
          <path
            d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6L12 2z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
        <span className="text-xs text-neutral-200">
          Pin your favorite pairs to track them here
        </span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-50">Pinned pairs</span>
        <span className="text-[10px] text-neutral-200">
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
                <span className="text-xs text-neutral-50">
                  {f.from} <span className="text-neutral-200">&rarr;</span> {f.to}
                </span>
              </div>
              <span className="text-xs font-bold text-neutral-50">
                {loading ? '—' : rate ? rate.toFixed(4) : '—'}
              </span>
              <button
                onClick={() => toggleFavorite(f)}
                className="shrink-0 text-lime-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded transition-transform"
                aria-label="Unpin favorite"
              >
                <svg width="14" height="14" viewBox="0 0 10 10" fill="currentColor">
                  <path d="M5 1l1.1 2.3 2.6.4-1.9 1.8.5 2.5L5 6.7l-2.3 1.3.5-2.5L1.3 3.7l2.6-.4L5 1z" />
                </svg>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
