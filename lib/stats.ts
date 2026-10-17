import { localDay, type Run } from "./timing";

const official = (runs: Run[]) => runs.filter((r) => r.official);

/** Best complete official run for a game set. */
export function personalBest(runs: Run[], catKey: string): Run | null {
  let best: Run | null = null;
  for (const r of official(runs)) {
    if (r.categoryKey !== catKey || r.status !== "complete") continue;
    if (!best || r.totalMs < best.totalMs) best = r;
  }
  return best;
}

/** Best "done" split per game across all official runs, optionally excluding one run. */
export function bestSplits(runs: Run[], excludeRunId?: string): Map<string, number> {
  const best = new Map<string, number>();
  for (const r of official(runs)) {
    if (r.id === excludeRunId) continue;
    for (const s of r.splits) {
      if (s.status !== "done") continue;
      const cur = best.get(s.gameId);
      if (cur === undefined || s.ms < cur) best.set(s.gameId, s.ms);
    }
  }
  return best;
}

/** Sum of best splits for the given games, or null if any game has no recorded split yet. */
export function sumOfBest(runs: Run[], gameIds: string[]): number | null {
  if (!gameIds.length) return null;
  const best = bestSplits(runs);
  let total = 0;
  for (const id of gameIds) {
    const b = best.get(id);
    if (b === undefined) return null;
    total += b;
  }
  return total;
}

function addDays(day: string, n: number): string {
  const [y, m, d] = day.split("-").map(Number);
  // Noon avoids DST edges when stepping whole days.
  return localDay(new Date(y, m - 1, d + n, 12).getTime());
}

/** Consecutive days with an official run, ending today (or yesterday if today isn't done yet). */
export function streak(runs: Run[], today: string): number {
  const days = new Set(official(runs).map((r) => r.day));
  let cursor = days.has(today) ? today : addDays(today, -1);
  let n = 0;
  while (days.has(cursor)) {
    n++;
    cursor = addDays(cursor, -1);
  }
  return n;
}

export function todaysRun(runs: Run[], today: string): Run | null {
  return official(runs).find((r) => r.day === today) ?? null;
}

/** The last `n` days (oldest first) with each day's official run, if any. */
export function lastDays(runs: Run[], today: string, n = 14): { day: string; run: Run | null }[] {
  const byDay = new Map(official(runs).map((r) => [r.day, r]));
  return Array.from({ length: n }, (_, i) => {
    const day = addDays(today, i - (n - 1));
    return { day, run: byDay.get(day) ?? null };
  });
}

export function history(runs: Run[]): Run[] {
  return official(runs).sort((a, b) => b.startedAt - a.startedAt);
}
