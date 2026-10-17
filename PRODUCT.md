# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Next.js (App Router) with `output: 'export'` → static files hosted on Netlify. No backend, no accounts, no database. All user data in `localStorage`.

## Users
The owner and friends they share the link with. People who already play several daily web puzzles (Wordle, Connections, NYT Mini…) every morning, mostly on a phone, sometimes on a laptop. Each person customises their own game list.

## Product Purpose
Speedrundle turns a daily puzzle routine into a speedrun: pick your games once, then one button opens each game in a new tab and times every split. Success = a person runs their dailies through Speedrundle every day, beats their personal bests, and keeps a streak.

## Positioning
It does not host or copy any puzzle. It is a launcher + stopwatch + record book for puzzles that live elsewhere, borrowing the speedrunning vocabulary (splits, PB, sum of best, categories).

## Operating Context
- The person switches between the Speedrundle tab and the game tab repeatedly. The site can't see the games, so the person always taps "Done" themselves.
- Phone-first, often one-handed, often half-asleep in the morning.
- Day boundary is local midnight. One official run per day.

## Capabilities and Constraints
- Game presets: Wordle, Connections, NYT Crossword, NYT Mini, NYT Spelling Bee, Washington Post Crossword, Globle, Bandle, Spotle. Moviedle dropped (domain now spam). "Other" adds any http/https link.
- Run controls: Done/next, reopen current game, skip, pause, undo, reset.
- Stats: streak, PB per game set, per-game best splits, sum of best, 14-day history.
- Export/import JSON is the only backup.
- Link out only. Never embed, scrape, or use the games' logos/artwork.

## Brand Commitments
- Name "Speedrundle" (kept in one config constant).
- Light mode only. User-pinned palette "candy shop": cream #FFF8EE, plum #2B1B3D text, pastel mint / peach / lavender / butter / baby blue / pink; 3px plum borders, 4px offset hard shadows. Fredoka display, Nunito body. An original mascot, confetti on a PB, no sound.
- Footer disclaimer: not affiliated with any of the games or their owners.

## Evidence on Hand
None. No users, testimonials or stats exist, so don't invent any.

## Product Principles
1. Never trap the runner: every action can be undone, reopened, paused or reset.
2. Honest about limits: say plainly that the site can't see the game.
3. Zero friction: no sign-up, three onboarding steps at most, one big button.
4. Your data is yours: it stays on your device and can be exported.

## Accessibility & Inclusion
WCAG AA contrast. Drag reordering has a keyboard/button alternative. Respect prefers-reduced-motion.
