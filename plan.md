# Fix Remaining Layout/Visual Issues

## Context
Two issues remain unfixed:
1. Flag images in currency buttons show a black background instead of matching the button's bg
2. Font (JetBrains Mono) doesn't render correctly — numbers don't match the design

## Approach

### 1. Flag background (Option B — mix-blend-mode: screen)
- Flag WebP images have a solid black background (no alpha channel)
- **Why rounding corners won't work**: The black background fills the entire rectangular image area that the flag sits on top of. Rounding corners only trims the extreme corners of a rectangle — the black would still be visible everywhere except at the very edges.
- **How mix-blend-mode: screen works**: It makes pure black (#000) pixels transparent while keeping colored pixels visible. This removes the black background while leaving the flag colors intact.
- Use `mix-blend-mode: screen` on the `<img>` — this makes pure black (#000) transparent while keeping the flag colors visible
- Remove the `bg-white` wrapper and `rounded-[2px]` — just render the flag with `w-5 h-5 object-cover` + `mix-blend-mode-screen`

### 2. Font not rendering — ROOT CAUSE FOUND
- **Problem**: The `@theme` block has `--font-family-mono`, but Tailwind v4 uses `--font-mono` as the CSS variable for the `font-mono` utility class
- The `font-mono` utility references `var(--font-mono)`, not `var(--font-family-mono)`
- Our custom colors (like `--color-neutral-50`) work fine because their names match
- **Fix**: Change `--font-family-mono: 'JetBrains Mono', monospace;` to `--font-mono: 'JetBrains Mono', monospace;` in `src/index.css`
- Also keep `format('truetype')` (revert from `truetype-variations`) for widest browser support

## Files to modify
- `src/components/converter.tsx` — flag wrappers (2 occurrences)
- `src/index.css` — font-face format

## Verification
- Check that flags render with proper background matching the button
- Check that numbers appear in JetBrains Mono (should match design's font rendering)
