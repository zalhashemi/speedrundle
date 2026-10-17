export type Pastel = "mint" | "peach" | "lavender" | "butter" | "blue" | "pink";

export const PASTELS: Pastel[] = ["mint", "peach", "lavender", "butter", "blue", "pink"];

/** "free" = no sign-in; "login" = free, but the site may ask you to log in; "subscription" = paid. */
export type Access = "free" | "login" | "subscription";

export interface Preset {
  key: string;
  name: string;
  blurb: string;
  url: string;
  access: Access;
  color: Pastel;
}

// URLs and access checked in a real browser on 2026-10-17. Moviedle was dropped: moviedle.app now serves spam.
export const PRESETS: Preset[] = [
  {
    key: "wordle",
    name: "Wordle",
    blurb: "Guess the five-letter word in six tries.",
    url: "https://www.nytimes.com/games/wordle/index.html",
    access: "login",
    color: "mint",
  },
  {
    key: "connections",
    name: "Connections",
    blurb: "Sort sixteen words into four secret groups.",
    url: "https://www.nytimes.com/games/connections",
    access: "login",
    color: "lavender",
  },
  {
    key: "nyt-mini",
    name: "NYT Mini",
    blurb: "A bite-size crossword, gone in a minute.",
    url: "https://www.nytimes.com/crosswords/game/mini",
    access: "subscription",
    color: "butter",
  },
  {
    key: "nyt-crossword",
    name: "NYT Crossword",
    blurb: "The big daily grid, Monday easy to Saturday tough.",
    url: "https://www.nytimes.com/crosswords/game/daily",
    access: "subscription",
    color: "blue",
  },
  {
    key: "spelling-bee",
    name: "NYT Spelling Bee",
    blurb: "Spin seven letters into as many words as you can.",
    url: "https://www.nytimes.com/puzzles/spelling-bee",
    access: "subscription",
    color: "peach",
  },
  {
    key: "wapo-crossword",
    name: "Washington Post Crossword",
    blurb: "A friendly daily crossword from the Post.",
    url: "https://www.washingtonpost.com/games/crossword/",
    access: "free",
    color: "pink",
  },
  {
    key: "minute-cryptic",
    name: "Minute Cryptic",
    blurb: "One bite-size cryptic clue a day.",
    url: "https://www.minutecryptic.com/",
    access: "free",
    color: "blue",
  },
  {
    key: "globle",
    name: "Globle",
    blurb: "Find the mystery country by getting warmer.",
    url: "https://globle-game.com/",
    access: "free",
    color: "mint",
  },
  {
    key: "bandle",
    name: "Bandle",
    blurb: "Name the song as the band joins in.",
    url: "https://bandle.app/",
    access: "free",
    color: "peach",
  },
  {
    key: "spotle",
    name: "Spotle",
    blurb: "Guess the mystery artist from clues.",
    url: "https://spotle.io/",
    access: "free",
    color: "lavender",
  },
];

export const ACCESS_LABEL: Record<Access, string | null> = {
  free: null,
  login: "May ask to log in",
  subscription: "Subscription",
};

/** A game in someone's list. Presets reference the catalog; custom games carry their own name and URL. */
export type Game =
  | { id: string; kind: "preset"; presetKey: string }
  | { id: string; kind: "custom"; name: string; url: string; color: Pastel };

export interface ResolvedGame {
  id: string;
  name: string;
  url: string;
  color: Pastel;
  access: Access;
  presetKey?: string;
}

export function presetByKey(key: string) {
  return PRESETS.find((p) => p.key === key);
}

export function resolveGame(g: Game): ResolvedGame | null {
  if (g.kind === "custom") {
    return { id: g.id, name: g.name, url: g.url, color: g.color, access: "free" };
  }
  const p = presetByKey(g.presetKey);
  if (!p) return null;
  return { id: g.id, name: p.name, url: p.url, color: p.color, access: p.access, presetKey: p.key };
}

export function resolveGames(games: Game[]): ResolvedGame[] {
  return games.map(resolveGame).filter((g): g is ResolvedGame => g !== null);
}
