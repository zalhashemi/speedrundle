"use client";

import { Check, Flame, Pencil, Play, Settings, Sigma, Star, Trophy } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { BackupNudge } from "@/components/BackupNudge";
import { Digits } from "@/components/Digits";
import { HistoryChart } from "@/components/HistoryChart";
import { Mascot } from "@/components/Mascot";
import { ResultPanel } from "@/components/ResultPanel";
import { RunPanel } from "@/components/RunPanel";
import { SplitStrip } from "@/components/SplitStrip";
import { Wordmark } from "@/components/Wordmark";
import { resolveGames } from "@/lib/games";
import { openGame } from "@/lib/openGame";
import { bestSplits, history, lastDays, personalBest, streak, sumOfBest, todaysRun } from "@/lib/stats";
import { useHydrated, useStore } from "@/lib/store";
import { S } from "@/lib/strings";
import { categoryKey, formatDelta, formatMs, localDay } from "@/lib/timing";
import { useNow } from "@/lib/useNow";

export default function DashboardPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const onboarded = useStore((st) => st.onboarded);
  const activeRun = useStore((st) => st.activeRun);
  const lastResult = useStore((st) => st.lastResult);

  useEffect(() => {
    if (hydrated && !onboarded) router.replace("/");
  }, [hydrated, onboarded, router]);

  if (!hydrated || !onboarded) return <div className="flex-1" aria-busy="true" />;
  if (activeRun) return <RunPanel />;
  if (lastResult) return <ResultPanel />;
  return <Dashboard />;
}

function Dashboard() {
  const games = useStore((st) => st.games);
  const runs = useStore((st) => st.runs);
  const nudgeDismissed = useStore((st) => st.ui.backupNudgeDismissed);
  const startRun = useStore((st) => st.startRun);
  // Re-render after midnight so "today" rolls over.
  const now = useNow(true, 60_000);
  const today = localDay(now);

  const resolved = useMemo(() => resolveGames(games), [games]);
  const ids = resolved.map((g) => g.id);
  const cat = categoryKey(ids);
  const pb = personalBest(runs, cat);
  const sob = sumOfBest(runs, ids);
  const best = useMemo(() => bestSplits(runs), [runs]);
  const todays = todaysRun(runs, today);
  const hist = history(runs);
  const latest = hist[0] ?? null;
  const days = lastDays(runs, today, 14);
  const streakN = streak(runs, today);

  function start() {
    if (!resolved.length) return;
    openGame(resolved[0].url);
    startRun();
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 pt-5 lg:max-w-5xl">
      <header className="flex items-center justify-between gap-3">
        <Wordmark />
        <nav className="flex items-center gap-2" aria-label="Main">
          <Link href="/games" className="btn btn-sm">
            <Pencil className="size-4" strokeWidth={2.75} aria-hidden />
            <span className="max-sm:sr-only">{S.dashboard.editGames}</span>
          </Link>
          <Link href="/settings" className="btn btn-sm btn-icon" aria-label={S.dashboard.settings}>
            <Settings className="size-5" strokeWidth={2.5} aria-hidden />
          </Link>
        </nav>
      </header>

      <p className="font-display flex items-center gap-2 text-xl font-semibold">
          {todays ? (
            <>
              <span className="grid size-8 place-items-center rounded-full border-[3px] border-ink bg-mint">
                <Check className="size-4" strokeWidth={4} aria-hidden />
              </span>
              {S.dashboard.statusDone(formatMs(todays.totalMs))}
            </>
          ) : (
            <>
              <span className="size-4 rounded-full border-[3px] border-ink bg-peach" aria-hidden />
              {S.dashboard.statusNotDone}
            </>
          )}
        </p>

      <div className="-mt-4 grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-start">
      {/* Start zone */}
      <section className="flex flex-col gap-4" aria-labelledby="today">
        <h1 id="today" className="sr-only">
          {S.dashboard.title}
        </h1>

        {resolved.length === 0 ? (
          <div className="sticker flex flex-col items-start gap-3 bg-white p-5">
            <p className="text-lg font-bold">{S.dashboard.noGames}</p>
            <Link href="/games" className="btn btn-primary">
              {S.dashboard.pickGames}
            </Link>
          </div>
        ) : todays ? (
          <div className="flex flex-col items-start gap-2">
            <button type="button" className="btn" onClick={start}>
              <Play className="size-4 fill-current" strokeWidth={3} aria-hidden />
              {S.dashboard.startPractice}
              <span className="sr-only">{S.common.opensNewTab}</span>
            </button>
            <p className="text-sm text-ink-soft">{S.dashboard.practiceNote}</p>
          </div>
        ) : (
          <button
            type="button"
            onClick={start}
            className="group relative flex min-h-28 w-full items-center gap-4 rounded-[var(--r-lg)] border-[3px] border-ink bg-ink px-6 py-5 text-left text-cream shadow-[6px_6px_0_var(--gold-deep)] transition-[transform,box-shadow] duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-[7px_7px_0_var(--gold-deep)] active:translate-x-1.5 active:translate-y-1.5 active:shadow-none motion-reduce:transition-none"
          >
            <span className="grid size-16 shrink-0 place-items-center rounded-full border-[3px] border-cream bg-gold text-ink">
              <Play className="ml-1 size-7 fill-current" strokeWidth={3} aria-hidden />
            </span>
            <span className="flex flex-col">
              <span className="font-display text-[1.9rem] leading-none font-bold sm:text-[2.3rem]">{S.dashboard.start}</span>
              <span className="mt-1.5 font-semibold text-cream/85">
                {resolved.length} game{resolved.length === 1 ? "" : "s"}, starting with {resolved[0].name}
                <span className="sr-only"> {S.common.opensNewTab}</span>
              </span>
            </span>
            <Mascot mood="happy" className="pointer-events-none ml-auto hidden w-20 shrink-0 rotate-6 sm:block" />
          </button>
        )}

        {latest && (
          <div className="mt-2 flex flex-col gap-2">
            <h2 className="text-xl font-semibold">{S.dashboard.latest}</h2>
            <SplitStrip splits={latest.splits} showLabels />
          </div>
        )}
      </section>

      <div className="flex flex-col gap-6">
      {runs.length >= 1 && !nudgeDismissed && <BackupNudge />}

      {/* Records */}
      <section aria-labelledby="records" className="flex flex-col gap-3">
        <h2 id="records" className="sr-only">
          Records
        </h2>
        <div className="grid grid-cols-[auto_1fr] items-stretch gap-3">
          <div className="sticker flex -rotate-2 flex-col items-center justify-center bg-butter px-4 py-3 text-center">
            <Flame className="size-7 fill-peach" strokeWidth={2.5} aria-hidden />
            <p className="font-display text-[2rem] leading-none font-bold">
              <Digits>{String(streakN)}</Digits>
            </p>
            <p className="text-sm font-bold">{S.dashboard.streak}</p>
          </div>
          <dl className="sticker flex flex-col justify-center gap-2 bg-white px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <dt className="flex items-center gap-2 text-[0.95rem] font-bold whitespace-nowrap">
                <Trophy className="size-5 shrink-0" strokeWidth={2.5} aria-hidden />
                {S.dashboard.pb}
              </dt>
              <dd className="font-display text-lg font-bold sm:text-xl">{pb ? <Digits>{formatMs(pb.totalMs)}</Digits> : <span className="text-base text-ink-soft">{S.dashboard.pbNone}</span>}</dd>
            </div>
            <div className="flex items-center justify-between gap-2 border-t-2 border-dashed border-ink/20 pt-2">
              <dt className="flex items-center gap-2 text-[0.95rem] font-bold whitespace-nowrap">
                <Sigma className="size-5 shrink-0" strokeWidth={2.5} aria-hidden />
                <span>
                  {S.dashboard.sob}
                  <span className="block text-xs font-semibold whitespace-normal text-ink-soft">{S.dashboard.sobHint}</span>
                </span>
              </dt>
              <dd className="font-display text-lg font-bold sm:text-xl">{sob !== null ? <Digits>{formatMs(sob)}</Digits> : <span className="text-base text-ink-soft">{S.dashboard.pbNone}</span>}</dd>
            </div>
          </dl>
        </div>
        <p className="text-sm text-ink-soft">
          {S.dashboard.pbCategoryNote}
        </p>
      </section>
      </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">


      <section aria-labelledby="chart" className="flex flex-col gap-3">
        <h2 id="chart" className="text-2xl font-semibold">
          {S.dashboard.chart}
        </h2>
        <HistoryChart days={days} today={today} pbMs={pb?.totalMs ?? null} />
      </section>

      {resolved.length > 0 && (
        <section aria-labelledby="splits" className="flex flex-col gap-3">
          <h2 id="splits" className="text-2xl font-semibold">
            {S.dashboard.splits}
          </h2>
          <div className="sticker overflow-hidden bg-white">
            <table className="w-full text-left">
              <thead className="border-b-[3px] border-ink bg-lavender">
                <tr>
                  <th className="px-4 py-2">Game</th>
                  <th className="px-4 py-2 text-right">Best</th>
                  <th className="px-4 py-2 text-right">Latest</th>
                </tr>
              </thead>
              <tbody>
                {resolved.map((g) => {
                  const b = best.get(g.id);
                  const last = latest?.splits.find((s) => s.gameId === g.id);
                  const lastIsBest = last && last.status === "done" && b !== undefined && last.ms === b;
                  return (
                    <tr key={g.id} className="border-b-2 border-dashed border-ink/20 last:border-0">
                      <td className="px-4 py-2.5">
                        <span className="flex items-center gap-2 font-semibold">
                          <span className={`size-3.5 shrink-0 rounded-full border-2 border-ink bg-pastel-${g.color}`} aria-hidden />
                          {g.name}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold tabular">{b !== undefined ? formatMs(b) : "–"}</td>
                      <td className="px-4 py-2.5 text-right tabular">
                        {last ? (
                          last.status === "skipped" ? (
                            "skipped"
                          ) : lastIsBest ? (
                            <span className="inline-flex items-center gap-1 rounded-full border-2 border-ink bg-gold px-2 font-semibold">
                              <Star className="size-3.5 fill-ink" strokeWidth={0} aria-hidden />
                              {formatMs(last.ms)}
                              <span className="sr-only">(best)</span>
                            </span>
                          ) : (
                            formatMs(last.ms)
                          )
                        ) : (
                          "–"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      </div>

      <section aria-labelledby="history" className="flex flex-col gap-3">
        <h2 id="history" className="text-2xl font-semibold">
          {S.dashboard.history}
        </h2>
        {hist.length === 0 ? (
          <p className="text-ink-soft">{S.dashboard.historyEmpty}</p>
        ) : (
          <div className="sticker overflow-x-auto bg-white">
            <table className="w-full text-left">
              <thead className="border-b-[3px] border-ink bg-mint">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2 text-right">Time</th>
                  <th className="px-4 py-2 text-right">vs PB</th>
                </tr>
              </thead>
              <tbody>
                {hist.slice(0, 30).map((r) => {
                  const rPb = personalBest(runs, r.categoryKey);
                  const isPb = rPb?.id === r.id;
                  return (
                    <tr key={r.id} className="border-b-2 border-dashed border-ink/20 last:border-0">
                      <td className="px-4 py-2.5 font-semibold">
                        {new Date(r.startedAt).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                        {r.status === "incomplete" && <span className="ml-2 text-sm font-normal text-ink-soft">with skips</span>}
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold tabular">
                        {isPb ? (
                          <span className="inline-flex items-center gap-1 rounded-full border-2 border-ink bg-gold px-2">
                            <Trophy className="size-3.5" strokeWidth={2.75} aria-hidden />
                            {formatMs(r.totalMs)}
                            <span className="sr-only">(personal best)</span>
                          </span>
                        ) : (
                          formatMs(r.totalMs)
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular text-ink-soft">
                        {r.status === "complete" && rPb && !isPb ? formatDelta(r.totalMs - rPb.totalMs) : "–"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
