/** Returns a normalized http(s) URL, or null if the input isn't one. Bare domains get https:// added. */
export function normalizeUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;
  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  // Require a dotted hostname (rejects "https://wordle") unless it's localhost.
  if (!url.hostname.includes(".") && url.hostname !== "localhost") return null;
  return url.toString();
}
