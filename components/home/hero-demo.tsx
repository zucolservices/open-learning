"use client";

import { useState, type ComponentType } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTrack } from "@/catalogue";
import { CategoryIcon } from "@/components/category/category-icon";
import { TemperatureTaste } from "./temperature-taste";
import { DatabaseInternalsTaste } from "./database-internals-taste";
import { AppSecurityTaste } from "./app-security-taste";
import { cn } from "@/lib/cn";

interface Demo {
  track: string;
  module: string;
  label: string;
  prompt: string;
  Taste: ComponentType;
}

const DEMOS: Demo[] = [
  {
    track: "llm-foundations",
    module: "sampling",
    label: "LLMs",
    prompt: "Turn the temperature on a real model's next-word odds, then draw a word.",
    Taste: TemperatureTaste,
  },
  {
    track: "database-internals",
    module: "isolation",
    label: "Databases",
    prompt: "Two transactions collide. Find the lowest isolation level that stops each glitch.",
    Taste: DatabaseInternalsTaste,
  },
  {
    track: "app-security",
    module: "sql-injection",
    label: "Security",
    prompt: "Watch crafted input turn into code, then switch to a parameterised query.",
    Taste: AppSecurityTaste,
  },
];

/** Hero: one real piece of a module to play with. The visitor picks; nothing rotates on its own. */
export function HeroDemo() {
  const [i, setI] = useState(0);
  const d = DEMOS[i];
  const track = getTrack(d.track);
  return (
    <div className="border-line bg-surface/80 shadow-card relative rounded-[var(--radius-card)] border backdrop-blur">
      <div className="border-line flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
        <p className="text-muted text-xs font-medium tracking-wide uppercase">Try one now</p>
        <div className="flex gap-1" role="tablist" aria-label="Pick a demo">
          {DEMOS.map((x, n) => {
            const t = getTrack(x.track);
            return (
              <button
                key={x.track}
                type="button"
                role="tab"
                aria-selected={n === i}
                onClick={() => setI(n)}
                data-track={t?.accent}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition",
                  n === i
                    ? "border-accent bg-accent-soft text-fg"
                    : "text-muted hover:text-fg border-transparent",
                )}
              >
                <CategoryIcon slug={t?.category ?? ""} className="size-3.5" />
                {x.label}
              </button>
            );
          })}
        </div>
      </div>
      <div key={d.track} data-track={track?.accent} className="p-4 sm:p-5" role="tabpanel">
        <p className="text-accent text-[11px] font-medium">{track?.title}</p>
        <p className="mt-0.5 mb-4 text-sm font-medium text-pretty">{d.prompt}</p>
        <d.Taste />
        <Link
          href={`/tracks/${d.track}/${d.module}`}
          className="text-accent mt-4 inline-flex items-center gap-1 text-xs font-medium hover:underline"
        >
          Open the full module <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
