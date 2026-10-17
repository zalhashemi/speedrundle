/**
 * Fredoka has no tabular figures, so a ticking timer would jitter in width.
 * This gives every digit the same box; separators keep their natural width.
 */
export function Digits({ children }: { children: string }) {
  return (
    <span className="whitespace-nowrap">
      {[...children].map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} className="digit">
            {ch}
          </span>
        ) : (
          ch
        ),
      )}
    </span>
  );
}
