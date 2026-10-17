import { Check, Lock, LogIn } from "lucide-react";
import type { ReactNode } from "react";
import { ACCESS_LABEL, type Access, type Pastel } from "@/lib/games";
import { S } from "@/lib/strings";

interface Props {
  name: string;
  blurb: string;
  color: Pastel;
  access?: Access;
  selected?: boolean;
  art: ReactNode;
  onClick: () => void;
  ariaExpanded?: boolean;
}

export function GameCard({ name, blurb, color, access = "free", selected = false, art, onClick, ariaExpanded }: Props) {
  const badge = ACCESS_LABEL[access];
  const BadgeIcon = access === "subscription" ? Lock : LogIn;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ariaExpanded === undefined ? selected : undefined}
      aria-expanded={ariaExpanded}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[var(--r-md)] border-[3px] border-ink text-left transition-[transform,box-shadow,background-color] duration-150 ease-out hover:-translate-x-px hover:-translate-y-px active:translate-x-1 active:translate-y-1 active:shadow-none motion-reduce:transition-none ${
        selected ? `bg-pastel-${color} shadow-[6px_6px_0_var(--ink)]` : "bg-white shadow-[4px_4px_0_var(--ink)]"
      }`}
    >
      <span className={`block aspect-[4/3] w-full border-b-[3px] border-ink p-2 bg-pastel-${color}`}>{art}</span>
      <span className="flex flex-1 flex-col gap-1 p-3">
        <span className="font-display text-[1.05rem] leading-tight font-semibold">{name}</span>
        <span className="text-[0.9rem] leading-snug text-ink-soft">{blurb}</span>
        {badge && (
          <span className="mt-auto inline-flex items-center gap-1 pt-2 text-[0.8rem] font-bold whitespace-nowrap text-ink">
            <BadgeIcon className="size-3.5 shrink-0" strokeWidth={2.75} aria-hidden />
            {badge}
          </span>
        )}
      </span>
      {selected && (
        <span className="pop-in absolute top-2 right-2 grid size-9 place-items-center rounded-full border-[3px] border-ink bg-gold">
          <Check className="size-5" strokeWidth={3.5} aria-hidden />
          <span className="sr-only">{S.picker.selected}</span>
        </span>
      )}
    </button>
  );
}
