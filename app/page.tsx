import Link from "next/link";
import type { ComponentType } from "react";
import { ArrowRight, Play } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContinueCard, TrackProgressBar } from "@/components/progress-bits";
import { LakehouseScene } from "@/components/home/lakehouse-scene";
import { TimeTravel } from "@/components/home/time-travel";
import { ExperienceDemos } from "@/components/home/experience-demos";
import {
  experienceLabels,
  roadmap,
  trackMinutes,
  trackModules,
  visibleTracks,
  type Track,
} from "@/catalogue";

/** Each live track brings its own animated infographic to its home-page card. */
const trackVisuals: Record<string, { Visual: ComponentType; caption: string }> = {
  "data-lakehouse": {
    Visual: TimeTravel,
    caption: "A taste of module 6: time travel on the Delta transaction log. Click any version.",
  },
};

export default function Home() {
  const plannedTracks = roadmap.reduce((n, a) => n + a.tracks.length, 0);
  const liveTracks = visibleTracks.filter((t) => trackModules(t).some((m) => m.status === "live"));
  const liveByTitle = new Map(liveTracks.map((t) => [t.title, t]));
  const moduleCount = visibleTracks.reduce((n, t) => n + trackModules(t).length, 0);

  return (
    <>
      <SiteHeader />
      <main className="flex-1 overflow-x-clip">
        {/* Hero */}
        <section data-track="lakehouse" className="page-glow relative">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:pt-16">
            <div>
              <p className="border-line bg-surface/70 text-muted inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs backdrop-blur">
                <span className="bg-accent size-1.5 animate-pulse rounded-full" />
                Zucol OpenLearning · now live: {liveTracks.map((t) => t.title).join(" · ")}
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
                  href="/tracks/data-lakehouse"
                  className="bg-accent text-accent-fg inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-medium transition hover:brightness-110"
                >
                  Explore the Lakehouse track <ArrowRight className="size-4" />
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
            <LakehouseScene />
          </div>
        </section>

        {/* Live tracks */}
        <section id="tracks" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
          <SectionHeading eyebrow="Tracks" title="Pick a track. Go deep." />
          <div className="mt-8 grid gap-6">
            {visibleTracks.map((track) => (
              <FeaturedTrack key={track.slug} track={track} visual={trackVisuals[track.slug]} />
            ))}
          </div>
        </section>

        {/* Experience types */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionHeading
            eyebrow="How you'll learn"
            title="The format fits the idea."
            body="A 3D model when structure matters. A simulation when trade-offs matter. A broken system when judgement matters. Short explanations sit right next to them."
          />
          <div className="mt-8">
            <ExperienceDemos />
          </div>
        </section>

        {/* Roadmap */}
        <section className="mx-auto max-w-6xl px-4 pt-16 pb-24 sm:px-6">
          <SectionHeading
            eyebrow="Roadmap"
            title={`${plannedTracks} tracks across ${roadmap.length} areas, built one at a time.`}
          />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {roadmap.map(({ area, tracks }) => (
              <div key={area} className="border-line bg-surface/60 rounded-2xl border p-4">
                <p className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold tracking-tight">{area}</span>
                  <span className="text-subtle font-mono text-xs">{tracks.length}</span>
                </p>
                <ul className="mt-2 flex flex-wrap gap-1">
                  {tracks.map((t) => {
                    const live = liveByTitle.get(t);
                    return (
                      <li
                        key={t}
                        data-track={live?.accent}
                        className={
                          live
                            ? "bg-accent text-accent-fg rounded-full px-2 py-0.5 text-[11px] font-medium"
                            : "bg-surface-2 text-muted rounded-full px-2 py-0.5 text-[11px]"
                        }
                      >
                        {live ? `● ${t}` : t}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
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

function FeaturedTrack({
  track,
  visual,
}: {
  track: Track;
  visual?: { Visual: ComponentType; caption: string };
}) {
  const modules = trackModules(track);
  return (
    <article
      data-track={track.accent}
      className="border-line bg-surface shadow-card relative grid overflow-hidden rounded-[var(--radius-card)] border lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
    >
      <div className="page-glow pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative p-6 sm:p-8">
        <p className="text-accent text-sm font-medium">{track.area}</p>
        <h3 className="mt-1 text-3xl font-semibold tracking-tight">{track.title}</h3>
        <p className="text-accent mt-1">{track.tagline}</p>
        <p className="text-muted mt-4 text-sm leading-relaxed">{track.description}</p>
        <p className="text-subtle mt-5 text-xs">
          {track.chapters.length} chapters · {modules.length} modules · ~
          {Math.round(trackMinutes(track) / 60)} hours
        </p>
        <TrackProgressBar track={track.slug} className="mt-2 max-w-sm" />

        <ol className="relative mt-7 grid gap-1">
          <span className="bg-line absolute top-3 bottom-3 left-[11px] w-px" aria-hidden />
          {track.chapters.map((c, i) => (
            <li key={c.slug}>
              <Link
                href={`/tracks/${track.slug}#${c.slug}`}
                className="group hover:bg-surface-2/70 relative flex items-center gap-3 rounded-lg py-1 pr-2"
              >
                <span className="border-line-strong bg-surface group-hover:border-accent group-hover:bg-accent group-hover:text-accent-fg grid size-6 shrink-0 place-items-center rounded-full border font-mono text-[10px] transition-colors">
                  {i + 1}
                </span>
                <span className="group-hover:text-fg text-sm">{c.title}</span>
                <span className="text-subtle ml-auto text-xs">{c.modules.length}</span>
              </Link>
            </li>
          ))}
        </ol>

        <Link
          href={`/tracks/${track.slug}`}
          className="bg-accent text-accent-fg mt-7 inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-medium transition hover:brightness-110"
        >
          Open track <ArrowRight className="size-4" />
        </Link>
      </div>
      {visual && (
        <div className="border-line relative flex flex-col justify-center p-4 max-lg:border-t sm:p-6 lg:border-l">
          <p className="text-muted mb-3 text-xs">{visual.caption}</p>
          <visual.Visual />
        </div>
      )}
    </article>
  );
}
