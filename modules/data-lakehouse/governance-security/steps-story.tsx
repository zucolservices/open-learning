"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

/* 2 ─ Where one person's data goes ⭐ ------------------------------------------------------------ */

const PLACES = [
  { id: "app", label: "App database", layer: "source" },
  { id: "bronze", label: "bronze.customers_raw", layer: "bronze" },
  { id: "silver", label: "silver.customers", layer: "silver" },
  { id: "c360", label: "gold.customer_360", layer: "gold" },
  { id: "city", label: "gold.revenue_by_city", layer: "gold" },
  { id: "features", label: "ml.churn_features", layer: "ml" },
  { id: "csv", label: "export_priya_team.csv", layer: "copy" },
  { id: "history", label: "Old table versions", layer: "copy" },
];

/** Which places hold Priya's personal data at each story stage (true = identifiable). */
const STAGES: Record<string, boolean | "aggregate">[] = [
  { app: true },
  { app: true, bronze: true },
  { app: true, bronze: true, silver: true },
  { app: true, bronze: true, silver: true, c360: true, city: "aggregate" },
  {
    app: true,
    bronze: true,
    silver: true,
    c360: true,
    city: "aggregate",
    features: true,
    csv: true,
    history: true,
  },
  {
    app: true,
    bronze: true,
    silver: true,
    c360: true,
    city: "aggregate",
    features: true,
    csv: true,
    history: true,
  },
];

function Scene({ stage }: { stage: number }) {
  const st = STAGES[stage];
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      {PLACES.map((p, i) => {
        const v = st[p.id];
        return (
          <motion.div
            key={p.id}
            initial={false}
            animate={{ opacity: v ? 1 : 0.25, x: v ? 0 : -6 }}
            transition={{ delay: 0.04 * i }}
            className={cn(
              "flex items-center justify-between rounded-lg border px-3 py-1.5 font-mono text-[11px]",
              v === true
                ? "border-bad/50 bg-bad/10"
                : v === "aggregate"
                  ? "border-good/40 bg-good/10"
                  : "border-line border-dashed",
            )}
          >
            <span>{p.label}</span>
            <span className="text-muted text-[10px]">
              {v === true ? "holds Priya's data" : v === "aggregate" ? "totals only" : ""}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "signup",
    kicker: "Day 1",
    title: "Priya signs up",
    body: (
      <>
        <p>
          Priya creates a Brewline account: name, phone, email, delivery address. One row, in one
          app database. Under India&apos;s <Term id="dpdp">DPDP Act</Term>, she is the{" "}
          <em>Data Principal</em>; Brewline is the <em>Data Fiduciary</em> responsible for it.
        </p>
      </>
    ),
  },
  {
    id: "bronze",
    kicker: "Minutes later",
    title: "Copied into bronze",
    body: (
      <>
        <p>
          Change data capture streams her row into the lakehouse&apos;s raw layer, exactly as it
          arrived: every field, including ones nobody asked for.
        </p>
      </>
    ),
  },
  {
    id: "silver",
    kicker: "Hourly",
    title: "Cleaned into silver",
    body: (
      <>
        <p>
          A pipeline standardises her phone number and email and joins her to her orders. A second
          copy of her personal data, now in a nicer shape.
        </p>
      </>
    ),
  },
  {
    id: "gold",
    kicker: "Daily",
    title: "Gold: one table about her, one that isn't",
    body: (
      <>
        <p>
          <code>customer_360</code> is all about individual customers, Priya included.{" "}
          <code>revenue_by_city</code> holds only totals across thousands of people: it no longer
          identifies anyone.
        </p>
      </>
    ),
  },
  {
    id: "spread",
    kicker: "Months later",
    title: "Copies everywhere",
    body: (
      <>
        <p>
          A churn model&apos;s feature table. A CSV an analyst exported to share with a team. And
          every table&apos;s old versions, kept for <Term id="time-travel">time travel</Term>.
        </p>
        <p>No one did anything wrong. This is simply how data spreads.</p>
      </>
    ),
  },
  {
    id: "request",
    kicker: "Today",
    title: "Priya asks to be forgotten",
    body: (
      <>
        <p>
          Priya closes her account and asks Brewline to erase her personal data. Where is it? All of
          the red places. Next, you&apos;ll handle her request.
        </p>
      </>
    ),
  },
];

export function WhereDataGoes() {
  return (
    <ScrollStory
      sections={SECTIONS}
      renderScene={(i) => <Scene stage={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Where one person&apos;s data goes
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            Follow one customer&apos;s personal data from sign-up to every corner of the lakehouse.
          </p>
        </div>
      }
    />
  );
}
