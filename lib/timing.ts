import type { Pastel } from "./games";

export type SplitStatus = "done" | "skipped";

/** A snapshot of one game as it was when the run started, so later edits to the list don't rewrite history. */
export interface RunGame {
  gameId: string;
  name: string;
  url: string;
  color: Pastel;
}

export interface Pause {
  start: number;
  end: number | null;
}

/** An in-progress run. Everything is wall-clock timestamps so a refresh resumes exactly. */
export interface ActiveRun {
  id: string;
  startedAt: number;
  games: RunGame[];
  marks: { at: number; status: SplitStatus }[];
  pauses: Pause[];
}

export interface Split {
  gameId: string;
  name: string;
  color: Pastel;
  ms: number;
  status: SplitStatus;
}

export interface Run {
  id: string;
  /** Local calendar day the run started on, YYYY-MM-DD. */
  day: string;
  categoryKey: string;
  startedAt: number;
  endedAt: number;
  pausedMs: number;
  totalMs: number;
  status: "complete" | "incomplete";
  official: boolean;
  splits: Split[];
}

export function localDay(ts: number): string {
  const d = new Date(ts);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** The "category" a run belongs to: the set of games, independent of order. */
export function categoryKey(gameIds: string[]): string {
  return [...gameIds].sort().join("|");
}

/** Milliseconds paused within [from, to]. */
export function pausedBetween(pauses: Pause[], from: number, to: number): number {
  let total = 0;
  for (const p of pauses) {
    const s = Math.max(p.start, from);
    const e = Math.min(p.end ?? to, to);
    if (e > s) total += e - s;
  }
  return total;
}

export function isPaused(run: ActiveRun): boolean {
  const last = run.pauses[run.pauses.length - 1];
  return !!last && last.end === null;
}

export function elapsed(run: ActiveRun, now: number): number {
  const end = isPaused(run) ? run.pauses[run.pauses.length - 1].start : now;
  return Math.max(0, end - run.startedAt - pausedBetween(run.pauses, run.startedAt, end));
}

/** Time spent on the current (unfinished) game so far. */
export function currentSplitElapsed(run: ActiveRun, now: number): number {
  const from = run.marks.length ? run.marks[run.marks.length - 1].at : run.startedAt;
  const end = isPaused(run) ? run.pauses[run.pauses.length - 1].start : now;
  return Math.max(0, end - from - pausedBetween(run.pauses, from, end));
}

export function splitsOf(run: ActiveRun): Split[] {
  let prev = run.startedAt;
  return run.marks.map((m, i) => {
    const g = run.games[i];
    const ms = Math.max(0, m.at - prev - pausedBetween(run.pauses, prev, m.at));
    prev = m.at;
    return { gameId: g.gameId, name: g.name, color: g.color, ms, status: m.status };
  });
}

export function finalize(run: ActiveRun, official: boolean): Run {
  const splits = splitsOf(run);
  const endedAt = run.marks[run.marks.length - 1]?.at ?? run.startedAt;
  return {
    id: run.id,
    day: localDay(run.startedAt),
    categoryKey: categoryKey(run.games.map((g) => g.gameId)),
    startedAt: run.startedAt,
    endedAt,
    pausedMs: pausedBetween(run.pauses, run.startedAt, endedAt),
    totalMs: splits.reduce((a, s) => a + s.ms, 0),
    status: splits.every((s) => s.status === "done") ? "complete" : "incomplete",
    official,
    splits,
  };
}

/** 1:02:03.4 / 2:03.4 / 0:07.4 */
export function formatMs(ms: number, tenths = true): string {
  const t = Math.max(0, Math.floor(ms / 100));
  const tenth = t % 10;
  const totalS = Math.floor(t / 10);
  const s = totalS % 60;
  const m = Math.floor(totalS / 60) % 60;
  const h = Math.floor(totalS / 3600);
  const ss = String(s).padStart(2, "0");
  const base = h > 0 ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
  return tenths ? `${base}.${tenth}` : base;
}

/** "+0:12.3" / "−0:04.0" */
export function formatDelta(ms: number): string {
  return `${ms < 0 ? "−" : "+"}${formatMs(Math.abs(ms))}`;
}
