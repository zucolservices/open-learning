import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  categories,
  categoryTracks,
  trackMinutes,
  trackModules,
  type Category,
  type Track,
} from "@/catalogue";
import { CategoryIcon } from "@/components/category/category-icon";
import { TrackProgressBar } from "@/components/progress-bits";
import { ModuleArt } from "@/components/track/module-art";

/** The whole catalogue on one page: live tracks grouped by category, then what's still to come. */
export function Catalogue() {
  const live = categories.filter((c) => categoryTracks(c).length > 0);
  const upcoming = categories.filter((c) => categoryTracks(c).length === 0);
  return (
    <div>
      <nav
        aria-label="Jump to a category"
        className="bg-bg/80 border-line sticky top-14 z-30 -mx-4 mb-8 flex gap-1.5 overflow-x-auto border-b px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-full sm:border sm:px-2 sm:py-2"
      >
        {live.map((c) => (
          <a
            key={c.slug}
            href={`#cat-${c.slug}`}
            data-track={c.accent}
            className="text-muted hover:text-fg hover:bg-surface-2 inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs transition"
          >
            <span className="bg-accent size-1.5 rounded-full" />
            {c.title}
          </a>
        ))}
        <a
          href="#cat-roadmap"
          className="text-muted hover:text-fg hover:bg-surface-2 inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs transition"
        >
          On the roadmap
        </a>
      </nav>

      <div className="flex flex-col gap-16">
        {live.map((c) => (
          <CategoryGroup key={c.slug} category={c} />
        ))}
      </div>

      <div id="cat-roadmap" className="mt-20 scroll-mt-32">
        <h3 className="text-2xl font-semibold tracking-tight">On the roadmap</h3>
        <p className="text-muted mt-2 max-w-2xl text-sm text-pretty">
          Tracks still to come. We build them one at a time, and each one goes through the same
          fact-checking and design as the live tracks.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((c) => (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              className="group border-line hover:border-line-strong rounded-2xl border border-dashed p-4 transition"
            >
              <div className="flex items-center gap-2.5">
                <span className="bg-surface-2 text-muted grid size-8 place-items-center rounded-lg">
                  <CategoryIcon slug={c.slug} className="size-4" />
                </span>
                <p className="group-hover:text-fg text-sm font-semibold tracking-tight">
                  {c.title}
                </p>
              </div>
              <p className="text-muted mt-2 text-xs">{c.tracks.map((t) => t.title).join(" · ")}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryGroup({ category: c }: { category: Category }) {
  const tracks = categoryTracks(c);
  const soon = c.tracks.filter((t) => !tracks.some((x) => x.slug === t.slug));
  return (
    <section id={`cat-${c.slug}`} data-track={c.accent} className="scroll-mt-32">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="bg-accent text-accent-fg grid size-10 shrink-0 place-items-center rounded-xl">
            <CategoryIcon slug={c.slug} className="size-5" />
          </span>
          <div>
            <h3 className="text-xl font-semibold tracking-tight">{c.title}</h3>
            <p className="text-muted text-sm">{c.summary}</p>
          </div>
        </div>
        <Link
          href={`/categories/${c.slug}`}
          className="text-muted hover:text-accent inline-flex items-center gap-1 text-xs font-medium"
        >
          {tracks.length} of {c.tracks.length} live <ArrowRight className="size-3.5" />
        </Link>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tracks.map((t) => (
          <TrackCard key={t.slug} track={t} />
        ))}
        {soon.length > 0 && (
          <div className="border-line text-muted flex flex-col justify-center rounded-2xl border border-dashed p-5 text-sm">
            <p className="text-subtle text-xs font-medium tracking-wide uppercase">Coming next</p>
            <ul className="mt-2 space-y-1">
              {soon.map((t) => (
                <li key={t.title}>
                  <span className="text-fg">{t.title}</span>{" "}
                  <span className="text-subtle text-xs">· {t.blurb}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function TrackCard({ track: t }: { track: Track }) {
  const mods = trackModules(t);
  // First, middle and last module: a glimpse of the journey through the track.
  const picks = [mods[0], mods[Math.floor(mods.length / 2)], mods[mods.length - 1]];
  return (
    <Link
      href={`/tracks/${t.slug}`}
      data-track={t.accent}
      className="group border-line bg-surface hover:border-accent/60 hover:shadow-card relative flex flex-col overflow-hidden rounded-2xl border transition hover:-translate-y-0.5"
    >
      <div className="border-line bg-surface-2/50 relative hidden grid-cols-3 gap-1.5 border-b p-2.5 sm:grid">
        <div className="page-glow pointer-events-none absolute inset-0 opacity-70" />
        {picks.map((m) => (
          <div
            key={m.slug}
            className="border-line bg-surface relative aspect-[16/10] overflow-hidden rounded-md border p-0.5"
          >
            <ModuleArt slug={m.slug} track={t.slug} />
          </div>
        ))}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="group-hover:text-accent font-semibold tracking-tight">{t.title}</p>
        <p className="text-muted mt-1 line-clamp-2 text-sm">{t.tagline}</p>
        <div className="mt-auto pt-4">
          <div className="text-subtle flex items-center justify-between text-[11px]">
            <span>
              {mods.length} modules · ~{Math.round(trackMinutes(t) / 60)} hours
            </span>
            <ArrowRight className="group-hover:text-accent size-3.5 transition group-hover:translate-x-0.5" />
          </div>
          <TrackProgressBar track={t.slug} className="mt-1.5" />
        </div>
      </div>
    </Link>
  );
}
