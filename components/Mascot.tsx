const INK = "#2b1b3d";
const s = { stroke: INK, strokeWidth: 3.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

type Mood = "happy" | "cheer" | "focus";

/** Splitty: an original stopwatch character who runs your splits. */
export function Mascot({ mood = "happy", className = "" }: { mood?: Mood; className?: string }) {
  return (
    <svg viewBox="0 0 160 170" className={className} aria-hidden="true">
      {/* legs */}
      <path d="M64 128 L54 152" {...s} fill="none" />
      <path d="M96 128 L110 148" {...s} fill="none" />
      <path d="M40 154 q2 -10 16 -6 l4 6 Z" fill="#ffd3e6" {...s} />
      <path d="M104 150 q6 -10 18 -4 l0 7 Z" fill="#ffd3e6" {...s} />
      {/* arms */}
      {mood === "cheer" ? (
        <>
          <path d="M34 82 L16 52" {...s} fill="none" />
          <path d="M126 82 L144 52" {...s} fill="none" />
          <circle cx="15" cy="49" r="6" fill="#fff" {...s} strokeWidth="3" />
          <circle cx="145" cy="49" r="6" fill="#fff" {...s} strokeWidth="3" />
        </>
      ) : (
        <>
          <path d="M34 90 L16 104" {...s} fill="none" />
          <path d="M126 86 L146 72" {...s} fill="none" />
          <circle cx="14" cy="106" r="6" fill="#fff" {...s} strokeWidth="3" />
          <circle cx="148" cy="70" r="6" fill="#fff" {...s} strokeWidth="3" />
        </>
      )}
      {/* crown + side button */}
      <rect x="70" y="10" width="20" height="14" rx="4" fill="#ffc93c" {...s} />
      <path d="M80 24 V32" {...s} />
      <path d="M118 36 l10 -10" {...s} strokeWidth="7" />
      {/* body */}
      <circle cx="80" cy="84" r="52" fill="#fff" {...s} />
      <circle cx="80" cy="84" r="42" fill="#cde7ff" {...s} strokeWidth="3" />
      {/* tick marks */}
      {[0, 90, 180, 270].map((a) => (
        <path key={a} d="M80 46 V52" {...s} strokeWidth="3" transform={`rotate(${a} 80 84)`} />
      ))}
      {/* face */}
      {mood === "focus" ? (
        <>
          <path d="M62 78 h10 M88 78 h10" {...s} />
          <path d="M70 100 h20" {...s} />
        </>
      ) : (
        <>
          <ellipse cx="66" cy="78" rx="5" ry="6.5" fill={INK} />
          <ellipse cx="94" cy="78" rx="5" ry="6.5" fill={INK} />
          <circle cx="68" cy="75.5" r="1.8" fill="#fff" />
          <circle cx="96" cy="75.5" r="1.8" fill="#fff" />
          <path d={mood === "cheer" ? "M66 94 q14 18 28 0 Z" : "M68 96 q12 10 24 0"} {...s} fill={mood === "cheer" ? "#ffd3e6" : "none"} />
        </>
      )}
      <ellipse cx="56" cy="92" rx="7" ry="4" fill="#ffd3e6" />
      <ellipse cx="104" cy="92" rx="7" ry="4" fill="#ffd3e6" />
    </svg>
  );
}
