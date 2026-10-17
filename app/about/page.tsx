import type { Metadata } from "next";
import { Mascot } from "@/components/Mascot";
import { Wordmark } from "@/components/Wordmark";
import { APP_NAME } from "@/lib/config";

export const metadata: Metadata = { title: "About & privacy" };

export default function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 pt-5">
      <header>
        <Wordmark />
      </header>
      <div className="flex items-center gap-4">
        <Mascot className="w-20 shrink-0" />
        <h1 className="text-[2rem] leading-tight font-bold">About {APP_NAME}</h1>
      </div>
      <div className="flex max-w-[65ch] flex-col gap-4 text-[1.05rem]">
        <p>
          {APP_NAME} is a small fan-made tool. It opens the daily puzzle games you pick, one after another, and works as a stopwatch and record book while you play
          them. It doesn&apos;t host, copy, embed or read any game, and it can&apos;t see whether you&apos;ve solved one, so you tell it by tapping Done.
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Privacy</h2>
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>Everything you do here (your game list, runs and records) is saved only in this browser&apos;s local storage.</li>
          <li>There are no accounts, no cookies, no analytics and no tracking. Nothing is sent to a server.</li>
          <li>Your data stays on your device. You can download a backup or erase all of it at any time from Settings.</li>
          <li>Clearing your browser&apos;s site data, or using a private window, removes your records. Keep a backup if they matter to you.</li>
        </ul>
        <h2 className="mt-2 text-2xl font-semibold">Not affiliated</h2>
        <p>
          {APP_NAME} is not affiliated with, endorsed by or connected to The New York Times, The Washington Post, or the makers of Minute Cryptic, Globle, Bandle, Spotle or any
          other game it links to. Game names belong to their owners and are used only to describe where the links go. The illustrations are original. Some games
          need an account or a subscription on their own site.
        </p>
      </div>
    </main>
  );
}
