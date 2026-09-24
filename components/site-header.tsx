import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="border-line bg-bg/70 sticky top-0 z-40 border-b backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:gap-6 sm:px-6">
        <Link href="/" aria-label="Zucol OpenLearning home" className="flex items-center gap-2.5">
          <Wordmark className="h-[18px] w-auto" />
          <span className="bg-line-strong h-5 w-px" aria-hidden />
          <span className="font-semibold tracking-tight">OpenLearning</span>
        </Link>
        <nav className="text-muted flex items-center gap-3 text-sm sm:gap-4">
          <Link href="/#tracks" className="hover:text-fg">
            Tracks
          </Link>
          <Link href="/glossary" className="hover:text-fg">
            Glossary
          </Link>
          <Link href="/about" className="hover:text-fg max-sm:hidden">
            About
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

/** The Zucol wordmark, in a light-theme and a dark-theme version. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <>
      <Image
        src="/logo/zucol/zucol-wordmark.svg"
        alt="Zucol"
        width={76}
        height={22}
        priority
        className={`dark:hidden ${className ?? ""}`}
      />
      <Image
        src="/logo/zucol/zucol-wordmark-dark.svg"
        alt="Zucol"
        width={76}
        height={22}
        priority
        className={`hidden dark:block ${className ?? ""}`}
      />
    </>
  );
}
