"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { getModule, getTrack, trackModules } from "@/catalogue";
import { useProgress } from "@/lib/progress-adapter";
import { cn } from "@/lib/cn";

/** Home page: resume the last module visited. Renders nothing until progress loads. */
export function ContinueCard() {
  const hydrated = useProgress((s) => s.hydrated);
  const last = useProgress((s) => s.lastVisited);
  const tracks = useProgress((s) => s.tracks);
  if (!hydrated || !last) return null;

  const found = getModule(last.track, last.module);
  if (!found || found.track.hidden) return null;
  const saved = tracks[last.track]?.[last.module];
  const done = saved?.status === "completed";

  return (
    <Link
      href={`/tracks/${found.track.slug}/${found.module.slug}`}
      data-track={found.track.accent}
      className="group rounded-card border-line bg-surface shadow-card hover:border-accent/50 flex items-center gap-4 border p-5 transition"
    >
      <div className="min-w-0 flex-1">
        <p className="text-accent text-xs font-medium tracking-wide uppercase">
          {done ? "Revisit" : "Continue where you left off"}
        </p>
        <p className="mt-1 truncate text-lg font-semibold tracking-tight">{found.module.title}</p>
        <p className="text-muted text-sm">
          {found.track.title}
          {!done && saved ? ` · step ${saved.step + 1}` : ""}
        </p>
      </div>
      <span className="bg-accent text-accent-fg grid size-10 shrink-0 place-items-center rounded-full transition group-hover:translate-x-0.5">
        <ArrowRight className="size-4" />
      </span>
    </Link>
  );
}

export function useTrackCompletion(trackSlug: string) {
  const hydrated = useProgress((s) => s.hydrated);
  const saved = useProgress((s) => s.tracks[trackSlug]);
  const track = getTrack(trackSlug);
  const modules = track ? trackModules(track) : [];
  const done = modules.filter((m) => saved?.[m.slug]?.status === "completed").length;
  return { hydrated, done, total: modules.length };
}

export function TrackProgressBar({ track, className }: { track: string; className?: string }) {
  const { hydrated, done, total } = useTrackCompletion(track);
  const pct = hydrated && total ? (done / total) * 100 : 0;
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="bg-surface-2 h-1.5 flex-1 overflow-hidden rounded-full">
        <div
          className="bg-accent h-full rounded-full transition-[width] duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-muted w-20 text-right text-xs tabular-nums">
        {hydrated ? `${done} / ${total} done` : `${total} modules`}
      </span>
    </div>
  );
}

export function ModuleStatusBadge({ track, module }: { track: string; module: string }) {
  const hydrated = useProgress((s) => s.hydrated);
  const status = useProgress((s) => s.tracks[track]?.[module]?.status);
  if (!hydrated || !status) return null;
  if (status === "completed") {
    return (
      <span
        className="bg-accent text-accent-fg grid size-6 place-items-center rounded-full"
        title="Completed"
      >
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    );
  }
  return (
    <span className="bg-accent-soft text-accent rounded-full px-2 py-0.5 text-xs font-medium">
      In progress
    </span>
  );
}
