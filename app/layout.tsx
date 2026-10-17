import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { Footer } from "@/components/Footer";
import { APP_NAME } from "@/lib/config";
import "./globals.css";

const fredoka = Fredoka({ variable: "--font-fredoka", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });

export const metadata: Metadata = {
  // Netlify sets URL at build time; link previews need an absolute base.
  metadataBase: new URL(process.env.URL ?? "http://localhost:4310"),
  title: { default: `${APP_NAME}: speedrun your daily puzzles`, template: `%s · ${APP_NAME}` },
  description: "Pick your daily puzzle games, then play them back to back while Speedrundle times every split.",
};

export const viewport: Viewport = {
  themeColor: "#fff8ee",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
