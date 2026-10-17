import { toExport } from "./importExport";
import { snapshotData } from "./store";
import { localDay } from "./timing";

export function downloadBackup() {
  const blob = new Blob([JSON.stringify(toExport(snapshotData()), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `speedrundle-backup-${localDay(Date.now())}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
