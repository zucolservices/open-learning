"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { COPIES } from "./model";

const TONE = {
  now: "border-good/50 bg-good/10",
  overnight: "border-line bg-surface",
  never: "border-bad/50 bg-bad/10",
};
const LABEL = { now: "updated", overnight: "tomorrow", never: "old address" };

function Scene({ index }: { index: number }) {
  // 0: one record. 1: copies appear. 2+: show how and whether each is updated.
  const shown = index === 0 ? 1 : COPIES.length;
  return (
    <div className="flex h-full flex-col justify-center gap-1.5">
      {COPIES.slice(0, shown).map((c, i) => (
        <motion.div
          key={c.system}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 * i }}
          className={cn(
            "grid grid-cols-[8.5rem_1fr_auto] items-center gap-2 rounded-lg border px-3 py-1.5",
            index >= 2
              ? TONE[c.updated]
              : i === 0
                ? "border-accent bg-accent-soft"
                : "border-line bg-surface",
          )}
        >
          <span className="text-sm font-semibold">{c.system}</span>
          <span className="text-muted truncate text-[11px]">
            {index >= 2 ? c.how : "Priya · 14 Lake Road"}
          </span>
          {index >= 2 && (
            <span
              className={cn(
                "font-mono text-[10px]",
                c.updated === "never" ? "text-bad" : "text-muted",
              )}
            >
              {LABEL[c.updated]}
            </span>
          )}
        </motion.div>
      ))}
      {index >= 3 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-subtle mt-1 text-[10px]"
        >
          A fictional bank; a typical pattern.
        </motion.p>
      )}
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "idea",
    kicker: "The idea",
    title: "Priya moves house",
    body: (
      <>
        <p>
          Priya tells her bank she has moved. A clerk types the new address into the core banking
          system. Job done?
        </p>
        <p>
          In a small shop, yes. In a large organisation, that address lives in many places, each
          added by a different team in a different decade.
        </p>
      </>
    ),
  },
  {
    id: "copies",
    kicker: "Copies",
    title: "Everyone keeps their own",
    body: (
      <p>
        The card system, the loans system, the insurance partner, marketing and the data warehouse
        all hold a copy. One of them is the <Term id="system-of-record">system of record</Term>, the
        place that holds the official version; the rest must be told.
      </p>
    ),
  },
  {
    id: "how",
    kicker: "Wiring",
    title: "Each copy, a different pipe",
    body: (
      <p>
        One copy is updated by a real-time call, two by files sent overnight, one by a spreadsheet
        someone emails weekly, and one was copied once and never again. Next month Priya&apos;s new
        credit card goes to her old house.
      </p>
    ),
  },
  {
    id: "mud",
    kicker: "Sprawl",
    title: "Nobody designed this",
    body: (
      <p>
        Each connection made sense when it was built. Together they form what Brian Foote and Joseph
        Yoder in 1997 called a <Term id="big-ball-of-mud">Big Ball of Mud</Term>: &ldquo;haphazardly
        structured, sprawling, sloppy, duct-tape and bailing wire, spaghetti code jungle&rdquo;.
        They called it the architecture that &ldquo;actually predominates in practice&rdquo;.
      </p>
    ),
  },
  {
    id: "track",
    kicker: "This track",
    title: "Patterns for the whole estate",
    body: (
      <p>
        Enterprise patterns are the tried ways of drawing boundaries between systems and teams,
        connecting them, and changing them without stopping the business. That&apos;s what the next
        twenty modules are about.
      </p>
    ),
  },
];

export function AddressChange() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            One address change
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            Why the hard part of a large organisation&apos;s software is between the systems.
          </p>
        </div>
      }
    />
  );
}
