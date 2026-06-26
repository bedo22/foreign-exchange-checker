# Project: FX Checker

## 1. Vision & goals

A single-page currency converter that lets users check live exchange rates, compare currencies, track favorites, and log conversions — all without an account. A portfolio piece showing API skills without overengineering.

## 2. Audience

- Frontend Mentor evaluators reviewing the submission
- Potential employers/clients seeing it as a portfolio piece
- The app itself is for anyone needing quick currency conversion — no accounts, no friction

## 3. Scope

### In scope

Everything in the README: converter, currency picker, live markets ticker, rate history chart, compare, favorites, conversion log, responsive layout, keyboard navigation, localStorage persistence.

### Out of scope

No backend, no auth, no user accounts, no sync across devices, no light theme, no URL persistence of currency pair, no keyboard shortcuts beyond basic nav, no CSV export, no crosshair on chart, no caching/fallback banner.

### Stretch goals

None.

## 4. Layout

Full layout specification with exact colors, typography, all states, responsive breakpoints, and interaction details: [`docs/layout-spec.md`](./layout-spec.md)

## 5. User journey

### Main flow

1. User lands on the page, sees live ticker scrolling, converter with default pair
2. Types an amount in the send field, receive updates in real time
3. Optionally changes currencies via the picker (search, select)
4. Optionally swaps currencies with the swap button
5. Can favorite the pair, or log the conversion
6. Below, tabs let them view rate history chart, compare across currencies, see pinned favorites, or review their conversion log

### Startup logic

1. Check localStorage for favorites
2. If favorites exist → load first favorite as active pair
3. If no favorites → default to USD → EGP

### Tab flows

**History tab (default):**
1. User sees stats row (OPEN, LAST, CHANGE, % CHANGE) for the active pair
2. Time range pills below — defaults to 1M
3. Clicks a different range (e.g., 1Y) — chart reloads with new data
4. Chart shows line + area, with pair label and current rate/date in header
5. If chart fails to load, sees friendly error message instead of broken UI

**Compare tab:**
1. User clicks COMPARE tab
2. Sees "MULTI-CURRENCY 1,000 FROM USD" header with their send amount
3. List shows their send amount converted into ~8 popular currencies
4. Each row: flag, code, name, converted amount, rate, star
5. Clicks a star — that pair gets pinned to Favorites
6. Clicks again — unpins
7. If send amount is empty, prompt says "Enter an amount to compare"

**Favorites tab:**
1. User clicks FAVORITES tab
2. Sees "PINNED PAIRS" header with count
3. List shows each pinned pair with live rate and 24h change
4. Clicks a row — loads that pair into the converter
5. Clicks the star — unpins, row disappears, count decrements
6. If empty: "Pin your favorite pairs to track them here"

**Log tab:**
1. User clicks LOG tab
2. Sees "CONVERSION LOG" header with count + "CLEAR ALL" button
3. List shows past conversions: relative time, pair, send amount, received, trash icon
4. Clicks trash — entry deleted, count decrements
5. Clicks "CLEAR ALL" — all entries wiped, shows empty state
6. If empty: "No conversions logged yet"

### Secondary flows

**Currency picker:**
1. User clicks a currency picker button (send or receive)
2. Modal opens with search input + grouped list (Popular, Other)
3. Types to search — list filters in real time
4. Clicks a currency — modal closes, converter updates, rate recalculates
5. Escape or X closes the modal without selecting

**Swap:**
1. User clicks swap button
2. Send and receive currencies flip
3. Amounts recalculate
4. Favorite state may change

## 6. Data model

### API

Frankfurter API (free, no API key, ECB-backed).

- `GET /v2/currencies` — currency list for picker
- `GET /v2/latest?base=USD` — live rates for converter, ticker, comparison
- `GET /v2/latest?base=USD&symbols=EUR` — lighter single-pair lookup
- `GET /v2/{start}..{end}?base=USD&symbols=EUR` — rate history time series

### Local persistence (localStorage)

**Favorites** (key: `fx_favorites`):
```json
[{ "from": "USD", "to": "EUR" }, { "from": "GBP", "to": "JPY" }]
```

**Conversion log** (key: `fx_log`):
```json
[{ "from": "USD", "to": "EUR", "amount": 1000, "received": 853.02, "timestamp": "2026-05-14T16:00:00.000Z" }]
```

Timestamps stored as ISO 8601 — matches API format, natively parsed by chart libraries, lexicographically sortable, human-readable in localStorage inspector.

## 7. Constraints

### Technical

- No backend, no auth, no API key
- Target modern browsers (Chrome, Firefox, Safari, Edge) — no IE11
- localStorage for persistence
- Vanilla HTML/CSS/JS or bundler (TBD)

### Design

- Dark theme only
- JetBrains Mono font (provided in starter)
- Colors: Lime 500 #CEF739, Green 500 #42EB05, Red 500 #FF4141, Neutrals #0A0A0A–#FFFFFF
- Full spec in `docs/layout-spec.md`

### Resources

- Solo project
- 30-day hackathon window (flexible)
