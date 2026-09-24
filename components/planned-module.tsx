import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { experienceLabels, getModule, levelLabels, type ModuleMeta, type Track } from "@/catalogue";
import { resolveTerm } from "@/glossaries";

/** Shown for modules still in production: the storyboard brief, so the page is useful already. */
export function PlannedModule({
  track,
  module,
  number,
}: {
  track: Track;
  module: ModuleMeta;
  number: number;
}) {
  return (
    <>
      <SiteHeader />
      <main className="page-glow flex-1">
        <div className="mx-auto max-w-3xl px-4 pt-12 pb-24 sm:px-6">
          <Link
            href={`/tracks/${track.slug}`}
            className="text-muted hover:text-fg inline-flex items-center gap-1.5 text-sm"
          >
            <ArrowLeft className="size-4" /> {track.title}
          </Link>
          <p className="text-accent mt-8 font-mono text-sm">
            Module {number} · {levelLabels[module.level]}
          </p>
          <h1 className="mt-1 text-4xl font-semibold tracking-tight">{module.title}</h1>
          <p className="text-muted mt-3 text-lg">{module.summary}</p>

          <section className="border-line bg-surface mt-8 rounded-[var(--radius-card)] border p-6">
            <h2 className="text-subtle text-xs font-medium tracking-wide uppercase">
              In plain words
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed">{module.plain}</p>
            {module.prerequisites && module.prerequisites.length > 0 && (
              <>
                <h2 className="text-subtle mt-5 text-xs font-medium tracking-wide uppercase">
                  Helps to take first
                </h2>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {module.prerequisites.map((slug) => {
                    const p = getModule(track.slug, slug);
                    return p ? (
                      <Link
                        key={slug}
                        href={`/tracks/${track.slug}/${slug}`}
                        className="border-line hover:border-accent rounded-full border px-3 py-1 text-sm"
                      >
                        {p.module.title}
                      </Link>
                    ) : null;
                  })}
                </div>
              </>
            )}
            {module.terms && module.terms.length > 0 && (
              <>
                <h2 className="text-subtle mt-5 text-xs font-medium tracking-wide uppercase">
                  Words you&apos;ll meet
                </h2>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {module.terms.map((id) => (
                    <Link
                      key={id}
                      href={`/tracks/${track.slug}/glossary#${id}`}
                      title={resolveTerm(id, track.slug).entry.definition}
                      className="bg-surface-2 text-muted hover:text-fg rounded-full px-2.5 py-1 text-xs"
                    >
                      {resolveTerm(id, track.slug).entry.term}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </section>

          <div className="rounded-card border-line-strong bg-surface/60 mt-8 border border-dashed p-6">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="text-accent size-4" /> This module is in production
            </p>
            <p className="text-muted mt-2 text-sm">Here&apos;s what it will cover.</p>

            <h2 className="text-subtle mt-6 text-xs font-medium tracking-wide uppercase">
              Centrepiece
            </h2>
            <p className="mt-1.5">{module.signature}</p>

            <h2 className="text-subtle mt-6 text-xs font-medium tracking-wide uppercase">
              You will understand
            </h2>
            <ul className="mt-2 space-y-1.5">
              {module.concepts.map((c) => (
                <li key={c} className="flex gap-2.5 text-sm">
                  <span className="bg-accent mt-2 size-1.5 shrink-0 rounded-full" />
                  {c}
                </li>
              ))}
            </ul>

            <h2 className="text-subtle mt-6 text-xs font-medium tracking-wide uppercase">
              Formats
            </h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {module.formats.map((f) => (
                <span key={f} className="bg-surface-2 text-muted rounded-full px-2.5 py-1 text-xs">
                  {experienceLabels[f]}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
