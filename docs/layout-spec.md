# FX Checker — Layout Specification

---

## 1. Color Palette

### Neutrals

| Name | Hex | Usage |
|------|-----|-------|
| Neutral 900 | #0A0A0A | Page background |
| Neutral 700 | #171719 | Card backgrounds, converter boxes, stat boxes, chart container |
| Neutral 600 | #202022 | Input fields |
| Neutral 500 | #2E2E2E | Hover backgrounds, secondary surfaces |
| Neutral 400 | #3D3D3D | Borders, dividers, subtle outlines |
| Neutral 300 | #454547 | Focus rings, active borders |
| Neutral 200 | #9D9D9D | Secondary text, labels, placeholders |
| Neutral 100 | #C6C6C6 | Tertiary text, muted captions |
| Neutral 50 | #FFFFFF | Primary text, headings, values |

### Accents

| Name | Hex | Usage |
|------|-----|-------|
| Lime 500 | #CEF739 | Primary accent: active tabs, favorite buttons, received amounts, chart line, positive badges, swap button hover |
| Lime 800 | #283300 | Dark lime for contrast backgrounds |
| Green 500 | #42EB05 | Positive rate changes, up arrows |
| Red 500 | #FF4141 | Negative rate changes, down arrows, delete hover |

---

## 2. Typography

**Font family:** JetBrains Mono (variable weight)

All text is monospace. Weights used: Regular (400), Medium (500), Bold (700).

### Text Presets

| Preset | Size | Weight | Line Height | Letter Spacing | Usage |
|--------|------|--------|-------------|----------------|-------|
| 1 | 40px | Bold | 100% | -0.5px | Converter amounts (send/receive values) |
| 1 (Tablet) | 32px | Bold | 100% | -0.5px | Converter amounts on tablet |
| 2 | 20px | Regular | 120% | -0.5px | Section titles ("CHECK THE RATE"), stat values (OPEN, LAST, CHANGE) |
| 2 (Bold) | 20px | Bold | 140% | -0.5px | Converted amounts in compare |
| 3 | 16px | Regular | 120% | 1px | Tab labels, list item text, currency codes |
| 3 (Medium) | 16px | Medium | 120% | 1px | Chart pair label ("USD/EUR"), currency picker rows, favorite pair labels |
| 3 (Bold) | 16px | Bold | 110% | 1px | Tab bar active state, list headers ("PINNED PAIRS") |
| 4 | 14px | Regular | 120% | 1px | Stat labels (OPEN, LAST, CHANGE, % CHANGE), comparison rates |
| 5 | 12px | Regular | 120% | 0.5px | Rate text ("1 USD = 0.8530 EUR"), badge counts, ticker items, secondary info |
| 5 (Medium) | 12px | Medium | 130% | 0.5px | Header right text (provider name, currency count), section sublabels |
| 6 | 10px | Regular | 100% | 0px | Fine print, chart axis labels, timestamps in log |

---

## 3. Overall Page Structure

Single page, dark theme. Background Neutral 900 (#0A0A0A). All content centered within a max-width container (~1200px). Font: JetBrains Mono throughout. Primary accent: Lime 500 (#CEF739). Secondary accent: Green 500 (#42EB05) for positive, Red 500 (#FF4141) for negative.

---

## 4. Header

- Left side: Logo icon (Lime 500 lightning bolt in rounded square) + "FX_CHECKER" text (Preset 3 Bold, Neutral 50)
- Right side: Provider Toggle — switches between `blended` (170+ currencies, all 84 central banks) and `CBE` (19 currencies, Central Bank of Egypt). Shows dynamic count and active provider name.
- Height: ~48–60px, vertically centered content
- Toggle has hover/focus states; rest of header is non-interactive

---

## 5. Live Markets Ticker

Immediately below header, full-width horizontal strip. Height: ~32–40px.

- Left edge: Green dot (Green 500) + "LIVE MARKETS" label (Preset 5 Medium, Neutral 900 on Lime 500 background)
- Rest of strip: horizontal scrolling content (CSS overflow or marquee animation)
- Each ticker item: currency pair code (Neutral 100), rate in bold (Neutral 50), change indicator
- Change indicator: Green 500 up arrow + Green 500 text for positive, Red 500 down arrow + Red 500 text for negative
- Items separated by Neutral 500 (`#2e2e2e`) vertical stroke dividers
- No interaction on individual items (display only)

---

## 6. Converter Section

### 6a. Section Title

- "CHECK THE RATE" (Preset 2, Neutral 50, uppercase), left-aligned
- Margin above and below to separate from ticker and converter card

### 6b. Converter Card (Desktop/Tablet)

Dark rounded container (Neutral 700 background, rounded corners ~12px).

**Two input boxes side by side:**

- **SEND box (left):**
  - "SEND" label (Preset 5, Neutral 200, uppercase)
  - Large amount input (Preset 1, Neutral 50, monospace), placeholder "0" when empty (Neutral 400)
  - Currency picker button: flag icon + currency code (Preset 3 Medium, Neutral 50) + chevron down
  - Box background: Neutral 600, rounded corners

- **Swap button (center, overlapping both boxes):**
  - Rounded square button (Neutral 600 background, Neutral 500 border)
  - Bidirectional arrow icon (↔ horizontal on desktop, ↕ on mobile)
  - Hover: Lime 500 background, Neutral 900 icon
  - Focus: Lime 500 focus ring
  - On click: swaps send and receive currencies, amounts recalculate

- **RECEIVE box (right):**
  - "RECEIVE" label (Preset 5, Neutral 200, uppercase)
  - Large output amount (Preset 1, Lime 500, display only)
  - Currency picker button: flag + code + chevron (same as send)

**Below the two boxes, inside the card:**

- Solid horizontal border (Neutral 500, `#2e2e2e`)
- Left: Rate text "1 USD = 0.8530 EUR" (Preset 5, Neutral 50)
- Right: Two action buttons side by side

**Action buttons:**

- "★ FAVORITED" / "☆ FAVORITE":
  - Favorited: Lime 500 background, Neutral 900 text, solid star
  - Not favorited: Neutral 600 background, Neutral 300 border, Neutral 200 text, outlined star
  - Hover: slight opacity change
  - Focus: Lime 500 focus ring
- "LOG CONVERSION":
  - Neutral 300 border, Neutral 200 text
  - Hover: Neutral 500 background
  - Focus: Lime 500 focus ring

### 6c. Converter Card (Mobile)

- Stack vertically: SEND box full width → swap button centered → RECEIVE box full width
- Swap button arrows change to vertical (↕)
- Rate text and buttons centered below the card

### 6d. Converter States

| State | Description |
|-------|-------------|
| **Default** | Amounts show default values (1,000 send, converted receive), currencies default USD → EUR |
| **Empty send** | Send input shows "0" or placeholder, receive shows "0", rate still displays |
| **Typing** | As user types in send field, receive updates in real time (debounced or immediate) |
| **Loading** | Brief flash or spinner while fetching rate after currency change |
| **Error** | If API fails, receive shows "--" or "Error", rate line shows last known or error text |
| **Swapped** | Currencies flip, amounts recalculate, favorite state may change |

---

## 7. Tab Bar

Below converter card, horizontal tab list.

- Tabs: HISTORY | COMPARE | FAVORITES | LOG
- Each tab: uppercase (Preset 3, Neutral 200)
- Active tab: Lime 500 underline (2–3px), Neutral 50 text
- Inactive tabs: Neutral 200 text, no underline
- FAVORITES and LOG tabs show badge (rounded rectangle, Lime 800 background, Lime 500 text, Preset 5)
- Badge shows "0" when empty, or actual count
- Hover (inactive tabs): text lightens to Neutral 100
- Focus: Lime 500 focus ring around tab

### Tab Bar States

| State | Description |
|-------|-------------|
| **All empty** | FAVORITES badge shows 0, LOG badge shows 0 |
| **With data** | Badges show actual counts (e.g., FAVORITES 10, LOG 8) |
| **Hover** | Inactive tab text lightens to Neutral 100 |
| **Focus** | Lime 500 visible focus ring (keyboard nav) |

---

## 8. Tab Content — HISTORY

### 8a. Stats Row

Four stat boxes in a horizontal row (4 columns desktop, 2×2 mobile). Each box: Neutral 700 background, rounded corners, padding.

| Stat | Label (Preset 4, Neutral 50) | Value (Preset 2, Neutral 50) |
|------|-------------------------------|-----------------------------------|
| OPEN | "OPEN" | Opening rate (e.g., 0.8516) |
| LAST | "LAST" | Latest rate (e.g., 0.8530) |
| CHANGE | "CHANGE" | Absolute change, Green 500 if +, Red 500 if − |
| % CHANGE | "% CHANGE" | Percentage change, Green 500 if +, Red 500 if −, with arrow icon |

### 8b. Time Range Selector

Row of pill buttons to the right of stats (or below on mobile):

- Options: 1D | 1W | 1M | 3M | 1Y | 5Y
- Active pill: Neutral 500 background, Neutral 50 text
- Inactive pills: Neutral 600 background, Neutral 300 border, Neutral 200 text
- Hover: Neutral 500 background
- Focus: Lime 500 focus ring
- On click: fetches new historical data for selected range, chart updates

### 8c. Chart Area

Large chart container (Neutral 700 background) below stats and time selector.

- Header line: "USD/EUR" pair label (Preset 3 Medium, Neutral 50) on left, "0.8530 · MAY 14 16:00 CET" (Preset 5, Neutral 50) on right
- Chart type: line chart with area fill (gradient from Lime 500 to transparent below the line)
- Y-axis: rate values (e.g., 0.8421, 0.8516, 0.8612) as Neutral 200 text (Preset 6), left side
- X-axis: dates (e.g., Apr 14, Apr 21, Apr 28) as Neutral 200 text (Preset 6), bottom
- Line color: Lime 500
- Area fill: Lime 500 gradient with transparency
- Grid lines: Neutral 500 horizontal dashed lines at major y-axis values
- Hover crosshair: built-in via lightweight-charts, vertical line + tooltip with exact date and rate

### 8d. History Empty/Error States

- **No chart data available:** Centered "No chart data available" (Preset 2, Neutral 50), subtext "We couldn't load rate history for USD/EUR right now. This usually clears up in a minute." (Preset 4, Neutral 200)
- **Loading:** Optional skeleton or spinner while fetching
- **API down:** Shows last cached data if available, or error message

---

## 9. Tab Content — COMPARE

### 9a. Header

- Left: "MULTI-CURRENCY" (Preset 3, Neutral 200) + "1,000 FROM USD" (Preset 3 Bold, Neutral 50)
- Right: "8 PAIRS" (Preset 5, Neutral 200)

### 9b. Comparison List

Vertical list of currency rows. Each row (Neutral 600 background, rounded corners, padding):

- **Flag:** Small circular flag icon on the left
- **Currency code:** Preset 3 Bold, Neutral 50 (e.g., GBP)
- **Currency name:** Preset 4, Neutral 200 below code (e.g., British Pound)
- **Converted amount:** Preset 2 Bold, Neutral 50, right-aligned (e.g., 736.65)
- **Rate:** Preset 5, Neutral 200 below amount, "@ 0.7366"
- **Favorite star:** Far right, outlined star (Neutral 400) or filled star (Lime 500)
  - Hover: scale up slightly
  - Focus: Lime 500 focus ring
  - On click: toggles favorite for that pair

### 9c. Compare States

| State | Description |
|-------|-------------|
| **Default** | All currencies from API with converted amounts based on send input |
| **Empty send** | Prompt: "Enter an amount to compare" (Preset 3, Neutral 200) |
| **Loading** | Skeleton rows (Neutral 500 animated) while fetching rates |
| **Error** | "Unable to load comparison rates" (Preset 3, Neutral 200) |
| **Hover on row** | Row background lightens to Neutral 500 |
| **Focus** | Lime 500 focus ring on star button |

---

## 10. Tab Content — FAVORITES

### 10a. Header

- Left: "PINNED PAIRS" (Preset 3 Bold, Neutral 50, uppercase)
- Right: "10 FAVORITES" (Preset 5, Neutral 200, plural) or "1 FAVORITE" (singular)

### 10b. Favorites List

Vertical list of pinned pairs. Each row (Neutral 600 background, rounded corners, padding):

- **Pair:** "USD → EUR" (Preset 3 Medium, Neutral 50), arrow separator (Neutral 200)
- **Rate:** Preset 2 Bold, Neutral 50, right-aligned (e.g., 0.8530)
- **24h change:** Preset 5, Green 500 (+0.16%) or Red 500 (−0.22%), with arrow icon
- **Unpin star:** Far right, filled star (Lime 500)
  - Hover: scale up slightly
  - Focus: Lime 500 focus ring
  - On click: removes pair from favorites, row animates out, count decrements

### 10c. Favorites States

| State | Description |
|-------|-------------|
| **Default** | List of pinned pairs with live rates and 24h changes |
| **Empty** | "Pin your favorite pairs to track them here" (Preset 3, Neutral 200) with star icon |
| **One favorite** | Single row, count shows "1 FAVORITE" (singular) |
| **Hover** | Row background lightens to Neutral 500, cursor pointer |
| **Focus** | Lime 500 focus ring on star button |

---

## 11. Tab Content — LOG

### 11a. Header

- Left: "CONVERSION LOG" (Preset 3 Bold, Neutral 50, uppercase)
- Right: "8 LOGGED" (Preset 5, Neutral 200) + "CLEAR ALL" button (Preset 5, Neutral 400 border, Neutral 200 text)

### 11b. Log List

Vertical list of logged conversions, most recent first. Each row (Neutral 600 background, rounded corners, padding):

- **Relative time:** Preset 5, Neutral 200, left side (e.g., "20M", "1H", "13 May")
- **Pair:** Preset 3 Medium, Neutral 50 (e.g., "USD → EUR")
- **Send amount:** Preset 3, Neutral 50, right-aligned (e.g., 1,000.00)
- **Received amount:** Preset 3, Lime 500 (e.g., 853.02)
- **Delete button:** Trash icon (Neutral 300), on hover turns Red 500
  - Focus: Lime 500 focus ring

### 11c. Log States

| State | Description |
|-------|-------------|
| **Default** | List with relative timestamps |
| **Empty** | "No conversions logged yet" (Preset 3, Neutral 200) |
| **Hover on row** | Row background lightens to Neutral 500, trash icon more visible |
| **Hover on trash** | Trash icon turns Red 500 |
| **After delete** | Row removed, count decrements, last item shows empty state |
| **Clear all** | Clears all entries immediately, shows empty state, badge shows 0 |
| **Time formatting** | <1h: minutes (20M, 50M). <24h: hours (1H, 4H). >24h: date (13 May, 11 May) |

---

## 12. Currency Picker Modal

Triggered by clicking either currency picker button in the converter.

### 12a. Modal Layout

- Overlay: Neutral 900 at 50% opacity backdrop
- Modal: centered, Neutral 700 background, rounded corners, max-width ~400px, max-height 80vh
- Header: "SELECT CURRENCY" (Preset 3 Bold, Neutral 50), close button (X) top right (Neutral 200, hover Neutral 50)
- Search input: full width, Neutral 600 background, Neutral 50 text, placeholder "Search currencies..." (Neutral 400), magnifying glass icon (Neutral 300)
- Currency list: scrollable, divided into sections

### 12b. Currency List

- **Section header:** "Popular" / "Other currencies" (Preset 5 Medium, Neutral 200, uppercase)
- **Each row:** Flag icon + currency code (Preset 3 Medium, Neutral 50) + currency name (Preset 4, Neutral 200)
- **Selected state:** Lime 500 checkmark or Neutral 500 background highlight
- **Hover:** Neutral 500 background
- **Focus:** Lime 500 focus ring

### 12c. Currency Picker States

| State | Description |
|-------|-------------|
| **Default** | Full list grouped by Popular and Other |
| **Search active** | Filtered list showing matches (by code or name), sections collapse if empty |
| **No results** | "No currencies match your search" (Preset 3, Neutral 200) |
| **Loading** | Brief spinner while fetching currency list from API |
| **Keyboard nav** | Arrow keys move through list, Enter selects, Escape closes modal |

---

## 13. Responsive Breakpoints

### Desktop (>1024px)

- Full layout as described
- Converter side-by-side
- Tab bar horizontal
- Stats row 4 columns
- Chart full width
- Converter amounts: Preset 1 (40px)

### Tablet (768–1024px)

- Same structure, narrower
- Converter still side-by-side, tighter spacing
- Tab bar horizontal
- Stats row 4 columns or 2×2 depending on width
- Converter amounts: Preset 1 Tablet (32px)

### Mobile (<768px)

- Converter stacks vertically (SEND → swap ↕ → RECEIVE)
- Tab bar becomes dropdown accordion with chevron
- Stats grid 2×2
- Chart full width, reduced height
- Lists single column, more vertical spacing
- Currency picker modal takes more screen real estate

---

## 14. Interaction States (All Elements)

| Element | Hover | Focus | Active/Click |
|---------|-------|-------|--------------|
| Currency picker button | Neutral 500 background | Lime 500 ring | Opens modal |
| Swap button | Lime 500 background, Neutral 900 icon | Lime 500 ring | Swaps currencies |
| Favorite button | Slight opacity change | Lime 500 ring | Toggles state |
| Log conversion button | Neutral 500 background | Lime 500 ring | Logs and switches tab |
| Tab (inactive) | Text to Neutral 100 | Lime 500 ring | Activates tab |
| Star (compare/favorites) | Scale up slightly | Lime 500 ring | Toggles favorite |
| Trash (log) | Red 500 | Lime 500 ring | Deletes entry |
| Time range pills | Neutral 500 background | Lime 500 ring | Changes chart range |
| Search input | N/A | Lime 500 ring | Accepts text |
| Currency row | Neutral 500 background | Lime 500 ring | Selects currency |
| Clear all | Text to Red 500 | Lime 500 ring | Clears log |

---

## 15. Accessibility Requirements

- All interactive elements keyboard navigable (Tab, Enter, Space, Arrow keys)
- Visible Lime 500 focus rings on all focusable elements
- Semantic HTML: `<nav>` for tabs, `<main>` for content, `<button>` for actions, `<input>` for amount
- ARIA labels on icon-only buttons (swap, favorite star, delete trash)
- Screen reader announcements for: amount updated, currency changed, pair favorited/unfavorited, conversion logged, entry deleted
- Color contrast: all text meets WCAG AA (Neutral 50 on Neutral 900, Lime 500 on Neutral 700/900)
- Tab panels use `role="tabpanel"` and `aria-labelledby`
