import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { fetchRate } from '../api'
import { COMPARE_CURRENCIES } from '../types'
import { currencyFlag, formatNumber } from '../lib/utils'
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
          <span className="text-base text-neutral-200 uppercase tracking-[1px]">Multi-currency</span>
          <span className="text-base font-bold text-neutral-50 ml-2 tracking-[1px]">
            {formatNumber(numAmount, 2)} FROM {pair.from}
          </span>
        </div>
        <span className="text-xs text-neutral-200 tracking-[0.5px]">{targets.length} pairs</span>
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
                {currencyFlag(code) ? (
                  <img src={currencyFlag(code)} alt="" className="w-6 h-5 rounded-[2px] object-cover shrink-0" />
                ) : (
                  <span className="w-6 h-5 rounded-[2px] bg-neutral-500 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-base font-bold text-neutral-50 tracking-[1px]">{code}</div>
                  <div className="text-xs text-neutral-200 truncate tracking-[0.5px]">{rate ? `@ ${formatNumber(rate, 4)}` : '—'}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-neutral-50 tracking-[-0.5px]">
                    {rate ? formatNumber(numAmount * rate, 2) : '—'}
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite({ from: pair.from, to: code })}
                  className="shrink-0 text-neutral-400 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded transition-transform"
                  aria-label={isFavorite({ from: pair.from, to: code }) ? 'Unfavorite' : 'Favorite'}
                >
                  <img
                    src={isFavorite({ from: pair.from, to: code }) ? '/icons/icon-star-filled.svg' : '/icons/icon-star.svg'}
                    alt=""
                    className="w-3.5 h-3.5"
                  />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
