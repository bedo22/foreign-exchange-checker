# FX Checker

A single-page currency converter with live rates, rate-history chart, multi-currency comparison, pinned favorites, and a conversion log.

## Language

**Currency Pair**:
Two currencies identified by their ISO 4217 alphabetic codes: a base (`from`) and a quote (`to`). Every rate, conversion, and chart query in the app is scoped to a Pair.
_Avoid_: FX pair, conversion pair, instrument

**Pair**:
Shortened form of Currency Pair. Acceptable everywhere the meaning is unambiguous.

**Rate**:
The numeric exchange rate for a Pair, expressed as "1 `from` = X `to`". Always carries an implicit unit direction.
_Avoid_: Price, value, quote

**Amount**:
A numeric quantity of a currency, always denominated in a specific currency code. Used in conversions: "send X from-currency yields Y to-currency".
_Avoid_: Value, number, count

**Favorite**:
A Pair that the user has pinned for quick access. Persisted in localStorage as `fx_favorites`.
_Avoid_: Pinned pair, bookmark, saved pair

**Conversion**:
A logged record of a currency conversion containing the Pair, Amount sent, Amount received, and an ISO 8601 timestamp. Persisted in localStorage as `fx_log`.
_Avoid_: Transaction, trade, entry

**Active Pair**:
The Pair currently loaded in the converter. Determines what rate is shown, what chart is drawn, and what is favorited or logged.

**Default Pair**:
The Pair used on first visit when no Favorites exist. Set to USD → EGP (personal choice).

**Provider Toggle**:
Header control switching between `blended` (default, all 84 central banks, 170+ currencies) and `CBE` (Central Bank of Egypt only, 19 currencies, data from 2024). Replaces the Figma static text "55 CURRENCIES · EOD · ECB DATA". The header shows dynamic count and active provider.

**Chart**:
Line + area chart rendered with lightweight-charts (TradingView). A thin React wrapper (~10 lines) handles mount/unmount via ref. No chart wrapper library needed.
