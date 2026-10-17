"use client";

import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GamePicker } from "@/components/GamePicker";
import { Mascot } from "@/components/Mascot";
import { SplitStrip } from "@/components/SplitStrip";
import { Wordmark } from "@/components/Wordmark";
import { resolveGames } from "@/lib/games";
import { openGame } from "@/lib/openGame";
import { useHydrated, useStore } from "@/lib/store";
import { S } from "@/lib/strings";

const STEPS = 3;

export default function Onboarding() {
  const router = useRouter();
  const hydrated = useHydrated();
  const onboarded = useStore((st) => st.onboarded);
  const games = useStore((st) => st.games);
  const setOnboarded = useStore((st) => st.setOnboarded);
  const startRun = useStore((st) => st.startRun);
  const [step, setStep] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (hydrated && onboarded) router.replace("/dashboard");
  }, [hydrated, onboarded, router]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  if (!hydrated || onboarded) return <div className="flex-1" aria-busy="true" />;

  const resolved = resolveGames(games);

  function finish(start: boolean) {
    if (start && resolved.length) {
      openGame(resolved[0].url);
      startRun();
    }
    setOnboarded(true);
    router.push("/dashboard");
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pt-5">
      <header className="flex items-center justify-between gap-4">
        <Wordmark href="/" />
        <ol className="flex items-center gap-2" aria-label={S.onboarding.step(step + 1, STEPS)}>
          {Array.from({ length: STEPS }, (_, i) => (
            <li
              key={i}
              className={`h-3 rounded-full border-[2.5px] border-ink transition-all duration-300 ${i === step ? "w-8 bg-ink" : i < step ? "w-3 bg-ink" : "w-3 bg-white"}`}
            />
          ))}
        </ol>
      </header>

      {step === 0 && (
        <section className="flex flex-1 flex-col items-center justify-center gap-6 py-10 text-center">
          <div className="relative">
            <div className="absolute inset-x-6 bottom-2 h-6 rounded-full bg-ink/10 blur-[2px]" aria-hidden />
            <Mascot mood="cheer" className="wobble relative w-44 sm:w-52" />
          </div>
          <h1 ref={headingRef} tabIndex={-1} className="max-w-[16ch] text-[2.4rem] leading-[1.05] font-bold outline-none sm:text-[3.2rem]">
            {S.onboarding.intro.title}
          </h1>
          <p className="max-w-[44ch] text-lg text-ink-soft">{S.onboarding.intro.body}</p>
          <SplitStrip
            className="w-full max-w-md"
            decorative
            splits={[
              { gameId: "a", name: "", color: "mint", ms: 3, status: "done" },
              { gameId: "b", name: "", color: "lavender", ms: 5, status: "done" },
              { gameId: "c", name: "", color: "butter", ms: 2, status: "done" },
              { gameId: "d", name: "", color: "peach", ms: 4, status: "done" },
            ]}
          />
          <button type="button" className="btn btn-primary mt-2 min-h-14 px-8 text-xl" onClick={() => setStep(1)}>
            {S.onboarding.intro.cta}
            <ArrowRight className="size-5" strokeWidth={3} aria-hidden />
          </button>
        </section>
      )}

      {step === 1 && (
        <section className="flex flex-1 flex-col gap-6 py-8">
          <div>
            <h1 ref={headingRef} tabIndex={-1} className="text-[2rem] leading-tight font-bold outline-none sm:text-[2.6rem]">
              {S.onboarding.pick.title}
            </h1>
            <p className="text-lg text-ink-soft">{S.onboarding.pick.body}</p>
          </div>
          <GamePicker showOrder={false} />
          <div className="sticky bottom-0 -mx-4 mt-2 flex items-center justify-between gap-3 border-t-[3px] border-ink bg-cream/95 px-4 py-4 backdrop-blur-sm">
            <button type="button" className="btn btn-ghost" onClick={() => setStep(0)}>
              <ArrowLeft className="size-5" strokeWidth={3} aria-hidden />
              {S.onboarding.back}
            </button>
            <button type="button" className="btn btn-primary" disabled={!resolved.length} onClick={() => setStep(2)}>
              {S.onboarding.pick.cta(resolved.length)}
              <ArrowRight className="size-5" strokeWidth={3} aria-hidden />
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="flex flex-1 flex-col items-center justify-center gap-6 py-10 text-center">
          <Mascot mood="focus" className="w-32" />
          <h1 ref={headingRef} tabIndex={-1} className="text-[2.2rem] leading-tight font-bold outline-none sm:text-[2.8rem]">
            {S.onboarding.ready.title}
          </h1>
          <p className="max-w-[46ch] text-lg">{S.onboarding.ready.body}</p>
          <ol className="flex flex-wrap justify-center gap-2">
            {resolved.map((g, i) => (
              <li key={g.id} className={`font-display rounded-full border-[2.5px] border-ink px-3 py-1 font-semibold bg-pastel-${g.color}`}>
                {i + 1}. {g.name}
              </li>
            ))}
          </ol>
          <p className="max-w-[46ch] rounded-[var(--r-sm)] bg-white/70 px-4 py-2 font-bold">{S.onboarding.ready.honest}</p>
          <div className="flex flex-col items-center gap-3">
            <button type="button" className="btn btn-primary min-h-14 px-8 text-xl" onClick={() => finish(true)}>
              <Play className="size-5 fill-current" strokeWidth={3} aria-hidden />
              {S.onboarding.ready.start}
              <span className="sr-only">{S.common.opensNewTab}</span>
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => finish(false)}>
              {S.onboarding.ready.later}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
