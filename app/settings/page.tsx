"use client";

import { ArrowLeft, Download, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Wordmark } from "@/components/Wordmark";
import { downloadBackup } from "@/lib/download";
import { mergeData, parseExport, replaceData } from "@/lib/importExport";
import { snapshotData, useHydrated, useStore } from "@/lib/store";
import { S } from "@/lib/strings";

export default function SettingsPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const replaceAll = useStore((st) => st.replaceAll);
  const wipe = useStore((st) => st.wipe);
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"merge" | "replace">("merge");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmWipe, setConfirmWipe] = useState(false);

  if (!hydrated) return <div className="flex-1" aria-busy="true" />;

  function pick(m: "merge" | "replace") {
    setMode(m);
    setMsg(null);
    fileRef.current?.click();
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    try {
      const incoming = parseExport(await file.text());
      const current = snapshotData();
      const next = mode === "merge" ? mergeData(current, incoming) : replaceData(current, incoming);
      replaceAll(next);
      setMsg({ ok: true, text: S.settings.imported(next.runs.length) });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : String(e) });
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 pt-5">
      <header className="flex items-center justify-between gap-3">
        <Wordmark />
        <Link href="/dashboard" className="btn btn-sm">
          <ArrowLeft className="size-4" strokeWidth={3} aria-hidden />
          {S.common.backToDashboard}
        </Link>
      </header>
      <h1 className="text-[2rem] leading-tight font-bold">{S.settings.title}</h1>

      <section className="sticker flex flex-col gap-3 bg-blue p-5" aria-labelledby="backup">
        <h2 id="backup" className="text-xl font-semibold">
          {S.settings.backupTitle}
        </h2>
        <p>{S.settings.backupBody}</p>
        <div>
          <button type="button" className="btn btn-primary" onClick={downloadBackup}>
            <Download className="size-5" strokeWidth={3} aria-hidden />
            {S.settings.export}
          </button>
        </div>
      </section>

      <section className="sticker flex flex-col gap-3 bg-white p-5" aria-labelledby="restore">
        <h2 id="restore" className="text-xl font-semibold">
          {S.settings.importTitle}
        </h2>
        <p>{S.settings.importBody}</p>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn" onClick={() => pick("merge")}>
            <Upload className="size-5" strokeWidth={2.75} aria-hidden />
            {S.settings.importMerge}
          </button>
          <button type="button" className="btn" onClick={() => pick("replace")}>
            {S.settings.importReplace}
          </button>
        </div>
        <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" tabIndex={-1} aria-hidden onChange={(e) => onFile(e.target.files?.[0])} />
        {msg && (
          <p role={msg.ok ? "status" : "alert"} className={`font-bold ${msg.ok ? "" : "text-danger"}`}>
            {msg.text}
          </p>
        )}
      </section>

      <section className="sticker flex flex-col gap-3 bg-danger-soft p-5" aria-labelledby="danger">
        <h2 id="danger" className="text-xl font-semibold">
          {S.settings.dangerTitle}
        </h2>
        <p>{S.settings.dangerBody}</p>
        {confirmWipe ? (
          <div role="alertdialog" aria-labelledby="wipe-q" className="flex flex-col gap-3">
            <p id="wipe-q" className="font-bold">
              {S.settings.wipeConfirm}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="btn btn-danger"
                autoFocus
                onClick={() => {
                  wipe();
                  router.replace("/");
                }}
              >
                {S.settings.wipeYes}
              </button>
              <button type="button" className="btn" onClick={() => setConfirmWipe(false)}>
                {S.settings.cancel}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <button type="button" className="btn btn-danger" onClick={() => setConfirmWipe(true)}>
              {S.settings.wipe}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
