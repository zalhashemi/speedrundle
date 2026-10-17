"use client";

import { Star } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { Digits } from "@/components/Digits";
import type { Pastel } from "@/lib/games";
import { formatMs, type SplitStatus } from "@/lib/timing";

export interface StripSplit {
  gameId: string;
  name: string;
  color: Pastel;
  ms: number;
  status: SplitStatus | "current" | "pending";
}

interface Props {
  splits: StripSplit[];
  /** Size blocks by time (results, history) or equally (live run progress). */
  proportional?: boolean;
  gold?: string[];
  showLabels?: boolean;
  decorative?: boolean;
  className?: string;
  height?: string;
}

/** The signature: a run drawn as a strip of candy blocks, one per game. */
export function SplitStrip({ splits, proportional = true, gold = [], showLabels = false, decorative = false, className = "", height = "h-12" }: Props) {
  const label = decorative
    ? undefined
    : splits
        .map((s) => `${s.name}: ${s.status === "pending" ? "not started" : s.status === "skipped" ? "skipped" : formatMs(s.ms)}`)
        .join(", ");
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !showLabels) return;
    setWidth(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [showLabels]);
  const totalGrow = splits.reduce((a, s) => a + (proportional ? Math.max(s.ms, 1) : 1), 0);
  return (
    <div
      ref={ref}
      className={`flex overflow-hidden rounded-full border-[3px] border-ink bg-white shadow-[4px_4px_0_var(--ink)] ${height} ${className}`}
      role={decorative ? undefined : "img"}
      aria-label={label}
      aria-hidden={decorative || undefined}
    >
      {splits.map((s, i) => {
        const isGold = gold.includes(s.gameId) && s.status === "done";
        const fill =
          s.status === "skipped" ? "hatch" : s.status === "pending" ? "bg-white" : isGold ? "bg-gold" : `bg-pastel-${s.color}`;
        const grow = proportional ? Math.max(s.ms, 1) : 1;
        return (
          <div
            key={`${s.gameId}-${i}`}
            className={`relative flex min-w-3 items-center justify-center overflow-hidden ${fill} ${i > 0 ? "border-l-[3px] border-ink" : ""} ${
              s.status === "current" ? "animate-pulse motion-reduce:animate-none" : ""
            }`}
            style={{ flexGrow: grow, flexBasis: 0 }}
          >
            {isGold && <Star className="size-4 shrink-0 fill-ink" strokeWidth={0} aria-hidden />}
            {showLabels && s.status !== "pending" && (grow / totalGrow) * width >= 48 && (
              <span className="font-display truncate px-2 text-sm font-semibold">{s.status === "skipped" ? "skip" : <Digits>{formatMs(s.ms, false)}</Digits>}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
