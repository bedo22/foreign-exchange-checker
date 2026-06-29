import { useEffect, useRef, useState } from 'react'
import { fetchCurrencies } from '../api'
import { currencyFlag } from '../lib/utils'
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
          <span className="text-base font-bold uppercase tracking-[1px] text-neutral-50">
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
            <img src="/icons/icon-search.svg" alt="" className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 opacity-60" />
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
                  <div className="text-xs font-medium text-neutral-200 uppercase tracking-[0.5px] py-1.5">
                    Popular
                  </div>
                  {popular.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => onSelect(c.code)}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left hover:bg-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
                    >
                      {currencyFlag(c.code) ? (
                        <img src={currencyFlag(c.code)} alt="" className="w-5 h-4 rounded-[2px] object-cover shrink-0" />
                      ) : (
                        <span className="w-5 h-4 rounded-[2px] bg-neutral-500 shrink-0" />
                      )}
                      <div>
                        <div className="text-base font-medium text-neutral-50 tracking-[1px]">{c.code}</div>
                        <div className="text-sm text-neutral-200 tracking-[1px]">{c.name}</div>
                      </div>
                    </button>
                  ))}
                </>
              )}
              {rest.length > 0 && (
                <>
                  <div className="text-xs font-medium text-neutral-200 uppercase tracking-[0.5px] py-1.5 mt-1">
                    Other currencies
                  </div>
                  {rest.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => onSelect(c.code)}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left hover:bg-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
                    >
                      {currencyFlag(c.code) ? (
                        <img src={currencyFlag(c.code)} alt="" className="w-5 h-4 rounded-[2px] object-cover shrink-0" />
                      ) : (
                        <span className="w-5 h-4 rounded-[2px] bg-neutral-500 shrink-0" />
                      )}
                      <div>
                        <div className="text-base font-medium text-neutral-50 tracking-[1px]">{c.code}</div>
                        <div className="text-sm text-neutral-200 tracking-[1px]">{c.name}</div>
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
