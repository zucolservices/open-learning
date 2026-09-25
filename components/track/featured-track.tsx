import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TrackProgressBar } from "@/components/progress-bits";
import { showcases } from "@/components/track/showcase";
import { trackMinutes, trackModules, type Track } from "@/catalogue";

/** A large card for a built track: summary, chapter list, progress and its hands-on taste. */
export function FeaturedTrack({ track }: { track: Track }) {
  const modules = trackModules(track);
  const live = modules.filter((m) => m.status === "live").length;
  const show = showcases[track.slug];
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
          {live < modules.length ? ` · ${live} live` : ""}
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
      {show?.Taste && (
        <div className="border-line relative flex flex-col justify-center p-4 max-lg:border-t sm:p-6 lg:border-l">
          <p className="text-muted mb-3 text-xs">{show.tasteCaption}</p>
          <show.Taste />
        </div>
      )}
    </article>
  );
}
