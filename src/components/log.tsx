import { useStore } from '../store'
import { formatNumber } from '../lib/utils'
import type { LogEntry } from '../types'

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  if (mins < 60) return `${mins || 1}M`
  if (hours < 24) return `${hours}H`
  return new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
}

export function Log() {
  const log = useStore((s) => s.log)
  const removeLog = useStore((s) => s.removeLog)
  const clearLog = useStore((s) => s.clearLog)

  if (!log.length) {
    return (
      <div className="flex items-center justify-center py-12 text-xs text-neutral-200">
        No conversions logged yet
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-base font-bold uppercase tracking-[1px] text-neutral-50">Conversion log</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-200 tracking-[0.5px]">
            {log.length} {log.length === 1 ? 'Logged' : 'Logged'}
          </span>
          <button
            onClick={clearLog}
            className="text-xs px-2 py-1 rounded border border-neutral-400 text-neutral-200 hover:text-red-500 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-lime-500 transition-colors"
          >
            Clear all
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {log.map((entry: LogEntry) => (
          <div
            key={entry.timestamp}
            className="flex items-center gap-3 bg-neutral-600 rounded-lg p-3 hover:bg-neutral-500 transition-colors"
          >
            <span className="text-xs text-neutral-200 w-12 shrink-0 tracking-[0.5px]">
              {relativeTime(entry.timestamp)}
            </span>
            <span className="text-base font-medium text-neutral-50 flex-1 tracking-[1px]">
              {entry.from} &rarr; {entry.to}
            </span>
            <div className="text-right">
              <div className="text-base text-neutral-50">{formatNumber(entry.amount, 2)}</div>
              <div className="text-base text-lime-500">{formatNumber(entry.received, 2)}</div>
            </div>
            <button
              onClick={() => removeLog(entry.timestamp)}
              className="shrink-0 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded transition-colors"
              aria-label="Delete log entry"
            >
              <img src="/icons/icon-delete.svg" alt="" className="w-3 h-3 opacity-60 hover:opacity-100" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
