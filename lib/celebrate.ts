const COLORS = ["#c8f0dc", "#ffd9c2", "#e2d7ff", "#fff0a8", "#cde7ff", "#ffd3e6", "#ffc93c"];

/** Confetti for a personal best. Does nothing when the person prefers reduced motion. */
export async function celebrate(big: boolean) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const confetti = (await import("canvas-confetti")).default;
  const base = { colors: COLORS, disableForReducedMotion: true, scalar: 1.1, ticks: 220 };
  if (big) {
    confetti({ ...base, particleCount: 90, spread: 70, angle: 60, origin: { x: 0, y: 0.75 } });
    confetti({ ...base, particleCount: 90, spread: 70, angle: 120, origin: { x: 1, y: 0.75 } });
  } else {
    confetti({ ...base, particleCount: 50, spread: 60, origin: { x: 0.5, y: 0.4 } });
  }
}
