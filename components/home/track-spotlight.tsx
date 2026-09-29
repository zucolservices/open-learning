"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { trackMinutes, trackModules, type Track } from "@/catalogue";
import { CategoryIcon } from "@/components/category/category-icon";
import { TrackProgressBar } from "@/components/progress-bits";
import { ModuleArt } from "@/components/track/module-art";
import { cn } from "@/lib/cn";

/**
 * Home hero: one live track at a time, so the hero keeps the same size however many tracks go
 * live. Rotates on its own until the visitor hovers, focuses or picks a track.
 */
export function TrackSpotlight({ tracks }: { tracks: Track[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || tracks.length < 2) return;
    const id = setInterval(() => setI((n) => (n + 1) % tracks.length), 7000);
    return () => clearInterval(id);
  }, [paused, tracks.length]);
  const t = tracks[i];
  const mods = trackModules(t);
  const live = mods.filter((m) => m.status === "live");
  const go = (d: number) => {
    setPaused(true);
    setI((n) => (n + d + tracks.length) % tracks.length);
  };
  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      className="border-line bg-surface/70 shadow-card rounded-[var(--radius-card)] border p-4 backdrop-blur sm:p-5"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-muted text-xs font-medium tracking-wide uppercase">
          Live now · {i + 1} of {tracks.length}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous track"
            onClick={() => go(-1)}
            className="text-muted hover:bg-surface-2 hover:text-fg grid size-7 place-items-center rounded-full"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next track"
            onClick={() => go(1)}
            className="text-muted hover:bg-surface-2 hover:text-fg grid size-7 place-items-center rounded-full"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={t.slug}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
        >
          <Link
            href={`/tracks/${t.slug}`}
            data-track={t.accent}
            className="group border-line bg-surface hover:border-accent/60 relative block overflow-hidden rounded-2xl border p-4 transition"
          >
            <div className="page-glow pointer-events-none absolute inset-0 opacity-60" />
            <div className="relative">
              <div className="flex items-start gap-3">
                <span className="bg-accent-soft text-accent grid size-10 shrink-0 place-items-center rounded-xl">
                  <CategoryIcon slug={t.category} className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-accent text-[11px] font-medium">{t.area}</p>
                  <p className="group-hover:text-accent text-lg font-semibold tracking-tight">
                    {t.title}
                  </p>
                  <p className="text-muted text-sm">{t.tagline}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {live.slice(0, 3).map((m) => (
                  <div
                    key={m.slug}
                    className="border-line bg-surface-2/60 aspect-[16/10] overflow-hidden rounded-lg border p-1"
                    title={m.title}
                  >
                    <ModuleArt slug={m.slug} />
                  </div>
                ))}
              </div>
              <p className="text-muted mt-3 line-clamp-2 text-xs">
                Starts with:{" "}
                {live
                  .slice(0, 3)
                  .map((m) => m.title)
                  .join(" · ")}
              </p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-subtle text-[11px]">
                  {t.chapters.length} chapters · {mods.length} modules · ~
                  {Math.round(trackMinutes(t) / 60)} hours
                </p>
                <span className="text-accent flex items-center gap-1 text-xs font-medium">
                  Open track{" "}
                  <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </div>
              <TrackProgressBar track={t.slug} className="mt-2" />
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>
      <div className="mt-3 flex justify-center gap-1.5" role="tablist" aria-label="Live tracks">
        {tracks.map((x, n) => (
          <button
            key={x.slug}
            type="button"
            role="tab"
            aria-selected={n === i}
            aria-label={x.title}
            onClick={() => {
              setPaused(true);
              setI(n);
            }}
            data-track={x.accent}
            className={cn(
              "h-1.5 rounded-full transition-all",
              n === i ? "bg-accent w-6" : "bg-line-strong hover:bg-muted w-1.5",
            )}
          />
        ))}
      </div>
    </div>
  );
}
