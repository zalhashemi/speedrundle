"use client";

import { useId, useState, type FormEvent } from "react";
import { GameCard } from "@/components/GameCard";
import { GameArt, OtherArt } from "@/components/illustrations";
import { SortableList } from "@/components/SortableList";
import { PRESETS, resolveGames } from "@/lib/games";
import { useStore } from "@/lib/store";
import { S } from "@/lib/strings";
import { normalizeUrl } from "@/lib/validate";

export function GamePicker({ showOrder = true }: { showOrder?: boolean }) {
  const games = useStore((st) => st.games);
  const togglePreset = useStore((st) => st.togglePreset);
  const moveGame = useStore((st) => st.moveGame);
  const removeGame = useStore((st) => st.removeGame);
  const [otherOpen, setOtherOpen] = useState(false);
  const formId = useId();

  const selectedKeys = new Set(games.flatMap((g) => (g.kind === "preset" ? [g.presetKey] : [])));

  return (
    <div className="flex flex-col gap-8">
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {PRESETS.map((p) => (
          <li key={p.key}>
            <GameCard
              name={p.name}
              blurb={p.blurb}
              color={p.color}
              access={p.access}
              selected={selectedKeys.has(p.key)}
              art={<GameArt presetKey={p.key} name={p.name} />}
              onClick={() => togglePreset(p.key)}
            />
          </li>
        ))}
        <li>
          <GameCard
            name={S.picker.otherTitle}
            blurb={S.picker.otherBlurb}
            color="butter"
            art={<OtherArt />}
            ariaExpanded={otherOpen}
            onClick={() => setOtherOpen((o) => !o)}
          />
        </li>
      </ul>

      {otherOpen && <CustomGameForm id={formId} onClose={() => setOtherOpen(false)} />}

      {showOrder && (
        <section aria-labelledby={`${formId}-order`} className="flex flex-col gap-3">
          <div>
            <h2 id={`${formId}-order`} className="text-2xl font-semibold">
              {S.picker.yourOrder}
            </h2>
            <p className="text-ink-soft">{S.picker.orderHint}</p>
          </div>
          <SortableList games={resolveGames(games)} onMove={moveGame} onRemove={removeGame} />
        </section>
      )}
    </div>
  );
}

function CustomGameForm({ id, onClose }: { id: string; onClose: () => void }) {
  const addCustom = useStore((st) => st.addCustom);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState<{ name?: string; url?: string }>({});
  const [status, setStatus] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const normalized = normalizeUrl(url);
    const next = {
      name: name.trim() ? undefined : S.picker.custom.errName,
      url: normalized ? undefined : S.picker.custom.errUrl,
    };
    setErrors(next);
    if (next.name || next.url || !normalized) return;
    addCustom(name.trim(), normalized);
    setStatus(S.picker.custom.added(name.trim()));
    setName("");
    setUrl("");
    document.getElementById(`${id}-name`)?.focus();
  }

  return (
    <form onSubmit={submit} noValidate className="rise-in sticker flex flex-col gap-4 bg-butter p-4 sm:p-5">
      <h2 className="text-xl font-semibold">{S.picker.custom.title}</h2>
      <div className="grid gap-4 sm:grid-cols-[1fr_1.4fr]">
        <label className="flex flex-col gap-1 font-bold">
          {S.picker.custom.name}
          <input
            id={`${id}-name`}
            autoFocus
            className="input font-normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={S.picker.custom.namePlaceholder}
            maxLength={40}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${id}-name-err` : undefined}
          />
          {errors.name && (
            <span id={`${id}-name-err`} className="text-sm font-bold text-danger">
              {errors.name}
            </span>
          )}
        </label>
        <label className="flex flex-col gap-1 font-bold">
          {S.picker.custom.url}
          <input
            className="input font-normal"
            type="url"
            inputMode="url"
            autoCapitalize="off"
            autoCorrect="off"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={S.picker.custom.urlPlaceholder}
            aria-invalid={!!errors.url}
            aria-describedby={errors.url ? `${id}-url-err` : undefined}
          />
          {errors.url && (
            <span id={`${id}-url-err`} className="text-sm font-bold text-danger">
              {errors.url}
            </span>
          )}
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn btn-primary">
          {S.picker.custom.add}
        </button>
        <button type="button" className="btn" onClick={onClose}>
          {S.picker.custom.done}
        </button>
        <span role="status" className="font-bold">
          {status}
        </span>
      </div>
    </form>
  );
}
