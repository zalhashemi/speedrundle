import { APP_NAME, DATA_VERSION } from "./config";
import type { Game } from "./games";
import type { Data } from "./store";
import type { Run } from "./timing";

export interface ExportFile {
  app: typeof APP_NAME;
  version: number;
  exportedAt: string;
  games: Game[];
  runs: Run[];
}

export function toExport(data: Data, now = new Date()): ExportFile {
  return { app: APP_NAME, version: DATA_VERSION, exportedAt: now.toISOString(), games: data.games, runs: data.runs };
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

function isGame(g: unknown): g is Game {
  if (!isObj(g) || typeof g.id !== "string") return false;
  if (g.kind === "preset") return typeof g.presetKey === "string";
  return g.kind === "custom" && typeof g.name === "string" && typeof g.url === "string" && typeof g.color === "string";
}

function isRun(r: unknown): r is Run {
  return (
    isObj(r) &&
    typeof r.id === "string" &&
    typeof r.day === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(r.day) &&
    typeof r.categoryKey === "string" &&
    typeof r.totalMs === "number" &&
    typeof r.startedAt === "number" &&
    typeof r.official === "boolean" &&
    Array.isArray(r.splits)
  );
}

/** Parses a backup file. Throws an Error with a human-readable message when it isn't one. */
export function parseExport(text: string): ExportFile {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error("That file isn't valid JSON. Pick a backup you downloaded from Speedrundle.");
  }
  if (!isObj(raw) || raw.app !== APP_NAME || !Array.isArray(raw.games) || !Array.isArray(raw.runs)) {
    throw new Error("That doesn't look like a Speedrundle backup.");
  }
  if (typeof raw.version !== "number" || raw.version > DATA_VERSION) {
    throw new Error("This backup comes from a newer version of Speedrundle.");
  }
  return {
    app: APP_NAME,
    version: raw.version,
    exportedAt: String(raw.exportedAt ?? ""),
    games: raw.games.filter(isGame),
    runs: raw.runs.filter(isRun),
  };
}

/**
 * Merges a backup into existing data without losing anything: games are unioned (existing order first),
 * runs de-duplicated by id. If two official runs share a day, the faster one stays official.
 */
export function mergeData(current: Data, incoming: ExportFile): Data {
  const gameIds = new Set(current.games.map((g) => g.id));
  const games = [...current.games, ...incoming.games.filter((g) => !gameIds.has(g.id))];

  const byId = new Map(current.runs.map((r) => [r.id, r]));
  for (const r of incoming.runs) if (!byId.has(r.id)) byId.set(r.id, r);
  // Copies, because demoting a duplicate below must not mutate the caller's data.
  const runs = [...byId.values()].map((r) => ({ ...r }));

  const officialByDay = new Map<string, Run>();
  for (const r of runs) {
    if (!r.official) continue;
    const other = officialByDay.get(r.day);
    if (!other) officialByDay.set(r.day, r);
    else {
      const [keep, drop] = other.totalMs <= r.totalMs ? [other, r] : [r, other];
      officialByDay.set(r.day, keep);
      drop.official = false;
    }
  }

  return { ...current, onboarded: current.onboarded || games.length > 0, games, runs };
}

export function replaceData(current: Data, incoming: ExportFile): Data {
  return {
    ...current,
    onboarded: true,
    games: incoming.games,
    runs: incoming.runs,
    activeRun: null,
    lastResult: null,
  };
}
