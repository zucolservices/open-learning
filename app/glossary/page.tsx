import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GlossaryList } from "@/components/glossary-list";
import { visibleTracks } from "@/catalogue";
import { sharedTerms, trackGlossaries, trackTerms } from "@/glossaries";

export const metadata = { title: "Glossary" };

/** Glossary hub: one glossary per track, plus the shared general terms. */
export default function GlossaryHub() {
  const withGlossary = visibleTracks.filter((t) => trackGlossaries[t.slug]);
  return (
    <div data-track="lakehouse" className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="page-glow flex-1">
        <div className="mx-auto max-w-3xl px-4 pt-14 pb-24 sm:px-6">
          <h1 className="text-4xl font-semibold tracking-tight">Glossary</h1>
          <p className="text-muted mt-3 text-lg text-pretty">
            Each track has its own glossary, because the same word can mean different things in
            different fields. General terms used everywhere are listed below.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {withGlossary.map((t) => (
              <Link
                key={t.slug}
                href={`/tracks/${t.slug}/glossary`}
                data-track={t.accent}
                className="group border-line bg-surface shadow-card hover:border-accent/60 rounded-2xl border p-5 transition"
              >
                <p className="text-accent text-xs font-medium">{t.area}</p>
                <p className="mt-1 flex items-center justify-between gap-2 font-semibold tracking-tight">
                  {t.title}
                  <ArrowUpRight className="text-subtle group-hover:text-accent size-4" />
                </p>
                <p className="text-muted mt-1 text-sm">{trackTerms(t.slug).length} terms</p>
              </Link>
            ))}
          </div>

          <section className="mt-14">
            <h2 className="text-sm font-medium">
              General terms <span className="text-subtle">· shared by every track</span>
            </h2>
            <div className="mt-4">
              <GlossaryList entries={sharedTerms()} />
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
