"use client";

import { Star, Undo2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { BackupNudge } from "@/components/BackupNudge";
import { Digits } from "@/components/Digits";
import { Mascot } from "@/components/Mascot";
import { SplitStrip } from "@/components/SplitStrip";
import { celebrate } from "@/lib/celebrate";
import { useStore } from "@/lib/store";
import { S } from "@/lib/strings";
import { formatDelta, formatMs } from "@/lib/timing";

export function ResultPanel() {
  const result = useStore((st) => st.lastResult)!;
  const runsCount = useStore((st) => st.runs.length);
  const nudgeDismissed = useStore((st) => st.ui.backupNudgeDismissed);
  const { dismissResult, undoFinish } = useStore.getState();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { run, newPb, prevPbMs, goldGameIds, practice } = result;
  const complete = run.status === "complete";

  useEffect(() => {
    headingRef.current?.focus();
    if (newPb) celebrate(true);
    else if (goldGameIds.length) celebrate(false);
  }, [run.id, newPb, goldGameIds.length]);

  const title = newPb ? S.result.titlePb : complete ? S.result.titleDone : S.result.titleIncomplete;

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 pt-6 pb-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <Mascot mood={complete ? "cheer" : "happy"} className="pop-in w-28" />
        <h1 ref={headingRef} tabIndex={-1} className="text-[2.2rem] leading-tight font-bold outline-none">
          {title}
        </h1>
        {practice && <p className="font-bold">{S.dashboard.practiceNote}</p>}
      </div>

      <section className={`sticker p-5 text-center ${newPb ? "bg-gold" : "bg-white"}`}>
        <p className="font-display text-[clamp(3rem,15vw,4.5rem)] leading-none font-bold">
          <span className="sr-only">{S.result.total}: </span>
          <Digits>{formatMs(run.totalMs)}</Digits>
        </p>
        {complete && prevPbMs !== null && (
          <p className="font-display mt-2 text-lg font-semibold">
            {S.result.total} · <Digits>{formatDelta(run.totalMs - prevPbMs)}</Digits> {S.result.vsPb}
          </p>
        )}
        {complete && prevPbMs === null && !practice && <p className="mt-2 font-semibold">{S.result.firstPb}</p>}
        {!complete && <p className="mt-2 font-semibold">{S.result.incompleteNote}</p>}
      </section>

      <SplitStrip splits={run.splits} gold={goldGameIds} showLabels height="h-12" />

      <ol className="flex flex-col gap-2">
        {run.splits.map((s, i) => {
          const isGold = goldGameIds.includes(s.gameId) && s.status === "done";
          return (
            <li key={i} className={`flex items-center justify-between gap-3 rounded-[var(--r-sm)] border-[3px] border-ink px-3 py-2 ${isGold ? "bg-gold" : "bg-white"}`}>
              <span className="flex min-w-0 items-center gap-2 font-semibold">
                <span className={`size-4 shrink-0 rounded-full border-2 border-ink ${s.status === "skipped" ? "hatch" : `bg-pastel-${s.color}`}`} aria-hidden />
                <span className="truncate">{s.name}</span>
                {isGold && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ink px-2 py-0.5 text-xs font-bold text-cream">
                    <Star className="size-3 fill-current" strokeWidth={0} aria-hidden />
                    {S.result.goldSplit}
                  </span>
                )}
              </span>
              <span className="font-display font-semibold">{s.status === "skipped" ? "skipped" : <Digits>{formatMs(s.ms)}</Digits>}</span>
            </li>
          );
        })}
      </ol>

      {runsCount === 1 && !nudgeDismissed && !practice && <BackupNudge />}

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" className="btn btn-primary min-h-14 text-lg" onClick={dismissResult}>
          {S.result.back}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={undoFinish}>
          <Undo2 className="size-4" strokeWidth={2.75} aria-hidden />
          {S.result.undoFinish}
        </button>
      </div>
    </main>
  );
}
