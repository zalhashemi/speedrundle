import Link from "next/link";
import { APP_NAME } from "@/lib/config";

export function Wordmark({ href = "/dashboard" }: { href?: string }) {
  return (
    <Link href={href} className="font-display inline-flex items-center gap-2 text-[1.45rem] font-bold no-underline">
      <svg viewBox="0 0 40 40" className="size-9" aria-hidden="true">
        <rect x="16" y="2" width="8" height="6" rx="2" fill="#ffc93c" stroke="#2b1b3d" strokeWidth="2.5" />
        <circle cx="20" cy="23" r="14" fill="#cde7ff" stroke="#2b1b3d" strokeWidth="3" />
        <path d="M20 23 L20 14 M20 23 L26 26" stroke="#2b1b3d" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span>
        {APP_NAME.slice(0, 5)}
        <span className="text-[#7a4fd6]">{APP_NAME.slice(5)}</span>
      </span>
    </Link>
  );
}
