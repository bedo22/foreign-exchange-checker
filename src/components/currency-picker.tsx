import { useEffect, useRef, useState } from 'react'
import { fetchCurrencies } from '../api'
import { POPULAR_CURRENCIES } from '../types'

interface Props {
  side: 'from' | 'to'
  onSelect: (code: string) => void
  onClose: () => void
}

export function CurrencyPicker({ onSelect, onClose }: Props) {
  const [currencies, setCurrencies] = useState<{ code: string; name: string }[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await fetchCurrencies()
        const list = data.map((c) => ({ code: c.iso_code, name: c.name }))
        if (!cancelled) setCurrencies(list)
      } catch {
        /* offline fallback */
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const filtered = currencies.filter(
    (c) =>
      !search ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()),
  )
  const popular = filtered.filter((c) => POPULAR_CURRENCIES.includes(c.code as any))
  const rest = filtered.filter((c) => !POPULAR_CURRENCIES.includes(c.code as any))

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-neutral-700 rounded-xl w-full max-w-sm max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-500">
          <span className="text-sm font-bold uppercase tracking-wider text-neutral-50">
            Select Currency
          </span>
          <button
            onClick={onClose}
            className="text-neutral-200 hover:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="px-4 py-2">
          <div className="relative">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-300"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.3" />
              <path d="M8 8l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search currencies..."
              className="w-full h-9 pl-7 pr-3 rounded-lg bg-neutral-600 text-neutral-50 text-xs placeholder-neutral-400
                border border-transparent focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
          </div>
        </div>
        <div className="overflow-y-auto flex-1 px-4 pb-3">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-xs text-neutral-200">Loading...</div>
          ) : !filtered.length ? (
            <div className="flex items-center justify-center py-8 text-xs text-neutral-200">
              No currencies match your search
            </div>
          ) : (
            <>
              {popular.length > 0 && (
                <>
                  <div className="text-[10px] font-medium text-neutral-200 uppercase tracking-wider py-1.5">
                    Popular
                  </div>
                  {popular.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => onSelect(c.code)}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left hover:bg-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
                    >
                      <span className="w-5 h-5 rounded-full bg-neutral-500 flex items-center justify-center text-[10px] font-bold text-neutral-50">
                        {c.code[0]}
                      </span>
                      <div>
                        <div className="text-xs font-medium text-neutral-50">{c.code}</div>
                        <div className="text-[10px] text-neutral-200">{c.name}</div>
                      </div>
                    </button>
                  ))}
                </>
              )}
              {rest.length > 0 && (
                <>
                  <div className="text-[10px] font-medium text-neutral-200 uppercase tracking-wider py-1.5 mt-1">
                    Other currencies
                  </div>
                  {rest.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => onSelect(c.code)}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left hover:bg-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
                    >
                      <span className="w-5 h-5 rounded-full bg-neutral-500 flex items-center justify-center text-[10px] font-bold text-neutral-50">
                        {c.code[0]}
                      </span>
                      <div>
                        <div className="text-xs font-medium text-neutral-50">{c.code}</div>
                        <div className="text-[10px] text-neutral-200">{c.name}</div>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
