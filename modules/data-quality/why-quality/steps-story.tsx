"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

const HOPS = [
  "order form",
  "orders database",
  "warehouse",
  "dashboard",
  "forecast model",
  "board decision",
];

function Scene({ index }: { index: number }) {
  const reached = index >= 4 ? 1 : Math.min(index + 1, HOPS.length);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
      {HOPS.map((h, i) => (
        <motion.div
          key={h}
          animate={{ opacity: i < reached ? 1 : 0.25, x: i < reached ? 0 : -6 }}
          className={cn(
            "flex w-56 items-center justify-between rounded-lg border px-3 py-1.5 text-xs",
            i < reached
              ? index >= 4 && i === 0
                ? "border-good bg-good/10"
                : "border-bad/60 bg-bad/10"
              : "border-line bg-surface",
          )}
        >
          <span>{h}</span>
          <span className="font-mono text-[10px]">
            {i < reached ? (index >= 4 && i === 0 ? "check ✓" : "₹1,20,000") : ""}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "typo",
    kicker: "A typo",
    title: "One extra zero",
    body: (
      <p>
        A shop assistant enters a bulk order of 100 notebooks at ₹12 each. Their finger slips:
        ₹1,200 each. The order total says ₹1,20,000 instead of ₹1,200. Nothing stops it.
      </p>
    ),
  },
  {
    id: "spreads",
    kicker: "It spreads",
    title: "Copied, faithfully",
    body: (
      <p>
        Overnight, the order is copied into the warehouse. Every system does its job perfectly: it
        moves the wrong number exactly as it was given.
      </p>
    ),
  },
  {
    id: "fools",
    kicker: "It fools people",
    title: "A record month",
    body: (
      <p>
        The sales dashboard shows the best month for stationery ever. A forecasting model learns
        from it and predicts strong demand. The buying team orders more stock.
      </p>
    ),
  },
  {
    id: "found",
    kicker: "Found, eventually",
    title: "Weeks later",
    body: (
      <p>
        An accountant spots the odd invoice. Fixing it now means correcting the order, the
        warehouse, the dashboard, the model and a purchase that has already been made. Redman calls
        this extra checking and fixing work the{" "}
        <Term id="hidden-data-factory">hidden data factory</Term>.
      </p>
    ),
  },
  {
    id: "check",
    kicker: "The alternative",
    title: "One check at the start",
    body: (
      <p>
        A single rule at the form (&ldquo;a notebook costs less than ₹500&rdquo;) would have stopped
        it at the first hop. <Term id="data-quality">Data quality</Term> work is about catching
        problems like this, early and automatically, and noticing quickly when something slips
        through.
      </p>
    ),
  },
];

export function OneBadValue() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">One bad value</h2>
          <p className="text-muted mt-3 text-[15px]">
            How a single typo travels from a form to a board decision.
          </p>
        </div>
      }
    />
  );
}
