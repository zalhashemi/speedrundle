"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, GripVertical, X } from "lucide-react";
import { GameArt } from "@/components/illustrations";
import type { ResolvedGame } from "@/lib/games";
import { S } from "@/lib/strings";

interface Props {
  games: ResolvedGame[];
  onMove: (from: number, to: number) => void;
  onRemove: (id: string) => void;
}

export function SortableList({ games, onMove, onRemove }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const from = games.findIndex((g) => g.id === active.id);
    const to = games.findIndex((g) => g.id === over.id);
    if (from >= 0 && to >= 0) onMove(from, to);
  }

  if (!games.length) return <p className="rounded-[var(--r-md)] border-[3px] border-dashed border-ink/40 p-4 text-ink-soft">{S.picker.empty}</p>;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={games.map((g) => g.id)} strategy={verticalListSortingStrategy}>
        <ol className="flex flex-col gap-3">
          {games.map((g, i) => (
            <Row key={g.id} game={g} index={i} count={games.length} onMove={onMove} onRemove={onRemove} />
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  );
}

function Row({
  game,
  index,
  count,
  onMove,
  onRemove,
}: {
  game: ResolvedGame;
  index: number;
  count: number;
  onMove: (from: number, to: number) => void;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: game.id });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`relative flex items-center gap-2 rounded-[var(--r-md)] border-[3px] border-ink bg-white p-2 pr-2 ${
        isDragging ? "z-10 shadow-[6px_6px_0_var(--ink)]" : "shadow-[3px_3px_0_var(--ink)]"
      }`}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        className="grid size-11 shrink-0 cursor-grab touch-none place-items-center rounded-[var(--r-sm)] active:cursor-grabbing"
        aria-label={S.picker.dragHandle(game.name)}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-5" strokeWidth={2.5} aria-hidden />
      </button>
      <span className="font-display w-6 shrink-0 text-center text-lg font-semibold tabular">{index + 1}</span>
      <span className={`size-11 shrink-0 overflow-hidden rounded-[10px] border-[2.5px] border-ink bg-pastel-${game.color}`}>
        <GameArt presetKey={game.presetKey} name={game.name} />
      </span>
      <span className="font-display min-w-0 flex-1 truncate font-semibold">{game.name}</span>
      <span className="flex shrink-0 gap-1">
        <button type="button" className="btn btn-icon btn-ghost !min-h-10 !min-w-10" onClick={() => onMove(index, index - 1)} disabled={index === 0} aria-label={S.picker.moveUp(game.name)}>
          <ArrowUp className="size-5" strokeWidth={2.5} aria-hidden />
        </button>
        <button type="button" className="btn btn-icon btn-ghost !min-h-10 !min-w-10" onClick={() => onMove(index, index + 1)} disabled={index === count - 1} aria-label={S.picker.moveDown(game.name)}>
          <ArrowDown className="size-5" strokeWidth={2.5} aria-hidden />
        </button>
        <button type="button" className="btn btn-icon btn-ghost !min-h-10 !min-w-10" onClick={() => onRemove(game.id)} aria-label={S.picker.remove(game.name)}>
          <X className="size-5" strokeWidth={2.75} aria-hidden />
        </button>
      </span>
    </li>
  );
}
