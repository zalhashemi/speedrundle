"use client";

import { ExternalLink, Pause, Play, RotateCcw, SkipForward, Star, Undo2 } from "lucide-react";
import { Digits } from "@/components/Digits";
import { useMemo, useState } from "react";
import { GameArt } from "@/components/illustrations";
import { SplitStrip, type StripSplit } from "@/components/SplitStrip";
import { presetByKey } from "@/lib/games";
import { openGame } from "@/lib/openGame";
import { bestSplits } from "@/lib/stats";
import { useStore } from "@/lib/store";
import { S } from "@/lib/strings";
import { currentSplitElapsed, elapsed, formatDelta, formatMs, isPaused, splitsOf } from "@/lib/timing";
import { useNow } from "@/lib/useNow";

export function RunPanel() {
  const run = useStore((st) => st.activeRun)!;
  const runs = useStore((st) => st.runs);
  const { mark, undo, pause, resume, resetRun } = useStore.getState();
  const paused = isPaused(run);
  const now = useNow(!paused);
  const [confirmReset, setConfirmReset] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const best = useMemo(() => bestSplits(runs), [runs]);
  const done = splitsOf(run);
  const idx = run.marks.length;
  const current = run.games[idx];
  const next = run.games[idx + 1] ?? null;
  const currentMs = currentSplitElapsed(run, now);
  const total = elapsed(run, now);
  const currentBest = best.get(current.gameId);

  const strip: StripSplit[] = run.games.map((g, i) =>
    i < idx
      ? { ...done[i] }
      : { gameId: g.gameId, name: g.name, color: g.color, ms: i === idx ? currentMs : 0, status: i === idx ? "current" : "pending" },
  );

  function open(url: string) {
    setBlocked(!openGame(url));
  }

  function advance(status: "done" | "skipped") {
    if (next) open(next.url);
    mark(status, Date.now());
  }

  const presetKey = presetByKey(current.gameId)?.key;

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-5 px-4 pt-5 pb-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-lg font-semibold">
          {S.run.of(idx + 1, run.games.length)}
          {run.practice && <span className="ml-2 rounded-full border-2 border-ink bg-white px-2 py-0.5 text-sm">{S.run.practice}</span>}
        </p>
        <button type="button" className="btn btn-sm" onClick={() => (paused ? resume(Date.now()) : pause(Date.now()))}>
          {paused ? <Play className="size-4 fill-current" strokeWidth={3} aria-hidden /> : <Pause className="size-4 fill-current" strokeWidth={3} aria-hidden />}
          {paused ? S.run.resume : S.run.pause}
        </button>
      </div>

      <div className="text-center">
        <p
          className={`font-display text-[clamp(3.5rem,18vw,5.5rem)] leading-none font-bold tabular ${paused ? "tick" : ""}`}
          aria-live="off"
          role="timer"
        >
          <Digits>{formatMs(total)}</Digits>
        </p>
        {paused && <p className="font-display mt-1 text-lg font-semibold">{S.run.paused}</p>}
      </div>

      <section className={`sticker overflow-hidden bg-pastel-${current.color}`} aria-labelledby="now-playing">
        <div className="flex items-center gap-4 p-4">
          <div className="size-20 shrink-0 rounded-[14px] border-[3px] border-ink bg-white/70">
            <GameArt presetKey={presetKey} name={current.name} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 id="now-playing" className="truncate text-[1.7rem] leading-tight font-bold">
              <span className="sr-only">{S.run.playing}: </span>
              {current.name}
            </h1>
            <p className="font-display text-lg font-semibold tabular">
              <Digits>{formatMs(currentMs)}</Digits>
              {currentBest !== undefined && (
                <span className="ml-2 text-base font-medium">
                  best <Digits>{formatMs(currentBest)}</Digits>
                </span>
              )}
            </p>
          </div>
        </div>
        <p className="border-t-[3px] border-ink bg-white/60 px-4 py-2 text-[0.95rem] font-semibold">{S.run.honest}</p>
      </section>

      <button type="button" className="btn btn-primary min-h-16 w-full text-xl" onClick={() => advance("done")} disabled={paused}>
        {S.run.done(next?.name ?? null)}
        {next && <span className="sr-only">{S.common.opensNewTab}</span>}
      </button>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" className="btn" onClick={() => open(current.url)}>
          <ExternalLink className="size-5" strokeWidth={2.75} aria-hidden />
          {S.run.reopen}
        </button>
        <button type="button" className="btn" onClick={() => advance("skipped")} disabled={paused}>
          <SkipForward className="size-5" strokeWidth={2.75} aria-hidden />
          {S.run.skip}
        </button>
      </div>

      {blocked && (
        <p role="alert" className="rounded-[var(--r-sm)] border-[3px] border-danger bg-danger-soft px-4 py-2 font-bold text-danger">
          {S.run.popupBlocked}
        </p>
      )}

      <SplitStrip splits={strip} proportional={false} showLabels height="h-11" />

      {done.length > 0 && (
        <ol className="flex flex-col gap-1">
          {done.map((s, i) => {
            const b = best.get(s.gameId);
            return (
              <li key={i} className="flex items-baseline justify-between gap-3 border-b-2 border-dashed border-ink/25 py-1.5">
                <span className="flex items-center gap-2 font-semibold">
                  <span className={`size-3.5 rounded-full border-2 border-ink ${s.status === "skipped" ? "hatch" : `bg-pastel-${s.color}`}`} aria-hidden />
                  {s.name}
                </span>
                <span className="font-display tabular">
                  {s.status === "skipped" ? (
                    "skipped"
                  ) : (
                    <>
                      <Digits>{formatMs(s.ms)}</Digits>
                      {b !== undefined &&
                        (s.ms < b ? (
                          <span className="ml-2 inline-flex items-center gap-1 rounded-full border-2 border-ink bg-gold px-1.5 text-sm font-semibold">
                            <Star className="size-3 fill-ink" strokeWidth={0} aria-hidden />
                            <Digits>{formatDelta(s.ms - b)}</Digits>
                          </span>
                        ) : (
                          <span className="ml-2 text-sm text-ink-soft">
                            <Digits>{formatDelta(s.ms - b)}</Digits>
                          </span>
                        ))}
                    </>
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
        <button type="button" className="btn btn-ghost btn-sm" onClick={undo} disabled={idx === 0}>
          <Undo2 className="size-4" strokeWidth={2.75} aria-hidden />
          {S.run.undo}
        </button>
        {!confirmReset && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmReset(true)}>
            <RotateCcw className="size-4" strokeWidth={2.75} aria-hidden />
            {S.run.reset}
          </button>
        )}
      </div>
      {confirmReset && (
        <div role="alertdialog" aria-labelledby="reset-q" className="rise-in sticker flex flex-col gap-3 bg-danger-soft p-4">
          <p id="reset-q" className="font-bold">
            {S.run.resetConfirm}
          </p>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn btn-danger btn-sm" onClick={resetRun} autoFocus>
              {S.run.resetYes}
            </button>
            <button type="button" className="btn btn-sm" onClick={() => setConfirmReset(false)}>
              {S.run.resetNo}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
