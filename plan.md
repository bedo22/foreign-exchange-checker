# Implementation Plan

## Phase 1 — Foundation (no UI)
- `src/types.ts` — Currency, Pair, Rate, Favorite, LogEntry, Provider shapes
- `src/api.ts` — fetchCurrencies(), fetchRate(), fetchHistory()
- `src/store.ts` — Zustand store (pair, amount, provider, favorites[], log[], all actions)

## Phase 2 — Shell
- `src/index.css` — Tailwind import + custom theme colors
- `src/App.tsx` — layout grid
- `src/components/chart.tsx` — lightweight-charts wrapper (~10 lines)

## Phase 3 — Components
- `src/components/header.tsx` — logo + provider toggle
- `src/components/ticker.tsx` — scrolling rates
- `src/components/currency-picker.tsx` — shadcn Dialog + search + select
- `src/components/converter.tsx` — send/receive/swap/fav/log
- `src/components/tabs/history.tsx` — stats + time pills + chart
- `src/components/tabs/compare.tsx` — multi-currency rows
- `src/components/tabs/favorites.tsx` — pinned pairs
- `src/components/tabs/log.tsx` — conversion history

## Phase 4 — Tests
- `src/api.spec.ts` — mocked fetch
- `src/store.spec.ts` — state transitions
- Integration tests — user flows
