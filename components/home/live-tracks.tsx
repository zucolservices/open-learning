"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories, trackMinutes, trackModules, type Track } from "@/catalogue";
import { CategoryIcon } from "@/components/category/category-icon";
import { TrackProgressBar } from "@/components/progress-bits";
import { cn } from "@/lib/cn";

/** Every live track in a compact grid, filterable by category once there are several. */
export function LiveTracks({ tracks }: { tracks: Track[] }) {
  const [cat, setCat] = useState("all");
  const cats = categories.filter((c) => tracks.some((t) => t.category === c.slug));
  const shown = cat === "all" ? tracks : tracks.filter((t) => t.category === cat);
  return (
    <div className="flex flex-col gap-4">
      {cats.length > 1 && (
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by category">
          {[{ slug: "all", title: "All" }, ...cats].map((c) => {
            const n =
              c.slug === "all" ? tracks.length : tracks.filter((t) => t.category === c.slug).length;
            return (
              <button
                key={c.slug}
                type="button"
                aria-pressed={cat === c.slug}
                onClick={() => setCat(c.slug)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition",
                  cat === c.slug
                    ? "border-fg bg-fg text-bg"
                    : "border-line text-muted hover:text-fg hover:border-line-strong",
                )}
              >
                {c.title} <span className="opacity-60">{n}</span>
              </button>
            );
          })}
        </div>
      )}
      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
        {shown.map((t) => {
          const mods = trackModules(t);
          return (
            <Link
              key={t.slug}
              href={`/tracks/${t.slug}`}
              data-track={t.accent}
              className="group border-line bg-surface hover:border-accent/60 relative w-[82%] shrink-0 snap-start overflow-hidden rounded-2xl border p-4 transition hover:-translate-y-0.5 sm:w-auto"
            >
              <div className="page-glow pointer-events-none absolute inset-0 opacity-40" />
              <div className="relative flex items-start gap-3">
                <span className="bg-accent-soft text-accent grid size-9 shrink-0 place-items-center rounded-xl">
                  <CategoryIcon slug={t.category} className="size-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-accent text-[11px] font-medium">{t.area}</p>
                  <p className="group-hover:text-accent font-semibold tracking-tight">{t.title}</p>
                  <p className="text-muted mt-0.5 line-clamp-2 text-xs">{t.tagline}</p>
                  <p className="text-subtle mt-2 text-[11px]">
                    {mods.length} modules · ~{Math.round(trackMinutes(t) / 60)} hours
                  </p>
                  <TrackProgressBar track={t.slug} className="mt-1.5" />
                </div>
                <ArrowRight className="text-subtle group-hover:text-accent mt-1 size-4 shrink-0 transition" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
