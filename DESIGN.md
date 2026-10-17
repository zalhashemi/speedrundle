---
name: Speedrundle
description: Your morning puzzles as a speedrun you can hold, drawn as a strip of candy-coloured split blocks.
colors:
  cream: "#fff8ee"
  cream-deep: "#fbecd6"
  ink: "#2b1b3d"
  ink-soft: "#5b4670"
  mint: "#c8f0dc"
  peach: "#ffd9c2"
  lavender: "#e2d7ff"
  butter: "#fff0a8"
  baby-blue: "#cde7ff"
  pink: "#ffd3e6"
  gold: "#ffc93c"
  gold-deep: "#f2a900"
  danger: "#b4233c"
  danger-soft: "#ffd6dc"
  focus-violet: "#6a3df0"
  white: "#ffffff"
typography:
  timer:
    fontFamily: "Fredoka, ui-rounded, system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 18vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 1
  display:
    fontFamily: "Fredoka, ui-rounded, system-ui, sans-serif"
    fontSize: "2.2rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Fredoka, ui-rounded, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Fredoka, ui-rounded, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
  button:
    fontFamily: "Fredoka, ui-rounded, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.1
  body:
    fontFamily: "Nunito, ui-rounded, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Nunito, ui-rounded, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 700
    lineHeight: 1.4
  table-numeral:
    fontFamily: "Nunito, ui-rounded, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 700
    fontFeature: "tnum"
rounded:
  sm: "12px"
  md: "18px"
  lg: "28px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "32px"
components:
  button:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0.6rem 1.25rem"
    height: "48px"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0.6rem 1.25rem"
    height: "48px"
  button-danger:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    rounded: "{rounded.pill}"
    padding: "0.6rem 1.25rem"
    height: "48px"
  button-ghost:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.4rem 0.9rem"
    height: "40px"
  button-small:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.4rem 0.9rem"
    height: "40px"
  button-icon:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    width: "44px"
    height: "44px"
  start-button:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.lg}"
    padding: "20px 24px"
    height: "112px"
  sticker-card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "20px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0.6rem 0.9rem"
    height: "48px"
  split-strip:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.pill}"
    height: "48px"
  gold-chip:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 8px"
---

# Design System: Speedrundle

## Overview

**Creative North Star: "The Candy Shop Split Strip"**

Speedrundle is a sticker sheet on a cream counter. Every surface is a die-cut sticker: a white or pastel slab with a 3px plum outline and a hard 4px plum shadow offset down and to the right, which presses flat when tapped. The ground is warm cream with a faint 22px plum dot grid, so the page reads as paper rather than screen. Six candy pastels give each game its own colour, plum carries all text and every outline, and gold is held back for one job: marking a personal best.

The signature is the split strip. A run is drawn as a pill of coloured blocks, one per game, separated by plum rules. The same strip appears as live run progress (equal blocks), as the result (blocks sized by time, gold for best splits, hatched for skipped), on the dashboard as the latest run, and stacked vertically as the bars of the 14-day chart. New surfaces that show a run show it this way.

The world is playful but phone-first and morning-tired: big round tap targets (48px minimum), one dominant action per screen, rounded type, and an original stopwatch mascot. It is light only. It refuses the grey stopwatch app and the stat-tile SaaS dashboard.

**Key Characteristics:**
- Cream dotted ground, plum ink, six game pastels, gold for bests only.
- 3px plum outlines and 4px hard offset shadows that press flat on tap.
- Generous radius: 12px fields, 18px stickers, 28px hero button, pills for buttons and the strip.
- Fredoka for display and numerals (through equal-width digit boxes), Nunito for body and tables.
- The split strip is the one shape every run takes.
- Light only; reduced motion turns off all decorative movement.

## Colors

A candy-shop palette: warm cream paper, deep plum ink, six soft pastels and one saturated gold.

### Primary
- **Midnight Plum** (ink): all text, every outline and divider, sticker shadows, the primary button fill and the hero start button. Also the gap colour between stacked chart segments.
- **Trophy Gold** (gold): personal bests and best splits only. The result sticker turns gold on a new PB; best-split rows, chips and strip blocks fill gold with a plum star.
- **Deep Marigold** (gold-deep): the offset shadow under primary (plum) buttons and the selected chart bar, so the dark button still casts a visible shadow.

### Secondary
- **Game pastels** (mint, peach, lavender, butter, baby-blue, pink): one per game, assigned in the game list and reused everywhere that game appears: card art panels, run-mode "now playing" sticker, strip blocks, chart segments, dot markers. Mint and lavender also head tables; butter and baby-blue fill feature stickers (streak, add-game form, backup nudge).

### Tertiary
- **Alarm Crimson** (danger) on **Blush Alarm** (danger-soft): destructive buttons, invalid inputs (crimson border plus a 3px blush halo), the reset confirm and the erase-data sticker.
- **Electric Violet** (focus-violet): the 3px focus outline at 3px offset on every focusable element.

### Neutral
- **Cream Paper** (cream): page ground, carrying a 22px dot grid of plum at 7% opacity. Also text on plum.
- **Toasted Cream** (cream-deep): the base under hatched (skipped) splits and the scrollbar track.
- **Dusk Plum** (ink-soft): secondary text, hints, placeholders, inactive day labels. At least 5.35:1 on every pastel and on gold.
- **White** (white): default sticker, button, input and table fill; pending strip blocks.

### Named Rules
**The Gold Means Best Rule.** Gold (#ffc93c) marks a personal best or a best split and nothing else. It is never a game colour, a decoration, or a generic highlight.

**The Never Colour Alone Rule.** The pastels are too close to identify games by hue and fail a categorical-chart check. Game identity is always carried by something else too: plum separators between blocks, a named readout under the chart, a labelled table row, a named dot list, and diagonal hatching for skipped splits.

**The Dusk Plum Floor Rule.** Secondary text is Dusk Plum (#5b4670) or darker, never a lighter tint, so it holds AA on cream, every pastel and gold.

## Typography

**Display Font:** Fredoka (with ui-rounded, system-ui fallback), weights 400 to 700
**Body Font:** Nunito (with ui-rounded, system-ui fallback)

**Character:** Two rounded faces. Fredoka is the chunky candy voice for headings, buttons and every time readout; Nunito is the calm, legible voice for sentences, labels and tables.

### Hierarchy
- **Timer** (700, clamp(3.5rem, 18vw, 5.5rem), 1): the live run clock; the result total uses clamp(3rem, 15vw, 4.5rem). Blinks while paused.
- **Display** (700, 2rem to 3.2rem by page, about 1.25): page h1s (result title, onboarding steps, now-playing game name at 1.7rem). Balanced wrapping, -0.01em tracking.
- **Headline** (600, 1.5rem): dashboard section headings (Last 14 days, Best splits, History).
- **Title** (600, 1.125rem to 1.25rem): today status line, sub-sections, card names (1.05rem), sticker-row time readouts.
- **Body** (400, 1.0625rem, 1.5): sentences and help text; long copy capped at 44ch to 46ch.
- **Label** (700, 0.8rem to 0.95rem): stat labels, access badges, table headers, chip text. Sentence case.
- **Table numeral** (Nunito, 700 for bests, 400 for latest, tabular-nums): times inside tables.

### Named Rules
**The Equal Digit Rule.** Fredoka has no tabular figures. Every Fredoka time readout (timer, strip labels, result rows, stat stickers, chart readout) renders through the digit-box treatment: each digit in a 0.62em centred box, separators at natural width, so ticking numbers never jitter. Do not rely on `tabular-nums` with Fredoka; it does nothing.

**The Table Voice Rule.** Columns of times in tables use Nunito with tabular-nums, not Fredoka, so they align as a column.

## Layout

Single-column, phone-first. Pages sit in a centred column with 16px side gutters: run and result at 36rem max, settings and about at 42rem, onboarding and the game picker at 48rem, the dashboard at 48rem widening to 64rem on large screens, where it splits into two columns (start area 1.35fr beside records 1fr, then chart beside splits table).

Rhythm is a 4px base used mostly at 12px (the dominant gap), with 8px inside rows, 16px between related blocks, 24px between result sections and 32px between dashboard sections. Stickers pad 16px to 20px; table cells 16px by 8 to 10px.

Each screen has one dominant action: the start button on the dashboard, the full-width Done button (64px tall) in run mode, the back button on results. Onboarding keeps its continue bar sticky at the bottom on cream at 95% with a plum top rule.

## Elevation & Depth

Depth is physical, not ambient. Surfaces are flat colour with a hard, unblurred plum shadow offset equally right and down, like a sticker lifted off the sheet. There are no soft or blurred shadows anywhere. Shadows grow by 1px on hover (the element shifts up-left 1px) and collapse to zero on press (the element translates into its shadow), so a tap feels like pressing a sticker flat.

### Shadow Vocabulary
- **Sticker lift** (`box-shadow: 4px 4px 0 #2b1b3d`): default for buttons, stickers, the split strip, unselected game cards.
- **Small lift** (`box-shadow: 3px 3px 0 #2b1b3d`): small and icon buttons.
- **Selected lift** (`box-shadow: 6px 6px 0 #2b1b3d`): a selected game card.
- **Gold lift** (`box-shadow: 4px 4px 0 #f2a900`): primary plum buttons; 6px on the hero start button; 3px on the selected chart bar.
- **Danger lift** (`box-shadow: 4px 4px 0 #b4233c`): danger buttons.
- **Pressed** (`box-shadow: 0 0 0`): active state of every lifted element.

### Named Rules
**The Press Flat Rule.** Anything with a lift is tappable or is a record sticker; on press it translates by the full lift distance and its shadow drops to zero. Disabled controls keep their shadow but sit at 50% opacity and do not move.

## Shapes

Everything is rounded and outlined. 3px plum borders on stickers, buttons, inputs and the strip; 2px on small dots and chips; 2.5px on chart bars. Radii: 12px for fields, readouts and list rows; 18px for stickers and game cards; 28px for the hero start button; full pills for buttons, chips, today markers and the split strip. Internal dividers are plum rules (3px under table heads and between strip blocks) or 2px dashed plum at 20 to 25% for row separators. Skipped splits are hatched with 2px plum diagonal stripes at 28% over toasted cream. Game markers are small pastel circles with a 2px plum ring. The streak sticker sits tilted -2 degrees; the mascot tilts 6 degrees.

## Components

### Buttons
Tactile and chunky, like pressing a sticker.
- **Shape:** full pill (999px), 3px plum border, minimum 48px tall.
- **Default:** white fill, plum Fredoka 600 text, sticker lift.
- **Primary:** plum fill, cream text, gold lift. Used at 56px to 64px tall for the one main action.
- **Hover / Focus:** shifts up-left 1px with a 1px larger shadow over 140ms on the out curve; focus is the 3px Electric Violet outline at 3px offset.
- **Active:** presses into its shadow over 40ms.
- **Ghost:** no border, no shadow, underlined; hover shows a 6% plum wash. For undo, reset and other quiet escapes.
- **Danger:** blush fill, crimson text, border and shadow.
- **Small / Icon:** 40px small, 44px square icon, 3px lift.

### Hero Start Button
The dashboard's one big action: a 112px-tall plum slab with a 28px radius, 6px gold lift, a 64px gold play disc ringed in cream, a two-line Fredoka label (1.9rem, 2.3rem from small screens up) with a cream subline, and the mascot tucked in at the right on wider screens.

### Cards / Stickers
- **Corner Style:** 18px.
- **Background:** white for records and tables; a pastel or butter, baby-blue or blush when the sticker has a role (streak, add-game form, backup nudge, danger zone); gold only for a new-PB result.
- **Shadow Strategy:** sticker lift.
- **Border:** 3px plum.
- **Internal Padding:** 16px to 20px.

### Game Card
A selectable sticker button: a 4:3 pastel art panel over a 3px plum rule, then the Fredoka name, a Dusk Plum blurb and an optional access badge with an icon. Selected cards fill with their pastel, lift to 6px and pop in a 36px gold check disc at the top right.

### Inputs / Fields
- **Style:** white, 3px plum border, 12px radius, 48px tall, Dusk Plum placeholder.
- **Focus:** the global violet outline.
- **Error:** crimson border plus a 3px blush halo.

### Navigation
A slim top bar: the wordmark (stopwatch glyph plus Fredoka 700 at 1.45rem, the second half of the name in violet) on the left, small pill buttons on the right; the edit-games label collapses to icon-only on phones. Icons are Lucide at 2.5 to 2.75 stroke, 16px to 20px.

### Split Strip (signature)
A full-width pill (48px tall) with a 3px plum border and sticker lift, holding one block per game separated by 3px plum rules. Blocks grow by time in results and history, equally in live progress. Fills: the game pastel when done, white when pending, hatched when skipped, gold with a plum star for a best split; the current block pulses. Blocks wide enough (48px or more) carry a Fredoka time label. The strip has a spoken label listing each game and its time. Vertically stacked, the same blocks form the 14-day chart bars, with a dashed plum PB line and a plum PB pill.

### Gold Chip
A plum-ringed gold pill with a plum star and the time or delta, marking a best split in run lists, the splits table and the history table. On white rows, a plum pill with cream text and a star does the same job.

### Motion
Out curve `cubic-bezier(0.16, 1, 0.3, 1)` for state changes and rise-in (520ms, 14px up); pop curve `cubic-bezier(0.34, 1.56, 0.64, 1)` for pop-in (420ms from 60% scale). The onboarding mascot wobbles ±3 degrees over 2.6s; the paused timer blinks once a second. Confetti in the six pastels plus gold fires on a new PB (two side bursts) or a best split (one burst). Reduced motion turns off pop-in, rise-in, wobble, tick, the strip pulse, button transitions and confetti. No sound.

## Do's and Don'ts

### Do:
- **Do** give every tappable surface or record sticker the 3px plum outline and a hard offset shadow (4px plum by default, gold under plum buttons) that presses flat on tap.
- **Do** draw any run as the split strip: plum-separated blocks in game pastels, gold for best splits, hatch for skipped.
- **Do** pair every use of a game pastel with a name, a label, a plum separator or hatching.
- **Do** render Fredoka times through the 0.62em equal digit boxes, and table times in Nunito with tabular-nums.
- **Do** keep secondary text at Dusk Plum (#5b4670) or darker.
- **Do** keep tap targets at 44px or more, 48px for standard buttons and fields.
- **Do** gate every decorative animation and confetti behind prefers-reduced-motion.

### Don't:
- **Don't** use gold for anything but personal bests and best splits.
- **Don't** identify a game by pastel colour alone.
- **Don't** use blurred or ambient shadows; depth here is hard and offset.
- **Don't** add a dark mode; the system is light only.
- **Don't** set Fredoka numerals that change in place without equal digit boxes.
- **Don't** use the games' logos or artwork; game art is original illustration on the game's pastel.
