"use client";

import { Download } from "lucide-react";
import { downloadBackup } from "@/lib/download";
import { useStore } from "@/lib/store";
import { S } from "@/lib/strings";

export function BackupNudge() {
  const dismiss = useStore((st) => st.dismissBackupNudge);
  return (
    <aside aria-labelledby="backup-title" className="rise-in sticker flex flex-col gap-3 bg-blue p-4">
      <h2 id="backup-title" className="text-xl font-semibold">
        {S.backup.title}
      </h2>
      <p>{S.backup.body}</p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => {
            downloadBackup();
            dismiss();
          }}
        >
          <Download className="size-4" strokeWidth={3} aria-hidden />
          {S.backup.cta}
        </button>
        <button type="button" className="btn btn-sm" onClick={dismiss}>
          {S.backup.later}
        </button>
      </div>
    </aside>
  );
}
