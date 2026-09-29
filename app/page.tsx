import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContinueCard } from "@/components/progress-bits";
import { ExperienceDemos } from "@/components/home/experience-demos";
import { LiveTracks } from "@/components/home/live-tracks";
import { TrackSpotlight } from "@/components/home/track-spotlight";
import { CategoryIcon } from "@/components/category/category-icon";
import {
  categories,
  categoryTracks,
  experienceLabels,
  getTrack,
  trackModules,
  visibleTracks,
  type Category,
} from "@/catalogue";
import { cn } from "@/lib/cn";

export default function Home() {
  const liveTracks = visibleTracks.filter((t) => trackModules(t).some((m) => m.status === "live"));
  const plannedTracks = categories.reduce((n, c) => n + c.tracks.length, 0);
  const moduleCount = liveTracks.reduce(
    (n, t) => n + trackModules(t).filter((m) => m.status === "live").length,
    0,
  );

  return (
    <>
      <SiteHeader />
      <main className="flex-1 overflow-x-clip">
        {/* Hero */}
        <section data-track="blueprint" className="page-glow relative">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:pt-16">
            <div>
              <p className="border-line bg-surface/70 text-muted inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs backdrop-blur">
                <span className="bg-accent size-1.5 animate-pulse rounded-full" />
                OpenLearning · {liveTracks.length} tracks live, more on the way
              </p>
              <h1 className="mt-5 text-5xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl">
                See how technology{" "}
                <span className="from-accent via-viz-data to-viz-meta bg-gradient-to-r bg-clip-text text-transparent">
                  actually works.
                </span>
              </h1>
              <p className="text-muted mt-5 max-w-lg text-lg text-pretty">
                Don&apos;t just read about systems. Take them apart, run them, break them and fix
                them. Every module is a hands-on experience built around one idea.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="#live"
                  className="bg-accent text-accent-fg inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-medium transition hover:brightness-110"
                >
                  See the live tracks <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/tracks/playground/rows-vs-columns"
                  className="border-line-strong hover:bg-surface inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium transition"
                >
                  <Play className="size-3.5" /> Try a 5-minute sample
                </Link>
              </div>
              <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
                {[
                  [String(moduleCount), "interactive modules"],
                  [String(Object.keys(experienceLabels).length), "ways to learn"],
                  ["0", "exams. Just understanding."],
                ].map(([n, label]) => (
                  <div key={label}>
                    <dt className="text-3xl font-semibold tracking-tight tabular-nums">{n}</dt>
                    <dd className="text-muted mt-0.5 text-xs">{label}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 max-w-md">
                <ContinueCard />
              </div>
            </div>

            <TrackSpotlight tracks={liveTracks} />
          </div>
        </section>

        {/* Live tracks */}
        <section id="live" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-4 pb-8 sm:px-6">
          <SectionHeading
            eyebrow="Live tracks"
            title={`${liveTracks.length} tracks you can start today.`}
            body="Each track is a path of short, hands-on modules. Take them in order or dip in anywhere."
          />
          <div className="mt-8">
            <LiveTracks tracks={liveTracks} />
          </div>
        </section>

        {/* Categories */}
        <section id="categories" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
          <SectionHeading
            eyebrow="Categories"
            title={`${plannedTracks} tracks across ${categories.length} categories, built one at a time.`}
            body="Pick a category to see its tracks. Live tracks open straight away; the rest are on the way."
          />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {[...categories]
              .sort(
                (x, y) =>
                  Number(categoryTracks(y).length > 0) - Number(categoryTracks(x).length > 0),
              )
              .map((c) => (
                <CategoryCard key={c.slug} category={c} />
              ))}
          </div>
        </section>

        {/* Experience types */}
        <section className="mx-auto max-w-6xl px-4 pt-8 pb-24 sm:px-6">
          <SectionHeading
            eyebrow="How you'll learn"
            title="The format fits the idea."
            body="A 3D model when structure matters. A simulation when trade-offs matter. A broken system when judgement matters. Short explanations sit right next to them."
          />
          <div className="mt-8">
            <ExperienceDemos />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-muted text-sm font-medium">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {body && <p className="text-muted mt-3 text-pretty">{body}</p>}
    </div>
  );
}

function CategoryCard({ category: c }: { category: Category }) {
  const live = categoryTracks(c).length;
  const active = live > 0;
  return (
    <article
      data-track={c.accent}
      className={cn(
        "bg-surface relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border p-4 transition sm:p-5",
        active ? "border-accent/50 shadow-card" : "border-line",
      )}
    >
      {active && <div className="page-glow pointer-events-none absolute inset-0 opacity-50" />}
      <Link
        href={`/categories/${c.slug}`}
        className="group relative flex flex-col items-start gap-2 sm:flex-row sm:gap-3"
      >
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-xl sm:size-10",
            active ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted",
          )}
        >
          <CategoryIcon slug={c.slug} className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="group-hover:text-accent text-sm font-semibold tracking-tight sm:text-base">
            {c.title}
          </h3>
          <p className="text-muted hidden text-xs sm:block">{c.summary}</p>
        </div>
        <ArrowRight className="text-subtle group-hover:text-accent mt-1 hidden size-4 shrink-0 transition sm:block" />
      </Link>
      <div className="relative mt-3 flex items-center gap-2 sm:mt-4">
        <div className="bg-surface-2 h-1 flex-1 overflow-hidden rounded-full">
          <div
            className="bg-accent h-full rounded-full"
            style={{ width: `${(live / c.tracks.length) * 100}%` }}
          />
        </div>
        <span className="text-subtle shrink-0 text-[11px]">
          {live} of {c.tracks.length} live
        </span>
      </div>
      <ul className="relative mt-3 hidden flex-wrap gap-1 sm:flex">
        {c.tracks.map((t) => {
          const built = t.slug ? getTrack(t.slug) : undefined;
          const track =
            built && trackModules(built).some((m) => m.status === "live") ? built : undefined;
          return (
            <li key={t.title}>
              {track ? (
                <Link
                  href={`/tracks/${track.slug}`}
                  className="bg-accent text-accent-fg inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium transition hover:brightness-110"
                >
                  ● {t.title}
                </Link>
              ) : (
                <span className="bg-surface-2 text-muted inline-flex rounded-full px-2 py-0.5 text-[11px]">
                  {t.title}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </article>
  );
}
