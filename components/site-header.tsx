import Image from "next/image";
import Link from "next/link";
import { Code } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export const REPO_URL = "https://github.com/zucolservices/open-learning";

export function SiteHeader() {
  return (
    <header className="border-line bg-bg/70 sticky top-0 z-40 border-b backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:gap-6 sm:px-6">
        <Link href="/" aria-label="OpenLearning home" className="flex items-center gap-2.5">
          <Wordmark className="h-[18px] w-auto" />
          <span className="bg-line-strong h-5 w-px" aria-hidden />
          <span className="font-semibold tracking-tight">OpenLearning</span>
        </Link>
        <nav className="text-muted flex items-center gap-3 text-sm sm:gap-4">
          <Link href="/#categories" className="hover:text-fg">
            Categories
          </Link>
          <Link href="/glossary" className="hover:text-fg max-[420px]:hidden">
            Glossary
          </Link>
          <Link href="/about" className="hover:text-fg max-sm:hidden">
            About
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <a
            href={REPO_URL}
            aria-label="Source code on GitHub"
            title="Source code on GitHub"
            className="text-muted hover:text-fg hover:bg-surface-2 grid size-9 place-items-center rounded-full transition"
          >
            <Code className="size-4" />
          </a>
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
