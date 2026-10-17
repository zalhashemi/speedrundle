"use client";

import { useState } from "react";
import { Digits } from "@/components/Digits";
import { S } from "@/lib/strings";
import { formatMs, type Run } from "@/lib/timing";

interface Props {
  days: { day: string; run: Run | null }[];
  today: string;
  pbMs: number | null;
}

const dayLabel = (day: string, opts: Intl.DateTimeFormatOptions) => {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, opts);
};

/**
 * 14 daily bars; height = total time. Each bar is stacked by game, separated by plum gaps.
 * Pastels are too close to identify games by colour alone, so the readout below names every split.
 */
export function HistoryChart({ days, today, pbMs }: Props) {
  const withRuns = days.filter((d) => d.run);
  const lastIdx = days.findLastIndex((d) => d.run);
  const [sel, setSel] = useState<number | null>(null);
  const active = sel ?? (lastIdx >= 0 ? lastIdx : null);
  const max = Math.max(1, ...withRuns.map((d) => d.run!.totalMs), pbMs ?? 0);
  const selected = active !== null ? days[active] : null;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        {pbMs !== null && withRuns.length > 0 && (
          <div className="pointer-events-none absolute inset-x-0 z-10 border-t-[2.5px] border-dashed border-ink" style={{ bottom: `calc(${(pbMs / max) * 100}% * 0.8 + 28px)` }} aria-hidden>
            <span className="absolute -top-2.5 right-0 rounded-full bg-ink px-2 text-xs font-bold text-cream">PB</span>
          </div>
        )}
        <div className="flex h-48 items-end gap-1 pr-10 sm:gap-2" role="group" aria-label={S.dashboard.chart}>
          {days.map((d, i) => {
            const isToday = d.day === today;
            const pct = d.run ? (d.run.totalMs / max) * 80 : 0;
            return (
              <button
                key={d.day}
                type="button"
                onClick={() => setSel(i)}
                onMouseEnter={() => setSel(i)}
                aria-pressed={active === i}
                aria-label={`${dayLabel(d.day, { weekday: "long", month: "short", day: "numeric" })}: ${d.run ? formatMs(d.run.totalMs) : "no run"}`}
                className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1 rounded-md"
              >
                {d.run ? (
                  <span
                    className={`flex w-full max-w-9 flex-col-reverse gap-[3px] overflow-hidden rounded-t-[8px] rounded-b-[3px] border-[2.5px] border-ink bg-ink transition-transform duration-150 group-hover:-translate-y-0.5 ${
                      active === i ? "shadow-[3px_3px_0_var(--gold-deep)]" : ""
                    }`}
                    style={{ height: `${Math.max(pct, 4)}%` }}
                  >
                    {d.run.splits.map((s, j) => (
                      <span key={j} className={s.status === "skipped" ? "hatch" : `bg-pastel-${s.color}`} style={{ flexGrow: Math.max(s.ms, 1), flexBasis: 0 }} />
                    ))}
                  </span>
                ) : (
                  <span className="mb-1 size-2 rounded-full bg-ink/25" />
                )}
                <span className={`font-display h-6 text-xs leading-6 font-semibold ${isToday ? "rounded-full bg-ink px-1.5 text-cream" : "text-ink-soft"}`}>
                  {dayLabel(d.day, { weekday: "narrow" })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {withRuns.length === 0 ? (
        <p className="text-ink-soft">{S.dashboard.chartEmpty}</p>
      ) : (
        selected && (
          <div className="rounded-[var(--r-sm)] border-[3px] border-ink bg-white p-3" aria-live="polite">
            <p className="flex items-baseline justify-between gap-3">
              <span className="font-bold">{dayLabel(selected.day, { weekday: "long", month: "short", day: "numeric" })}</span>
              <span className="font-display text-lg font-bold">{selected.run ? <Digits>{formatMs(selected.run.totalMs)}</Digits> : "No run"}</span>
            </p>
            {selected.run && (
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.95rem]">
                {selected.run.splits.map((s, j) => (
                  <li key={j} className="flex items-center gap-1.5">
                    <span className={`size-3 rounded-full border-2 border-ink ${s.status === "skipped" ? "hatch" : `bg-pastel-${s.color}`}`} aria-hidden />
                    {s.name} <span className="font-display font-semibold">{s.status === "skipped" ? "skipped" : <Digits>{formatMs(s.ms, false)}</Digits>}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      )}
    </div>
  );
}
