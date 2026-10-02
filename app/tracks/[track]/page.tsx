import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ModuleStatusBadge, TrackProgressBar } from "@/components/progress-bits";
import { ChapterMap, TrackCta } from "@/components/track/chapter-map";
import { ModuleArt } from "@/components/track/module-art";
import { showcases } from "@/components/track/showcase";
import {
  experienceLabels,
  levelLabels,
  getCategory,
  getTrack,
  trackMinutes,
  trackModules,
  tracks,
  type ModuleMeta,
  type Track,
} from "@/catalogue";
import { cn } from "@/lib/cn";

export const dynamicParams = false;

export function generateStaticParams() {
  return tracks.map((t) => ({ track: t.slug }));
}

export async function generateMetadata(props: PageProps<"/tracks/[track]">) {
  const { track } = await props.params;
  return { title: getTrack(track)?.title };
}

export default async function TrackPage(props: PageProps<"/tracks/[track]">) {
  const { track: slug } = await props.params;
  const track = getTrack(slug);
  if (!track) notFound();

  const modules = trackModules(track);
  const numberOf = (s: string) => modules.findIndex((m) => m.slug === s) + 1;
  const live = modules.filter((m) => m.status === "live");
  const category = getCategory(track.category);
  const show = showcases[track.slug];

  return (
    <div data-track={track.accent} className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="page-glow">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-14 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <div>
              <nav
                aria-label="Breadcrumb"
                className="text-muted flex flex-wrap items-center gap-1.5 text-sm"
              >
                <Link href="/#categories" className="hover:text-fg">
                  Categories
                </Link>
                <span aria-hidden>/</span>
                {category ? (
                  <Link
                    href={`/categories/${category.slug}`}
                    className="text-accent font-medium hover:underline"
                  >
                    {category.title}
                  </Link>
                ) : (
                  <span className="text-accent font-medium">{track.area}</span>
                )}
              </nav>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                {track.title}
              </h1>
              <p className="text-accent mt-2 text-lg">{track.tagline}</p>
              <p className="text-muted mt-4 text-pretty">{track.description}</p>
              <dl className="mt-7 grid grid-cols-4 gap-3">
                {[
                  [track.chapters.length, "chapters"],
                  [modules.length, "modules"],
                  [`~${Math.round(trackMinutes(track) / 60)}h`, "of learning"],
                  [live.length, "live now"],
                ].map(([n, label]) => (
                  <div key={label as string}>
                    <dt className="text-2xl font-semibold tracking-tight tabular-nums">{n}</dt>
                    <dd className="text-muted text-xs">{label}</dd>
                  </div>
                ))}
              </dl>
              <TrackProgressBar track={track.slug} className="mt-5 max-w-sm" />
              <div className="mt-7">
                <TrackCta
                  track={track}
                  firstLive={live.find((m) => m.slug !== modules[0].slug)?.slug}
                />
              </div>
              <p className="text-subtle mt-4 text-xs">
                Take modules in any order. The route suggests one that builds up naturally.
              </p>
            </div>
            <div className="border-line bg-surface/70 shadow-card rounded-[var(--radius-card)] border p-4 backdrop-blur sm:p-6">
              <ChapterMap track={track} />
            </div>
          </div>
        </section>

        {show && (
          <section className="mx-auto max-w-6xl px-4 pt-4 pb-8 sm:px-6">
            <p className="text-muted text-sm font-medium">Take a look inside</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              The big picture, before the details
            </h2>
            <div
              className={cn(
                "mt-6 grid gap-5",
                show.Taste &&
                  show.Taste !== show.Scene &&
                  "lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]",
              )}
            >
              <div className="border-line bg-surface shadow-card rounded-[var(--radius-card)] border p-4 sm:p-6">
                <p className="text-muted mb-3 text-xs">{show.sceneCaption}</p>
                <show.Scene />
              </div>
              {show.Taste && show.Taste !== show.Scene && (
                <div className="border-line bg-surface shadow-card flex flex-col justify-center rounded-[var(--radius-card)] border p-4 sm:p-6">
                  <p className="text-muted mb-3 text-xs">{show.tasteCaption}</p>
                  <show.Taste />
                </div>
              )}
            </div>
          </section>
        )}

        {/* Chapters */}
        <div className="mx-auto max-w-6xl space-y-16 px-4 pt-6 pb-24 sm:px-6">
          <NewHere track={track} />
          {track.chapters.map((chapter, ci) => (
            <section key={chapter.slug} id={chapter.slug} className="scroll-mt-20">
              <div className="border-line flex flex-wrap items-end gap-x-6 gap-y-2 border-b pb-4">
                <span className="text-accent/70 font-mono text-4xl font-semibold tracking-tight tabular-nums">
                  {String(ci + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-semibold tracking-tight">{chapter.title}</h2>
                  <p className="text-muted mt-0.5 text-sm">{chapter.summary}</p>
                </div>
                <p className="text-subtle text-xs">
                  {chapter.modules.length} module{chapter.modules.length > 1 ? "s" : ""} ·{" "}
                  {chapter.modules.reduce((n, m) => n + m.minutes, 0)} min
                </p>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {chapter.modules.map((m) => (
                  <ModuleCard key={m.slug} track={track} module={m} number={numberOf(m.slug)} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function ModuleCard({
  track,
  module: m,
  number,
}: {
  track: Track;
  module: ModuleMeta;
  number: number;
}) {
  const isLive = m.status === "live";
  return (
    <Link
      href={`/tracks/${track.slug}/${m.slug}`}
      className={cn(
        "group bg-surface shadow-card flex flex-col overflow-hidden rounded-[var(--radius-card)] border transition hover:-translate-y-0.5",
        isLive ? "border-accent/50 hover:border-accent" : "border-line hover:border-line-strong",
      )}
    >
      <div
        className={cn(
          "dot-grid border-line relative h-36 border-b p-3",
          isLive && "bg-accent-soft",
        )}
      >
        <ModuleArt slug={m.slug} track={track.slug} />
        <span className="bg-bg/80 text-muted absolute top-3 left-3 rounded-full px-2 py-0.5 font-mono text-[11px] backdrop-blur">
          {String(number).padStart(2, "0")}
        </span>
        <span
          className={cn(
            "absolute top-3 right-3 rounded-full px-2 py-0.5 text-[11px] font-medium backdrop-blur",
            isLive ? "bg-accent text-accent-fg" : "bg-bg/80 text-subtle",
          )}
        >
          {isLive ? "Live" : "In production"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-subtle text-[11px] font-medium tracking-wide uppercase">
              {levelLabels[m.level]}
            </p>
            <h3 className="group-hover:text-accent font-semibold tracking-tight">{m.title}</h3>
          </div>
          <ModuleStatusBadge track={track.slug} module={m.slug} />
        </div>
        <p className="text-muted mt-1.5 text-sm">{m.summary}</p>
        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-4">
          <span className="text-subtle mr-1 flex items-center gap-1 text-xs">
            <Clock className="size-3" /> {m.minutes} min
          </span>
          {m.formats
            .filter((f) => f !== "checkpoint")
            .slice(0, 2)
            .map((f) => (
              <span
                key={f}
                className="bg-surface-2 text-muted rounded-full px-2 py-0.5 text-[11px]"
              >
                {experienceLabels[f]}
              </span>
            ))}
        </div>
      </div>
    </Link>
  );
}

function NewHere({ track }: { track: Track }) {
  const first = track.chapters[0].modules[0];
  return (
    <aside className="border-accent/40 bg-accent-soft grid gap-4 rounded-[var(--radius-card)] border p-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:p-6">
      <span className="bg-accent text-accent-fg grid size-11 place-items-center rounded-full text-lg font-semibold">
        ?
      </span>
      <div>
        <p className="font-semibold tracking-tight">New to all this? Start here.</p>
        <p className="text-muted mt-1 text-sm text-pretty">
          No background needed. Module 1, &ldquo;{first.title}&rdquo;, starts from zero, in plain
          words. Every module lists its key terms, and suggests what to take first.
          Dotted-underlined words explain themselves when you hover or tap them.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/tracks/${track.slug}/${first.slug}`}
          className="bg-accent text-accent-fg inline-flex h-10 items-center rounded-full px-4 text-sm font-medium"
        >
          Start module 1
        </Link>
        <Link
          href={`/tracks/${track.slug}/glossary`}
          className="border-line-strong hover:bg-surface inline-flex h-10 items-center rounded-full border px-4 text-sm"
        >
          Glossary
        </Link>
      </div>
    </aside>
  );
}
