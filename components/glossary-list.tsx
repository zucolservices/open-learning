import Link from "next/link";
import { getModule } from "@/catalogue";
import type { GlossaryEntry } from "@/glossaries";

/** An alphabetical, anchor-linked list of glossary entries. */
export function GlossaryList({
  entries,
  track,
  idPrefix = "",
}: {
  entries: [string, GlossaryEntry][];
  /** Track whose modules `module` refers to (shared entries carry their own). */
  track?: string;
  idPrefix?: string;
}) {
  const letters = [...new Set(entries.map(([, e]) => e.term[0].toUpperCase()))];
  return (
    <>
      <nav aria-label="Letters" className="flex flex-wrap gap-1">
        {letters.map((l) => (
          <a
            key={l}
            href={`#${idPrefix}letter-${l}`}
            className="border-line hover:border-accent hover:text-accent grid size-8 place-items-center rounded-lg border font-mono text-xs"
          >
            {l}
          </a>
        ))}
      </nav>
      <dl className="mt-6 grid gap-3">
        {entries.map(([id, e], i) => {
          const letter = e.term[0].toUpperCase();
          const first = i === 0 || entries[i - 1][1].term[0].toUpperCase() !== letter;
          const owner = e.track ?? track;
          const taught = e.module && owner ? getModule(owner, e.module) : undefined;
          return (
            <div key={id} id={id} className="scroll-mt-20">
              {first && (
                <p
                  id={`${idPrefix}letter-${letter}`}
                  className="text-accent mt-6 mb-2 scroll-mt-20 font-mono text-sm"
                >
                  {letter}
                </p>
              )}
              <div className="border-line bg-surface rounded-2xl border p-4">
                <dt className="font-semibold tracking-tight">{e.term}</dt>
                <dd className="text-muted mt-1 leading-relaxed">{e.definition}</dd>
                {e.analogy && (
                  <dd className="text-muted mt-2 text-sm">
                    <span className="text-fg font-medium">Think of it as: </span>
                    {e.analogy}
                  </dd>
                )}
                {taught && (
                  <dd className="mt-2 text-sm">
                    <Link
                      href={`/tracks/${taught.track.slug}/${taught.module.slug}`}
                      className="text-accent hover:underline"
                    >
                      Learn it in “{taught.module.title}” →
                    </Link>
                  </dd>
                )}
              </div>
            </div>
          );
        })}
      </dl>
    </>
  );
}
