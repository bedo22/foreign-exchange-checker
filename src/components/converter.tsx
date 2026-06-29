import { useEffect, useState, useCallback } from 'react'
import { useStore } from '../store'
import { fetchRate } from '../api'
import { CurrencyPicker } from './currency-picker'
import type { Rate } from '../types'

export function Converter() {
  const pair = useStore((s) => s.pair)
  const setPair = useStore((s) => s.setPair)
  const amount = useStore((s) => s.amount)
  const setAmount = useStore((s) => s.setAmount)
  const provider = useStore((s) => s.provider)
  const toggleFavorite = useStore((s) => s.toggleFavorite)
  const isFavorite = useStore((s) => s.isFavorite)
  const addLog = useStore((s) => s.addLog)

  const [rate, setRate] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [picker, setPicker] = useState<'from' | 'to' | null>(null)
  const [logged, setLogged] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const r: Rate = await fetchRate(pair.from, pair.to, provider)
      setRate(r.rate)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [pair.from, pair.to, provider])

  useEffect(() => {
    load()
  }, [load])

  const numAmount = parseFloat(amount) || 0
  const received = rate !== null ? numAmount * rate : 0

  function handleSwap() {
    setPair({ from: pair.to, to: pair.from })
  }

  function handleLog() {
    addLog({
      from: pair.from,
      to: pair.to,
      amount: numAmount,
      received,
      timestamp: new Date().toISOString(),
    })
    setLogged(true)
    setTimeout(() => setLogged(false), 2000)
  }

  return (
    <section className="py-6 px-4">
      <h2 className="text-lg uppercase tracking-wider text-neutral-50 mb-4">
        Check the rate
      </h2>
      <div className="bg-neutral-700 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4">
        <div className="flex-1">
          <label className="text-[10px] text-neutral-200 uppercase tracking-wider mb-1 block">Send</label>
          <div className="bg-neutral-600 rounded-lg p-3 flex items-center gap-2">
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="flex-1 bg-transparent text-neutral-50 text-lg md:text-xl font-bold outline-none placeholder-neutral-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={() => setPicker('from')}
              className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-neutral-50 hover:bg-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
            >
              <span className="w-4 h-4 rounded-full bg-neutral-500 flex items-center justify-center text-[9px] font-bold">
                {pair.from[0]}
              </span>
              {pair.from}
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M0 2l4 4 4-4" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </button>
          </div>
        </div>

        <button
          onClick={handleSwap}
          className="shrink-0 w-8 h-8 rounded-lg bg-neutral-600 border border-neutral-500 flex items-center justify-center
            hover:bg-lime-500 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-lime-500 self-center md:self-auto"
          aria-label="Swap currencies"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M10 1l3 3-3 3M4 13L1 10l3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13 4H1M1 10h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex-1">
          <label className="text-[10px] text-neutral-200 uppercase tracking-wider mb-1 block">Receive</label>
          <div className="bg-neutral-600 rounded-lg p-3 flex items-center gap-2">
            <span className="flex-1 text-lg md:text-xl font-bold text-lime-500">
              {loading ? '—' : error ? '—' : received.toFixed(2)}
            </span>
            <button
              onClick={() => setPicker('to')}
              className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-neutral-50 hover:bg-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
            >
              <span className="w-4 h-4 rounded-full bg-neutral-500 flex items-center justify-center text-[9px] font-bold">
                {pair.to[0]}
              </span>
              {pair.to}
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M0 2l4 4 4-4" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 px-4">
        <span className="text-[10px] text-neutral-50">
          {loading
            ? 'Loading...'
            : error
              ? 'Rate unavailable'
              : rate !== null
                ? `1 ${pair.from} = ${rate.toFixed(6)} ${pair.to}`
                : '—'}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleFavorite(pair)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium uppercase tracking-wider border focus:outline-none focus:ring-2 focus:ring-lime-500 transition-colors ${
              isFavorite(pair)
                ? 'bg-lime-500 text-neutral-900 border-lime-500'
                : 'bg-neutral-600 text-neutral-200 border-neutral-400 hover:bg-neutral-500'
            }`}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill={isFavorite(pair) ? 'currentColor' : 'none'}>
              <path
                d="M5 1l1.1 2.3 2.6.4-1.9 1.8.5 2.5L5 6.7l-2.3 1.3.5-2.5L1.3 3.7l2.6-.4L5 1z"
                stroke="currentColor"
                strokeWidth="0.8"
              />
            </svg>
            {isFavorite(pair) ? 'Favorited' : 'Favorite'}
          </button>
          <button
            onClick={handleLog}
            disabled={loading || error || numAmount === 0}
            className="px-3 py-1.5 rounded-lg text-[10px] font-medium uppercase tracking-wider border border-neutral-400 text-neutral-200
              hover:bg-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {logged ? 'Logged!' : 'Log conversion'}
          </button>
        </div>
      </div>

      {picker && (
        <CurrencyPicker
          side={picker}
          onSelect={(code) => {
            if (picker === 'from') setPair({ from: code, to: pair.to })
            else setPair({ from: pair.from, to: code })
            setPicker(null)
          }}
          onClose={() => setPicker(null)}
        />
      )}
    </section>
  )
}
