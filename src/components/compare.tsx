import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { fetchRate } from '../api'
import { COMPARE_CURRENCIES } from '../types'
import type { Rate } from '../types'

export function Compare() {
  const pair = useStore((s) => s.pair)
  const provider = useStore((s) => s.provider)
  const amount = useStore((s) => s.amount)
  const toggleFavorite = useStore((s) => s.toggleFavorite)
  const isFavorite = useStore((s) => s.isFavorite)
  const [rates, setRates] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const targets = COMPARE_CURRENCIES.filter((c) => c !== pair.from)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(false)
      const result: Record<string, number> = {}
      for (const quote of targets) {
        try {
          const r: Rate = await fetchRate(pair.from, quote, provider)
          result[quote] = r.rate
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
  }, [pair.from, provider])

  const numAmount = parseFloat(amount) || 0

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] text-neutral-200 uppercase tracking-wider">Multi-currency</span>
          <span className="text-xs font-bold text-neutral-50 ml-2">
            {numAmount.toFixed(2)} FROM {pair.from}
          </span>
        </div>
        <span className="text-[10px] text-neutral-200">{targets.length} pairs</span>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-8 text-xs text-neutral-200">Loading...</div>
      ) : error ? (
        <div className="flex items-center justify-center py-8 text-xs text-neutral-200">
          Unable to load comparison rates
        </div>
      ) : numAmount === 0 ? (
        <div className="flex items-center justify-center py-8 text-xs text-neutral-200">
          Enter an amount to compare
        </div>
      ) : (
        <div className="space-y-2">
          {targets.map((code) => {
            const rate = rates[code]
            return (
              <div
                key={code}
                className="flex items-center gap-3 bg-neutral-600 rounded-lg p-3 hover:bg-neutral-500 transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-neutral-500 flex items-center justify-center text-xs font-bold text-neutral-50 shrink-0">
                  {code[0]}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-neutral-50">{code}</div>
                  <div className="text-[10px] text-neutral-200 truncate">{rate ? `@ ${rate.toFixed(4)}` : '—'}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-neutral-50">
                    {rate ? (numAmount * rate).toFixed(2) : '—'}
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite({ from: pair.from, to: code })}
                  className="shrink-0 text-neutral-400 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded transition-transform"
                  aria-label={isFavorite({ from: pair.from, to: code }) ? 'Unfavorite' : 'Favorite'}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 10 10"
                    fill={isFavorite({ from: pair.from, to: code }) ? '#CEF739' : 'none'}
                  >
                    <path
                      d="M5 1l1.1 2.3 2.6.4-1.9 1.8.5 2.5L5 6.7l-2.3 1.3.5-2.5L1.3 3.7l2.6-.4L5 1z"
                      stroke={isFavorite({ from: pair.from, to: code }) ? '#CEF739' : 'currentColor'}
                      strokeWidth="0.8"
                    />
                  </svg>
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
