// Original illustrations. Deliberately not the games' logos, colours or trade dress.
import type { ReactNode } from "react";

const INK = "#2b1b3d";
const s = { stroke: INK, strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Frame({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <svg viewBox="0 0 120 90" className="h-full w-full" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {children}
    </svg>
  );
}

function Wordle() {
  return (
    <Frame>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={10 + i * 20} y={22 + (i % 2) * 4} width="17" height="17" rx="4" fill={i === 2 ? "#fff0a8" : "#fff"} {...s} />
      ))}
      <text x="60.5" y="36" textAnchor="middle" fontFamily="var(--font-fredoka)" fontWeight="700" fontSize="13" fill={INK}>?</text>
      <circle cx="74" cy="58" r="13" fill="#cde7ff" {...s} />
      <path d="M83 67 L96 80" {...s} strokeWidth="6" />
      <path d="M68 53 a8 8 0 0 1 8 -3" {...s} stroke="#fff" strokeWidth="2.5" />
    </Frame>
  );
}

function Connections() {
  const chip = (x: number, y: number, fill: string) => <rect x={x} y={y} width="34" height="20" rx="7" fill={fill} {...s} />;
  return (
    <Frame>
      <path d="M30 34 C 45 50, 75 20, 88 52" fill="none" {...s} strokeDasharray="2 7" />
      {chip(13, 14, "#fff")}
      {chip(71, 14, "#ffd3e6")}
      {chip(13, 52, "#ffd3e6")}
      {chip(71, 52, "#fff")}
      <circle cx="30" cy="34" r="4" fill={INK} />
      <circle cx="88" cy="52" r="4" fill={INK} />
    </Frame>
  );
}

function Grid({ x, y, n, size, blacks, fill = "#fff" }: { x: number; y: number; n: number; size: number; blacks: number[]; fill?: string }) {
  const cells = [];
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) {
      const i = r * n + c;
      cells.push(<rect key={i} x={x + c * size} y={y + r * size} width={size} height={size} fill={blacks.includes(i) ? INK : fill} stroke={INK} strokeWidth="2" />);
    }
  return (
    <g>
      {cells}
      <rect x={x} y={y} width={n * size} height={n * size} fill="none" {...s} rx="2" />
    </g>
  );
}

function NytMini() {
  return (
    <Frame>
      <g transform="rotate(-6 50 45)">
        <Grid x={26} y={18} n={3} size={17} blacks={[0, 8]} />
      </g>
      <path d="M92 14 L80 44 H92 L84 74 L104 38 H92 L100 14 Z" fill="#ffc93c" {...s} />
    </Frame>
  );
}

function NytCrossword() {
  return (
    <Frame>
      <Grid x={14} y={10} n={5} size={14} blacks={[3, 9, 12, 15, 21]} />
      <g transform="rotate(35 92 50)">
        <rect x="85" y="18" width="14" height="52" rx="3" fill="#ffd9c2" {...s} />
        <path d="M85 70 L92 84 L99 70 Z" fill="#fff8ee" {...s} />
        <rect x="85" y="14" width="14" height="9" rx="3" fill="#ffd3e6" {...s} />
      </g>
    </Frame>
  );
}

function SpellingBee() {
  return (
    <Frame>
      <ellipse cx="46" cy="30" rx="14" ry="10" fill="#fff" {...s} transform="rotate(-25 46 30)" />
      <ellipse cx="68" cy="27" rx="14" ry="10" fill="#fff" {...s} transform="rotate(25 68 27)" />
      <ellipse cx="58" cy="52" rx="28" ry="20" fill="#fff0a8" {...s} />
      <path d="M48 34 Q44 52 48 70" fill="none" {...s} strokeWidth="5" />
      <path d="M62 32 Q58 52 62 72" fill="none" {...s} strokeWidth="5" />
      <circle cx="80" cy="47" r="2.5" fill={INK} />
      <path d="M78 56 q4 3 7 -1" fill="none" {...s} strokeWidth="2.5" />
      <path d="M30 52 L22 52" {...s} />
      <path d="M84 33 q4 -10 10 -10" fill="none" {...s} strokeWidth="2.5" />
      <circle cx="96" cy="22" r="3" fill={INK} />
    </Frame>
  );
}

function WapoCrossword() {
  return (
    <Frame>
      <path d="M14 18 H86 V74 H22 a8 8 0 0 1 -8 -8 Z" fill="#fff" {...s} />
      <path d="M86 30 H100 V66 a8 8 0 0 1 -8 8 H86" fill="#ffd3e6" {...s} />
      <path d="M24 28 H76" {...s} strokeWidth="5" />
      <path d="M24 40 H48 M24 50 H48 M24 60 H44" {...s} strokeWidth="2.5" />
      <Grid x={54} y={38} n={3} size={9} blacks={[2, 6]} />
    </Frame>
  );
}

function MinuteCryptic() {
  return (
    <Frame>
      <g transform="rotate(-5 46 45)">
        <rect x="12" y="16" width="62" height="58" rx="8" fill="#fff" {...s} />
        <path d="M22 30 H62 M22 40 H56 M22 50 H48" {...s} strokeWidth="2.5" />
        <text x="44" y="67" fontFamily="var(--font-fredoka)" fontWeight="700" fontSize="12" fill={INK}>(8)</text>
      </g>
      <path d="M84 16 H106 M84 76 H106" {...s} strokeWidth="4" />
      <path d="M87 18 H103 L95 46 L103 74 H87 L95 46 Z" fill="#fff" {...s} strokeWidth="2.75" />
      <path d="M90 26 H100 L95 40 Z" fill="#ffc93c" />
      <path d="M95 60 L100 71 H90 Z" fill="#ffc93c" />
    </Frame>
  );
}

function Globle() {
  return (
    <Frame>
      <circle cx="50" cy="45" r="30" fill="#cde7ff" {...s} />
      <path d="M32 30 q8 -6 14 0 q4 6 -4 10 q-6 4 -4 10 q-8 -2 -10 -10 Z" fill="#c8f0dc" {...s} strokeWidth="2.5" />
      <path d="M56 50 q10 -6 16 2 q2 10 -8 14 q-8 -4 -8 -16 Z" fill="#c8f0dc" {...s} strokeWidth="2.5" />
      <path d="M58 24 q6 -2 8 4" fill="none" {...s} strokeWidth="2.5" />
      <rect x="92" y="14" width="10" height="50" rx="5" fill="#fff" {...s} />
      <circle cx="97" cy="70" r="9" fill="#ffd9c2" {...s} />
      <path d="M97 40 V68" stroke="#f08a5d" strokeWidth="5" strokeLinecap="round" />
    </Frame>
  );
}

function Bandle() {
  return (
    <Frame>
      <ellipse cx="44" cy="44" rx="26" ry="9" fill="#fff" {...s} />
      <path d="M18 44 V68 a26 9 0 0 0 52 0 V44" fill="#ffd9c2" {...s} />
      <path d="M24 52 L34 74 M44 54 L44 77 M64 52 L54 74" {...s} strokeWidth="2.5" />
      <path d="M58 22 L72 38 M76 18 L66 38" {...s} strokeWidth="4" />
      <path d="M92 20 V56" {...s} />
      <path d="M92 20 L106 24 V34 L92 30" fill={INK} {...s} />
      <ellipse cx="86" cy="58" rx="7" ry="5" fill={INK} />
    </Frame>
  );
}

function Spotle() {
  return (
    <Frame>
      <rect x="44" y="10" width="26" height="38" rx="13" fill="#e2d7ff" {...s} />
      <path d="M50 22 H64 M50 30 H64" {...s} strokeWidth="2.5" />
      <path d="M36 38 a21 21 0 0 0 42 0" fill="none" {...s} />
      <path d="M57 59 V74 M45 76 H69" {...s} />
      <path d="M96 20 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 Z" fill="#ffc93c" {...s} strokeWidth="2.5" />
      <path d="M20 48 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" fill="#ffd3e6" {...s} strokeWidth="2.5" />
    </Frame>
  );
}

export function OtherArt() {
  return (
    <Frame>
      <circle cx="60" cy="45" r="28" fill="#fff" {...s} strokeDasharray="6 7" />
      <path d="M60 33 V57 M48 45 H72" {...s} strokeWidth="5" />
    </Frame>
  );
}

const ART: Record<string, () => ReactNode> = {
  wordle: Wordle,
  connections: Connections,
  "nyt-mini": NytMini,
  "nyt-crossword": NytCrossword,
  "spelling-bee": SpellingBee,
  "wapo-crossword": WapoCrossword,
  "minute-cryptic": MinuteCryptic,
  globle: Globle,
  bandle: Bandle,
  spotle: Spotle,
};

/** Art for a preset, or a monogram tile for custom games. */
export function GameArt({ presetKey, name }: { presetKey?: string; name: string }) {
  const A = presetKey ? ART[presetKey] : undefined;
  if (A) return <A />;
  const letter = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <Frame>
      <rect x="38" y="16" width="44" height="58" rx="12" fill="#fff" {...s} transform="rotate(-6 60 45)" />
      <text x="60" y="58" textAnchor="middle" fontFamily="var(--font-fredoka)" fontWeight="700" fontSize="32" fill={INK} transform="rotate(-6 60 45)">
        {letter}
      </text>
    </Frame>
  );
}
