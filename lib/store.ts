"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DATA_VERSION, STORAGE_KEY } from "./config";
import { PASTELS, resolveGames, type Game } from "./games";
import { bestSplits, personalBest } from "./stats";
import { finalize, isPaused, localDay, type ActiveRun, type Run, type SplitStatus } from "./timing";

export interface RunResult {
  run: Run;
  practice: boolean;
  prevPbMs: number | null;
  newPb: boolean;
  /** Games whose split beat their previous best. */
  goldGameIds: string[];
  /** The run as it was just before the final split, so the finish can be undone. */
  snapshot: ActiveRun & { practice: boolean };
}

export interface Data {
  version: number;
  onboarded: boolean;
  games: Game[];
  runs: Run[];
  activeRun: (ActiveRun & { practice: boolean }) | null;
  lastResult: RunResult | null;
  ui: { backupNudgeDismissed: boolean };
}

interface Actions {
  setOnboarded: (v: boolean) => void;
  togglePreset: (presetKey: string) => void;
  addCustom: (name: string, url: string) => void;
  removeGame: (id: string) => void;
  moveGame: (from: number, to: number) => void;
  startRun: (now?: number) => void;
  mark: (status: SplitStatus, now: number) => void;
  undo: () => void;
  undoFinish: () => void;
  pause: (now: number) => void;
  resume: (now: number) => void;
  resetRun: () => void;
  dismissResult: () => void;
  dismissBackupNudge: () => void;
  replaceAll: (data: Data) => void;
  wipe: () => void;
}

export const initialData = (): Data => ({
  version: DATA_VERSION,
  onboarded: false,
  games: [],
  runs: [],
  activeRun: null,
  lastResult: null,
  ui: { backupNudgeDismissed: false },
});

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

export const useStore = create<Data & Actions>()(
  persist(
    (set, get) => ({
      ...initialData(),

      setOnboarded: (v) => set({ onboarded: v }),

      togglePreset: (presetKey) =>
        set(({ games }) => {
          const existing = games.find((g) => g.kind === "preset" && g.presetKey === presetKey);
          if (existing) return { games: games.filter((g) => g !== existing) };
          return { games: [...games, { id: presetKey, kind: "preset", presetKey }] };
        }),

      addCustom: (name, url) =>
        set(({ games }) => {
          const customCount = games.filter((g) => g.kind === "custom").length;
          const color = PASTELS[(customCount + 3) % PASTELS.length];
          return { games: [...games, { id: `custom-${uid()}`, kind: "custom", name, url, color }] };
        }),

      removeGame: (id) => set(({ games }) => ({ games: games.filter((g) => g.id !== id) })),

      moveGame: (from, to) =>
        set(({ games }) => {
          if (to < 0 || to >= games.length) return {};
          const next = [...games];
          const [g] = next.splice(from, 1);
          next.splice(to, 0, g);
          return { games: next };
        }),

      startRun: (now = Date.now()) => {
        const { games, runs } = get();
        const resolved = resolveGames(games);
        if (!resolved.length) return;
        const doneToday = runs.some((r) => r.official && r.day === localDay(now));
        set({
          lastResult: null,
          activeRun: {
            id: uid(),
            startedAt: now,
            games: resolved.map((g) => ({ gameId: g.id, name: g.name, url: g.url, color: g.color })),
            marks: [],
            pauses: [],
            practice: doneToday,
          },
        });
      },

      mark: (status, now) => {
        const { activeRun, runs } = get();
        if (!activeRun || isPaused(activeRun)) return;
        const next = { ...activeRun, marks: [...activeRun.marks, { at: now, status }] };
        if (next.marks.length < next.games.length) {
          set({ activeRun: next });
          return;
        }
        const run = finalize(next, !next.practice);
        const prevPb = personalBest(runs, run.categoryKey);
        const prevBest = bestSplits(runs);
        const goldGameIds = run.splits
          .filter((s) => s.status === "done" && prevBest.has(s.gameId) && s.ms < prevBest.get(s.gameId)!)
          .map((s) => s.gameId);
        const newPb = run.status === "complete" && !!prevPb && run.totalMs < prevPb.totalMs;
        set({
          activeRun: null,
          runs: next.practice ? runs : [...runs, run],
          lastResult: {
            run,
            practice: next.practice,
            prevPbMs: prevPb?.totalMs ?? null,
            newPb,
            goldGameIds,
            snapshot: activeRun,
          },
        });
      },

      undo: () =>
        set(({ activeRun }) =>
          activeRun && activeRun.marks.length
            ? { activeRun: { ...activeRun, marks: activeRun.marks.slice(0, -1) } }
            : {},
        ),

      undoFinish: () =>
        set(({ lastResult, runs }) =>
          lastResult
            ? {
                activeRun: lastResult.snapshot,
                runs: runs.filter((r) => r.id !== lastResult.run.id),
                lastResult: null,
              }
            : {},
        ),

      pause: (now) =>
        set(({ activeRun }) =>
          activeRun && !isPaused(activeRun)
            ? { activeRun: { ...activeRun, pauses: [...activeRun.pauses, { start: now, end: null }] } }
            : {},
        ),

      resume: (now) =>
        set(({ activeRun }) => {
          if (!activeRun || !isPaused(activeRun)) return {};
          const pauses = [...activeRun.pauses];
          pauses[pauses.length - 1] = { ...pauses[pauses.length - 1], end: now };
          return { activeRun: { ...activeRun, pauses } };
        }),

      resetRun: () => set({ activeRun: null }),
      dismissResult: () => set({ lastResult: null }),
      dismissBackupNudge: () => set(({ ui }) => ({ ui: { ...ui, backupNudgeDismissed: true } })),
      replaceAll: (data) => set({ ...data }),
      wipe: () => set({ ...initialData() }),
    }),
    {
      name: STORAGE_KEY,
      version: DATA_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ version, onboarded, games, runs, activeRun, lastResult, ui }) => ({
        version,
        onboarded,
        games,
        runs,
        activeRun,
        lastResult,
        ui,
      }),
    },
  ),
);

const subscribeHydration = (cb: () => void) => useStore.persist.onFinishHydration(cb);

/** False during prerender and until localStorage has been read, so pages don't flash the wrong state. */
export function useHydrated() {
  return useSyncExternalStore(
    subscribeHydration,
    () => useStore.persist.hasHydrated(),
    () => false,
  );
}

export function snapshotData(): Data {
  const { version, onboarded, games, runs, activeRun, lastResult, ui } = useStore.getState();
  return { version, onboarded, games, runs, activeRun, lastResult, ui };
}
