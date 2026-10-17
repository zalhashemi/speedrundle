import { describe, expect, it } from "vitest";
import { mergeData, parseExport, toExport } from "@/lib/importExport";
import { lastDays, personalBest, streak, sumOfBest } from "@/lib/stats";
import { initialData } from "@/lib/store";
import {
  categoryKey,
  currentSplitElapsed,
  elapsed,
  finalize,
  formatMs,
  localDay,
  type ActiveRun,
  type Run,
} from "@/lib/timing";
import { normalizeUrl } from "@/lib/validate";

const games = [
  { gameId: "wordle", name: "Wordle", url: "https://a.com", color: "mint" as const },
  { gameId: "connections", name: "Connections", url: "https://b.com", color: "lavender" as const },
];

const run = (over: Partial<ActiveRun> = {}): ActiveRun => ({
  id: "r1",
  startedAt: 1000,
  games,
  marks: [],
  pauses: [],
  ...over,
});

function makeRun(day: string, totalMs: number, over: Partial<Run> = {}): Run {
  return {
    id: `${day}-${totalMs}`,
    day,
    categoryKey: categoryKey(["wordle", "connections"]),
    startedAt: new Date(`${day}T08:00:00`).getTime(),
    endedAt: 0,
    pausedMs: 0,
    totalMs,
    status: "complete",
    official: true,
    splits: [
      { gameId: "wordle", name: "Wordle", color: "mint", ms: totalMs / 2, status: "done" },
      { gameId: "connections", name: "Connections", color: "lavender", ms: totalMs / 2, status: "done" },
    ],
    ...over,
  };
}

describe("timing", () => {
  it("excludes paused time from splits and totals", () => {
    const r = run({
      marks: [
        { at: 11000, status: "done" },
        { at: 41000, status: "done" },
      ],
      pauses: [{ start: 20000, end: 25000 }],
    });
    const f = finalize(r, true);
    expect(f.splits.map((s) => s.ms)).toEqual([10000, 25000]);
    expect(f.totalMs).toBe(35000);
    expect(f.pausedMs).toBe(5000);
    expect(f.status).toBe("complete");
  });

  it("freezes the clock while paused", () => {
    const r = run({ pauses: [{ start: 6000, end: null }] });
    expect(elapsed(r, 60000)).toBe(5000);
    expect(currentSplitElapsed(r, 60000)).toBe(5000);
  });

  it("marks runs with a skipped game as incomplete", () => {
    const r = run({ marks: [{ at: 2000, status: "skipped" }, { at: 3000, status: "done" }] });
    expect(finalize(r, true).status).toBe("incomplete");
  });

  it("category ignores order", () => {
    expect(categoryKey(["b", "a"])).toBe(categoryKey(["a", "b"]));
  });

  it("formats times", () => {
    expect(formatMs(7400)).toBe("0:07.4");
    expect(formatMs(123400)).toBe("2:03.4");
    expect(formatMs(3723400)).toBe("1:02:03.4");
  });
});

describe("stats", () => {
  it("PB only counts complete official runs in the same category", () => {
    const runs = [
      makeRun("2026-10-10", 90000),
      makeRun("2026-10-11", 60000, { status: "incomplete" }),
      makeRun("2026-10-12", 70000, { categoryKey: "other" }),
      makeRun("2026-10-13", 50000, { official: false }),
    ];
    expect(personalBest(runs, categoryKey(["connections", "wordle"]))?.totalMs).toBe(90000);
  });

  it("streak counts back from today, or from yesterday if today isn't done", () => {
    const runs = ["2026-10-14", "2026-10-15", "2026-10-16"].map((d) => makeRun(d, 1000));
    expect(streak(runs, "2026-10-16")).toBe(3);
    expect(streak(runs, "2026-10-17")).toBe(3);
    expect(streak(runs, "2026-10-18")).toBe(0);
  });

  it("streak crosses a DST change", () => {
    // US DST ends 2026-11-01.
    const runs = ["2026-10-31", "2026-11-01", "2026-11-02"].map((d) => makeRun(d, 1000));
    expect(streak(runs, "2026-11-02")).toBe(3);
    expect(lastDays(runs, "2026-11-02", 3).map((d) => d.day)).toEqual(["2026-10-31", "2026-11-01", "2026-11-02"]);
  });

  it("sum of best combines each game's best split", () => {
    const runs = [
      makeRun("2026-10-10", 0, {
        splits: [
          { gameId: "wordle", name: "W", color: "mint", ms: 30, status: "done" },
          { gameId: "connections", name: "C", color: "mint", ms: 90, status: "done" },
        ],
      }),
      makeRun("2026-10-11", 0, {
        splits: [
          { gameId: "wordle", name: "W", color: "mint", ms: 50, status: "done" },
          { gameId: "connections", name: "C", color: "mint", ms: 40, status: "done" },
        ],
      }),
    ];
    expect(sumOfBest(runs, ["wordle", "connections"])).toBe(70);
    expect(sumOfBest(runs, ["wordle", "globle"])).toBeNull();
  });

  it("localDay uses the local calendar", () => {
    expect(localDay(new Date(2026, 0, 5, 23, 59).getTime())).toBe("2026-01-05");
  });
});

describe("import / export", () => {
  it("round-trips and merges idempotently", () => {
    const a = { ...initialData(), games: [{ id: "wordle", kind: "preset" as const, presetKey: "wordle" }], runs: [makeRun("2026-10-10", 1000)] };
    const file = parseExport(JSON.stringify(toExport(a)));
    const merged = mergeData(a, file);
    expect(merged.runs).toHaveLength(1);
    expect(merged.games).toHaveLength(1);
  });

  it("keeps the faster run official when two share a day", () => {
    const a = { ...initialData(), runs: [makeRun("2026-10-10", 5000)] };
    const b = { ...initialData(), runs: [makeRun("2026-10-10", 3000)] };
    const merged = mergeData(a, parseExport(JSON.stringify(toExport(b))));
    const off = merged.runs.filter((r) => r.official);
    expect(off).toHaveLength(1);
    expect(off[0].totalMs).toBe(3000);
    expect(a.runs[0].official).toBe(true); // caller's data untouched
  });

  it("rejects files that aren't backups", () => {
    expect(() => parseExport("nope")).toThrow(/valid JSON/);
    expect(() => parseExport("{}")).toThrow(/backup/);
  });
});

describe("normalizeUrl", () => {
  it.each([
    ["https://globle-game.com", "https://globle-game.com/"],
    ["spotle.io", "https://spotle.io/"],
    ["  http://example.com/x  ", "http://example.com/x"],
  ])("accepts %s", (input, out) => expect(normalizeUrl(input)).toBe(out));

  it.each(["", "javascript:alert(1)", "ftp://x.com", "https://wordle", "not a url"])("rejects %s", (input) =>
    expect(normalizeUrl(input)).toBeNull(),
  );
});
