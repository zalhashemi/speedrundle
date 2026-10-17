/** Opens a game in a new tab. Must be called directly from a click handler. Returns false if the browser blocked it. */
export function openGame(url: string): boolean {
  const w = window.open(url, "_blank");
  if (!w) return false;
  try {
    w.opener = null;
  } catch {
    // Cross-origin windows may refuse; the new tab is open either way.
  }
  return true;
}
