import { useStore } from '../store'
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
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-50">Conversion log</span>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-neutral-200">
            {log.length} {log.length === 1 ? 'Logged' : 'Logged'}
          </span>
          <button
            onClick={clearLog}
            className="text-[10px] px-2 py-1 rounded border border-neutral-400 text-neutral-200 hover:text-red-500 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-lime-500 transition-colors"
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
            <span className="text-[10px] text-neutral-200 w-10 shrink-0">
              {relativeTime(entry.timestamp)}
            </span>
            <span className="text-xs text-neutral-50 flex-1">
              {entry.from} &rarr; {entry.to}
            </span>
            <div className="text-right">
              <div className="text-xs text-neutral-50">{entry.amount.toFixed(2)}</div>
              <div className="text-xs text-lime-500">{entry.received.toFixed(2)}</div>
            </div>
            <button
              onClick={() => removeLog(entry.timestamp)}
              className="shrink-0 text-neutral-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded transition-colors"
              aria-label="Delete log entry"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 3h8M4.5 3V2a1 1 0 011-1h1a1 1 0 011 1v1M9.5 3v7a1 1 0 01-1 1h-5a1 1 0 01-1-1V3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 5.5v3M7 5.5v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
