import { useEffect, useState, useCallback } from 'react'
import { useStore } from '../store'
import { fetchRate } from '../api'
import { CurrencyPicker } from './currency-picker'
import { currencyFlag, formatNumber } from '../lib/utils'
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
    <section className="py-6">
      <h2 className="text-xl uppercase tracking-wider text-neutral-50 mb-4">
        Check the rate
      </h2>
      <div className="bg-neutral-700 rounded-[20px]">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4 p-4">
          <div className="flex-1">
            <div className="bg-neutral-600 rounded-lg p-3">
              <div className="text-xs text-neutral-200 uppercase tracking-[0.5px] mb-2">Send</div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="flex-1 bg-transparent text-neutral-50 text-preset-1-tablet md:text-preset-1 font-bold outline-none placeholder-neutral-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  onClick={() => setPicker('from')}
                  className="flex items-center gap-1.5 px-2 py-1 rounded text-base font-medium text-neutral-50 hover:bg-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
                >
                  {currencyFlag(pair.from) && (
                    <img src={currencyFlag(pair.from)} alt="" className="w-4 h-3 rounded-[2px] object-cover" />
                  )}
                  {pair.from}
                  <img src="/icons/icon-chevron-down.svg" alt="" className="w-2 h-2" />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleSwap}
            className="shrink-0 w-8 h-8 rounded-lg bg-neutral-600 border border-neutral-500 flex items-center justify-center
              hover:bg-lime-500 group focus:outline-none focus:ring-2 focus:ring-lime-500 self-center md:self-auto"
            aria-label="Swap currencies"
          >
            <img src="/icons/icon-exchange-vertical.svg" alt="" className="w-3.5 h-3.5 brightness-0 invert group-hover:brightness-0 group-hover:invert-0" />
          </button>

          <div className="flex-1">
            <div className="bg-neutral-600 rounded-lg p-3">
              <div className="text-xs text-neutral-200 uppercase tracking-[0.5px] mb-2">Receive</div>
              <div className="flex items-center gap-2">
                <span className="flex-1 text-preset-1-tablet md:text-preset-1 font-bold text-lime-500">
                  {loading ? '—' : error ? '—' : formatNumber(received, 2)}
                </span>
                <button
                  onClick={() => setPicker('to')}
                  className="flex items-center gap-1.5 px-2 py-1 rounded text-base font-medium text-neutral-50 hover:bg-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
                >
                  {currencyFlag(pair.to) && (
                    <img src={currencyFlag(pair.to)} alt="" className="w-4 h-3 rounded-[2px] object-cover" />
                  )}
                  {pair.to}
                  <img src="/icons/icon-chevron-down.svg" alt="" className="w-2 h-2" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-neutral-500 mx-4" />

        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <span className="text-xs text-neutral-50">
            {loading
              ? 'Loading...'
              : error
                ? 'Rate unavailable'
                : rate !== null
                  ? `1 ${pair.from} = ${formatNumber(rate, 4)} ${pair.to}`
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
              <img
                src={isFavorite(pair) ? '/icons/icon-star-filled.svg' : '/icons/icon-star.svg'}
                alt=""
                className={`w-3 h-3 ${isFavorite(pair) ? 'brightness-0' : ''}`}
              />
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
