import { useState } from 'react'
import { useStore } from './store'
import { Header } from './components/header'
import { Ticker } from './components/ticker'
import { Converter } from './components/converter'
import { History } from './components/history'
import { Compare } from './components/compare'
import { Favorites } from './components/favorites'
import { Log } from './components/log'

type Tab = 'history' | 'compare' | 'favorites' | 'log'
const TABS: { key: Tab; label: string }[] = [
  { key: 'history', label: 'History' },
  { key: 'compare', label: 'Compare' },
  { key: 'favorites', label: 'Favorites' },
  { key: 'log', label: 'Log' },
]

function App() {
  const [tab, setTab] = useState<Tab>('history')
  const favorites = useStore((s) => s.favorites)
  const log = useStore((s) => s.log)

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-50 font-mono">
      <Header />
      <Ticker />
      <div className="mx-auto max-w-[1100px] px-8">
        <Converter />
        <section>
          <nav className="flex gap-6 border-b border-neutral-400 mb-4" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`relative py-2 text-base uppercase tracking-[1px] focus:outline-none focus:ring-2 focus:ring-lime-500 rounded transition-colors ${
                  tab === t.key
                    ? 'text-neutral-50 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-lime-500'
                    : 'text-neutral-200 hover:text-neutral-100'
                }`}
              >
                {t.label}
                {(t.key === 'favorites' || t.key === 'log') && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded text-xs tracking-[0.5px] bg-lime-800 text-lime-500">
                    {t.key === 'favorites' ? favorites.length : log.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div role="tabpanel" aria-labelledby={`tab-${tab}`}>
            {tab === 'history' && <History />}
            {tab === 'compare' && <Compare />}
            {tab === 'favorites' && <Favorites />}
            {tab === 'log' && <Log />}
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
