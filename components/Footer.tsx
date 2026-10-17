import Link from "next/link";
import { S } from "@/lib/strings";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-2xl px-4 pt-10 pb-8 text-center text-sm text-ink-soft">
      <p>{S.footer.disclaimer}</p>
      <p className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
        <span>{S.footer.local}</span>
        <Link href="/about" className="underline">
          {S.footer.about}
        </Link>
      </p>
    </footer>
  );
}
