import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center text-center max-w-4xl">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl sm:text-6xl font-bold text-foreground">
            Qrunchy
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl">
            Transform your restaurant menu into a beautiful digital experience
            with just a QR code
          </p>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-sm text-foreground/60">
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/about"
        >
          About
        </Link>

        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/contact"
        >
          Contact
        </Link>
        <span>© {new Date().getFullYear()} Qrunchy</span>
      </footer>
    </div>
  );
}
