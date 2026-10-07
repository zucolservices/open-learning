import Link from "next/link";
import { REPO_URL, Wordmark } from "./site-header";

export function SiteFooter() {
  return (
    <footer className="border-line border-t">
      <div className="text-muted mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-8 text-sm sm:px-6">
        <div className="flex items-center gap-2.5">
          <Wordmark className="h-4 w-auto" />
          <span className="bg-line-strong h-4 w-px" aria-hidden />
          <span className="text-fg font-medium">OpenLearning</span>
        </div>
        <nav className="flex gap-4">
          <Link href="/#categories" className="hover:text-fg">
            Categories
          </Link>
          <Link href="/glossary" className="hover:text-fg">
            Glossary
          </Link>
          <Link href="/about" className="hover:text-fg">
            About
          </Link>
          <a href={REPO_URL} className="hover:text-fg">
            GitHub
          </a>
        </nav>
        <p className="text-subtle w-full text-xs sm:ml-auto sm:w-auto">
          © {new Date().getFullYear()} Zucol Services Private Limited
        </p>
      </div>
    </footer>
  );
}
