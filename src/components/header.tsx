import { useStore } from '../store'

export function Header() {
  const provider = useStore((s) => s.provider)
  const currencies = useStore((s) => s.currencies)
  const setProvider = useStore((s) => s.setProvider)
  const count = provider === 'cbe' ? 19 : currencies.length || 170

  return (
    <header className="flex items-center justify-between h-[66px] px-6">
      <span className="flex items-center">
        <img src="/icons/logo.svg" alt="FX Checker" className="h-[26px]" />
      </span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-neutral-200 font-medium tracking-[0.5px] uppercase">
          {count} Currencies · EOD · {provider === 'blended' ? 'Blended' : 'CBE'}
        </span>
        <button
          onClick={() => setProvider(provider === 'blended' ? 'cbe' : 'blended')}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium tracking-wider uppercase
            border border-neutral-400 text-neutral-100 hover:bg-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
          aria-label={`Switch to ${provider === 'blended' ? 'CBE' : 'Blended'}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${provider === 'blended' ? 'bg-lime-500' : 'bg-neutral-400'}`}
          />
          Blended
          <span className="text-neutral-400">/</span>
          CBE
          <span
            className={`w-1.5 h-1.5 rounded-full ${provider === 'cbe' ? 'bg-lime-500' : 'bg-neutral-400'}`}
          />
        </button>
      </div>
    </header>
  )
}
