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
    <section className="pt-12 pb-6">
      <h2 className="text-preset-2 uppercase text-neutral-50 mb-4">
        Check the rate
      </h2>
      <div className="bg-neutral-700 rounded-[20px] shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-6 p-5">
          <div className="w-full md:w-[450px]">
            <div className="bg-neutral-600 rounded-2xl border border-neutral-500 p-5">
              <div className="text-preset-4 text-neutral-100 uppercase mb-5">Send</div>
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  size={6}
                  className="min-w-0 bg-transparent text-neutral-50 text-preset-1-tablet md:text-preset-1 font-bold outline-none placeholder-neutral-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  onClick={() => setPicker('from')}
                  className="shrink-0 flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg border border-neutral-400 bg-neutral-500 text-base font-medium text-neutral-50 hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-lime-500"
                >
                  {currencyFlag(pair.from) && (
                    <img src={currencyFlag(pair.from)} alt="" className="w-5 h-5 rounded-[2px] object-cover" />
                  )}
                  {pair.from}
                  <img src="/icons/icon-chevron-down.svg" alt="" className="w-2 h-2" />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleSwap}
            className="shrink-0 w-12 h-12 rounded-lg bg-neutral-600 border border-neutral-500 flex items-center justify-center
              hover:bg-lime-500 group focus:outline-none focus:ring-2 focus:ring-lime-500 self-center md:self-auto"
            aria-label="Swap currencies"
          >
            <img src="/icons/icon-exchange.svg" alt="" className="w-5 h-5 brightness-0 invert group-hover:brightness-0 group-hover:invert-0" />
          </button>

          <div className="w-full md:w-[450px]">
            <div className="bg-neutral-600 rounded-2xl border border-neutral-500 p-5">
              <div className="text-preset-4 text-neutral-100 uppercase mb-5">Receive</div>
              <div className="flex items-center justify-between">
                <span className="min-w-0 text-preset-1-tablet md:text-preset-1 font-bold text-lime-500">
                  {loading ? '—' : error ? '—' : formatNumber(received, 2)}
                </span>
                <button
                  onClick={() => setPicker('to')}
                  className="shrink-0 flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg border border-neutral-400 bg-neutral-500 text-base font-medium text-neutral-50 hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-lime-500"
                >
                  {currencyFlag(pair.to) && (
                    <img src={currencyFlag(pair.to)} alt="" className="w-5 h-5 rounded-[2px] object-cover" />
                  )}
                  {pair.to}
                  <img src="/icons/icon-chevron-down.svg" alt="" className="w-2 h-2" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-neutral-500" />

        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <span className="text-preset-5 text-neutral-50">
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
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-preset-5-medium uppercase border focus:outline-none focus:ring-2 focus:ring-lime-500 transition-colors ${
                isFavorite(pair)
                  ? 'bg-lime-500 text-neutral-900 border-lime-500'
                  : 'bg-neutral-600 text-neutral-200 border-neutral-400 hover:bg-neutral-500'
              }`}
            >
              <img
                src={isFavorite(pair) ? '/icons/icon-star-filled.svg' : '/icons/icon-star.svg'}
                alt=""
                className={`w-4 h-4 ${isFavorite(pair) ? 'brightness-0' : ''}`}
              />
              {isFavorite(pair) ? 'Favorited' : 'Favorite'}
            </button>
            <button
              onClick={handleLog}
              disabled={loading || error || numAmount === 0}
              className="px-3 py-2 rounded-lg text-preset-5-medium uppercase border border-lime-500 text-neutral-200
                hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-lime-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
