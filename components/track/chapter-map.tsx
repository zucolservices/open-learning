"use client";

import { useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { ArrowRight, Play } from "lucide-react";
import { getModule, type Track } from "@/catalogue";
import { useProgress } from "@/lib/progress-adapter";
import { cn } from "@/lib/cn";

/** Nine stations along a winding route: the track at a glance. */

const STATIONS: [number, number][] = [
  [70, 56],
  [270, 56],
  [470, 56],
  [470, 156],
  [270, 156],
  [70, 156],
  [70, 256],
  [270, 256],
  [470, 256],
];
const ROUTE = "M70 56 L470 56 C535 56 535 156 470 156 L70 156 C5 156 5 256 70 256 L470 256";

export function ChapterMap({ track }: { track: Track }) {
  const hydrated = useProgress((s) => s.hydrated);
  const saved = useProgress((s) => s.tracks[track.slug]);
  const reduced = useReducedMotion();
  const [hover, setHover] = useState<number>();

  return (
    <div className="relative">
      <svg
        viewBox="0 0 540 310"
        className="h-auto w-full"
        role="img"
        aria-label={`${track.title}: ${track.chapters.length} chapters`}
      >
        <path
          d={ROUTE}
          fill="none"
          className="stroke-line-strong"
          strokeWidth={10}
          strokeLinecap="round"
        />
        <path
          d={ROUTE}
          fill="none"
          className="stroke-accent/50"
          strokeWidth={2}
          strokeDasharray="2 8"
          strokeLinecap="round"
        />
        {!reduced && (
          <circle r={5} className="fill-accent">
            <animateMotion dur="14s" repeatCount="indefinite" path={ROUTE} />
          </circle>
        )}

        {track.chapters.map((chapter, i) => {
          const [x, y] = STATIONS[i] ?? [0, 0];
          const done = hydrated
            ? chapter.modules.filter((m) => saved?.[m.slug]?.status === "completed").length
            : 0;
          const started = hydrated && chapter.modules.some((m) => saved?.[m.slug]);
          const complete = done === chapter.modules.length;
          const live = chapter.modules.filter((m) => m.status === "live").length;
          const on = hover === i;
          return (
            <a
              key={chapter.slug}
              href={`#${chapter.slug}`}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(undefined)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(undefined)}
            >
              <g
                style={{
                  transform: `translate(${x}px, ${y}px) scale(${on ? 1.12 : 1})`,
                  transition: "transform .3s cubic-bezier(.2,.8,.2,1)",
                }}
              >
                <circle
                  r={24}
                  className={cn(
                    "transition-colors",
                    complete ? "fill-accent" : started ? "fill-accent-soft" : "fill-surface",
                  )}
                />
                <circle
                  r={24}
                  fill="none"
                  className={on || started ? "stroke-accent" : "stroke-line-strong"}
                  strokeWidth={2}
                />
                {/* progress ring */}
                {done > 0 && !complete && (
                  <circle
                    r={24}
                    fill="none"
                    className="stroke-accent"
                    strokeWidth={4}
                    strokeDasharray={`${(done / chapter.modules.length) * 150.8} 150.8`}
                    transform="rotate(-90)"
                  />
                )}
                <text
                  y={5}
                  textAnchor="middle"
                  className={cn(
                    "font-mono text-[15px] font-semibold",
                    complete ? "fill-accent-fg" : "fill-fg",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </text>
                {live > 0 && (
                  <circle
                    cx={18}
                    cy={-18}
                    r={5}
                    className="fill-viz-add stroke-surface"
                    strokeWidth={2}
                  />
                )}
              </g>
              <text
                x={x}
                y={y + 44}
                textAnchor="middle"
                className={cn(
                  "text-[13px] font-medium transition-colors",
                  on ? "fill-accent" : "fill-fg",
                )}
              >
                {chapter.title}
              </text>
            </a>
          );
        })}
      </svg>

      <p className="text-muted mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="bg-viz-add size-2 rounded-full" /> has a live module
        </span>
        <span className="flex items-center gap-1.5">
          <span className="border-accent size-2.5 rounded-full border-2" /> in progress
        </span>
        <span className="flex items-center gap-1.5">
          <span className="bg-accent size-2.5 rounded-full" /> complete
        </span>
      </p>
      {hover !== undefined && (
        <div className="border-line bg-surface shadow-card pointer-events-none absolute top-2 left-1/2 w-64 -translate-x-1/2 rounded-xl border p-3 text-center text-xs">
          <p className="font-semibold">{track.chapters[hover].title}</p>
          <p className="text-muted mt-0.5">{track.chapters[hover].summary}</p>
          <p className="text-subtle mt-1">{track.chapters[hover].modules.length} modules</p>
        </div>
      )}
    </div>
  );
}

/** Primary action: continue where you left off in this track, or start at module 1. */
export function TrackCta({ track, firstLive }: { track: Track; firstLive?: string }) {
  const hydrated = useProgress((s) => s.hydrated);
  const last = useProgress((s) => s.lastVisited);
  const resume =
    hydrated && last?.track === track.slug ? getModule(track.slug, last.module) : undefined;
  const first = track.chapters[0].modules[0];
  const flagship = firstLive ? getModule(track.slug, firstLive) : undefined;

  return (
    <div className="flex flex-wrap gap-3">
      {resume ? (
        <Link
          href={`/tracks/${track.slug}/${resume.module.slug}`}
          className="bg-accent text-accent-fg inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-medium transition hover:brightness-110"
        >
          Continue: {resume.module.title} <ArrowRight className="size-4" />
        </Link>
      ) : (
        <Link
          href={`/tracks/${track.slug}/${first.slug}`}
          className="bg-accent text-accent-fg inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-medium transition hover:brightness-110"
        >
          Start with module 1 <ArrowRight className="size-4" />
        </Link>
      )}
      {flagship && flagship.module.slug !== resume?.module.slug && (
        <Link
          href={`/tracks/${track.slug}/${flagship.module.slug}`}
          className="border-line-strong hover:bg-surface inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium transition"
        >
          <Play className="size-3.5" /> Live now: {flagship.module.title.split(":")[0]}
        </Link>
      )}
    </div>
  );
}
