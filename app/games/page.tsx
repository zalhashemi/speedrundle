"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { GamePicker } from "@/components/GamePicker";
import { Wordmark } from "@/components/Wordmark";
import { useHydrated, useStore } from "@/lib/store";
import { S } from "@/lib/strings";

export default function GamesPage() {
  const hydrated = useHydrated();
  const running = useStore((st) => !!st.activeRun);
  if (!hydrated) return <div className="flex-1" aria-busy="true" />;
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 pt-5">
      <header className="flex items-center justify-between gap-3">
        <Wordmark />
        <Link href="/dashboard" className="btn btn-sm">
          <ArrowLeft className="size-4" strokeWidth={3} aria-hidden />
          {S.common.backToDashboard}
        </Link>
      </header>
      <div>
        <h1 className="text-[2rem] leading-tight font-bold">{S.dashboard.editGames}</h1>
        <p className="text-ink-soft">{S.onboarding.pick.body}</p>
        {running && <p className="mt-2 font-bold">Changes apply from your next run. The current run keeps its games.</p>}
      </div>
      <GamePicker />
    </main>
  );
}
