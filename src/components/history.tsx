import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { fetchHistory } from '../api'
import { Chart } from './chart'
import { formatNumber } from '../lib/utils'
import type { Rate } from '../types'

type Range = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y'
const RANGES: Range[] = ['1D', '1W', '1M', '3M', '1Y', '5Y']

function rangeOffset(range: Range): { from: string; to: string } {
  const now = new Date()
  const to = now.toISOString().slice(0, 10)
  const d = new Date(now)
  switch (range) {
    case '1D':
      d.setDate(d.getDate() - 1)
      break
    case '1W':
      d.setDate(d.getDate() - 7)
      break
    case '1M':
      d.setMonth(d.getMonth() - 1)
      break
    case '3M':
      d.setMonth(d.getMonth() - 3)
      break
    case '1Y':
      d.setFullYear(d.getFullYear() - 1)
      break
    case '5Y':
      d.setFullYear(d.getFullYear() - 5)
      break
  }
  return { from: d.toISOString().slice(0, 10), to }
}

export function History() {
  const pair = useStore((s) => s.pair)
  const provider = useStore((s) => s.provider)
  const [range, setRange] = useState<Range>('1M')
  const [rateHistory, setRateHistory] = useState<Rate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(false)
      const { from, to } = rangeOffset(range)
      try {
        const data = await fetchHistory(pair.from, pair.to, from, to, provider)
        if (!cancelled) setRateHistory(data)
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [pair.from, pair.to, range, provider])

  const latest = rateHistory.length > 0 ? rateHistory[rateHistory.length - 1].rate : 0
  const open = rateHistory.length > 0 ? rateHistory[0].rate : 0
  const change = latest - open
  const pctChange = open > 0 ? (change / open) * 100 : 0

  const chartData = rateHistory.map((r) => ({ time: r.date, value: r.rate }))

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 flex-1">
          <StatBox label="Open" value={formatNumber(open, 4)} />
          <StatBox label="Last" value={formatNumber(latest, 4)} />
          <StatBox
            label="Change"
            value={`${change >= 0 ? '+' : ''}${formatNumber(change, 4)}`}
            color={change >= 0 ? 'text-green-500' : 'text-red-500'}
          />
          <StatBox
            label="% Change"
            value={`${pctChange >= 0 ? '+' : ''}${formatNumber(pctChange, 2)}%`}
            color={pctChange >= 0 ? 'text-green-500' : 'text-red-500'}
          />
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-[0.5px] focus:outline-none focus:ring-2 focus:ring-lime-500 transition-colors ${
                r === range
                  ? 'bg-neutral-500 text-neutral-50'
                  : 'bg-neutral-600 text-neutral-200 border border-neutral-400 hover:bg-neutral-500'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-neutral-700 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-base font-medium text-neutral-50 tracking-[1px]">
            {pair.from}/{pair.to}
          </span>
          {latest > 0 && (
            <span className="text-xs text-neutral-50">
              {formatNumber(latest, 4)} &middot; {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
        {loading ? (
          <div className="h-[250px] flex items-center justify-center text-xs text-neutral-200">Loading...</div>
        ) : error ? (
          <div className="h-[250px] flex flex-col items-center justify-center text-center">
            <span className="text-xs text-neutral-50">No chart data available</span>
            <span className="text-[10px] text-neutral-200 mt-1">
              We couldn&apos;t load rate history for {pair.from}/{pair.to} right now.
            </span>
          </div>
        ) : chartData.length > 0 ? (
          <Chart data={chartData} height={250} />
        ) : (
          <div className="h-[250px] flex items-center justify-center text-xs text-neutral-200">No data</div>
        )}
      </div>
    </div>
  )
}

function StatBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-neutral-700 rounded-xl p-3">
      <div className="text-sm text-neutral-200 uppercase tracking-[1px]">{label}</div>
      <div className={`text-xl font-bold mt-1 ${color ?? 'text-neutral-50'}`}>{value}</div>
    </div>
  )
}
