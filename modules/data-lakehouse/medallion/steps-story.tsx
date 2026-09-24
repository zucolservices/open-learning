"use client";

import { AnimatePresence, motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

/* 1 ─ One messy record, bronze to gold ⭐ --------------------------------------------------------- */

const RAW =
  '{"order_id":"A-10492","cust":"C-88","amt":"₹1,250.00",\n "city":"bangalore ","ts":"12/09/2026 19:42 IST"}';

const CLEANING = [
  ["amt", '"₹1,250.00" → 1250.00 (a decimal number)'],
  ["city", '"bangalore " → "Bengaluru"'],
  ["ts", "19:42 IST → 2026-09-12 14:12 UTC"],
  ["dupes", "two copies → one row (same order_id)"],
  ["check", "amount > 0 ✓, customer exists ✓"],
];

const LANES = [
  { id: "bronze", label: "Bronze", kitchen: "Groceries, as delivered", color: "tier-bronze" },
  { id: "silver", label: "Silver", kitchen: "Washed, chopped, checked", color: "tier-silver" },
  { id: "gold", label: "Gold", kitchen: "Plated, ready to serve", color: "tier-gold" },
] as const;

const LANE_STYLE: Record<(typeof LANES)[number]["id"], string> = {
  bronze: "border-tier-bronze/50 bg-tier-bronze/5",
  silver: "border-tier-silver/50 bg-tier-silver/5",
  gold: "border-tier-gold/50 bg-tier-gold/5",
};
const LABEL_STYLE: Record<(typeof LANES)[number]["id"], string> = {
  bronze: "text-tier-bronze",
  silver: "text-tier-silver",
  gold: "text-tier-gold",
};

function Scene({ stage }: { stage: number }) {
  const active = ["", "bronze", "silver", "gold", "replay"][stage] ?? "";
  return (
    <div className="relative flex h-full flex-col justify-center gap-3">
      {LANES.map((l, li) => {
        const on =
          stage === 4 ||
          (stage >= 1 && li === 0) ||
          (stage >= 2 && li === 1) ||
          (stage >= 3 && li === 2);
        return (
          <motion.div
            key={l.id}
            animate={{ opacity: stage === 0 || on ? 1 : 0.35 }}
            className={cn(
              "rounded-xl border p-3 transition",
              LANE_STYLE[l.id],
              active === l.id && "ring-accent/60 ring-2",
            )}
          >
            <div className="flex items-baseline justify-between gap-2">
              <p className={cn("text-sm font-semibold", LABEL_STYLE[l.id])}>{l.label}</p>
              <p className="text-muted text-[11px]">{l.kitchen}</p>
            </div>
            <AnimatePresence>
              {on && l.id === "bronze" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 grid gap-1"
                >
                  {[0, 1].map((i) => (
                    <div key={i} className="bg-bg/50 rounded-lg px-2 py-1.5 font-mono text-[10px]">
                      <pre className="whitespace-pre-wrap">{RAW}</pre>
                      <p className="text-subtle mt-1">
                        _ingested_at: 2026-09-12 14:12:0{i + 3} · _source: app-events/part-00
                        {17 + i}
                        .json
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}
              {on && l.id === "silver" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 grid gap-2"
                >
                  <ul className="grid gap-0.5 text-[11px]">
                    {CLEANING.map(([k, t], i) => (
                      <motion.li
                        key={k}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.12 * i }}
                        className="text-muted"
                      >
                        <span className="text-good">✓</span> {t}
                      </motion.li>
                    ))}
                  </ul>
                  <div className="bg-bg/50 overflow-x-auto rounded-lg px-2 py-1.5 font-mono text-[10px] whitespace-nowrap">
                    A-10492 · customer 88 · 1250.00 · Bengaluru · 2026-09-12 14:12 UTC
                  </div>
                </motion.div>
              )}
              {on && l.id === "gold" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-bg/50 mt-2 overflow-x-auto rounded-lg px-2 py-1.5 font-mono text-[10px] whitespace-nowrap"
                >
                  <p className="text-muted">daily_revenue_by_city</p>
                  2026-09-12 · Bengaluru · 1,284 orders · ₹16.2 lakh
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
      <AnimatePresence>
        {stage === 4 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border-accent/40 bg-accent-soft flex items-center gap-2 rounded-xl border px-3 py-2 text-xs"
          >
            <RotateCcw className="text-accent size-4 shrink-0" />
            Found a bug in silver? Fix the code, rebuild silver and gold from bronze.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "kitchen",
    kicker: "The big idea",
    title: "A restaurant kitchen",
    body: (
      <>
        <p>
          Groceries arrive and go into the store room exactly as delivered, receipts and all. Cooks
          wash, chop and portion them, throwing out anything spoiled. Then dishes are plated to
          order.
        </p>
        <p>
          The <Term id="medallion">medallion architecture</Term> (Databricks&apos; name for the
          pattern, also recommended by Microsoft Fabric) organises a lakehouse the same way, in
          three layers: bronze, silver and gold.
        </p>
      </>
    ),
  },
  {
    id: "bronze",
    kicker: "Bronze",
    title: "Keep it exactly as it arrived",
    body: (
      <>
        <p>
          A Brewline order lands in bronze as raw JSON, messy as it is: the amount is text, the city
          has a typo and a trailing space, the time is in IST. The app retried, so it arrived twice.
        </p>
        <p>
          Bronze doesn&apos;t fix anything. It only adds a note of when and from where each record
          came.
        </p>
      </>
    ),
  },
  {
    id: "silver",
    kicker: "Silver",
    title: "Clean, check, de-duplicate",
    body: (
      <>
        <p>
          Silver turns text into proper types, standardises values, converts times to UTC, removes
          the duplicate and checks the rules. Records that break them are dropped or set aside.
        </p>
        <p>The result is one trustworthy row per order that every team can build on.</p>
      </>
    ),
  },
  {
    id: "gold",
    kicker: "Gold",
    title: "Shaped for a question",
    body: (
      <>
        <p>
          Gold tables answer business questions: revenue per city per day, a customer 360, a
          model&apos;s features. Our order is now one of the 1,284 behind a number on a dashboard.
        </p>
      </>
    ),
  },
  {
    id: "replay",
    kicker: "Why bother?",
    title: "Because you'll get something wrong",
    body: (
      <>
        <p>
          A month later, someone finds that silver mapped a city wrongly. Because bronze kept the
          original, you fix the code and rebuild silver and gold. No need to ask the app team for
          old data they no longer have.
        </p>
        <p>
          That&apos;s the real point of the layers: each one can be rebuilt from the one before.
        </p>
      </>
    ),
  },
];

export function MessyRecord() {
  return (
    <ScrollStory
      sections={SECTIONS}
      renderScene={(i) => <Scene stage={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            One messy record, bronze to gold
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            Follow a single coffee order through the three layers of a lakehouse.
          </p>
        </div>
      }
    />
  );
}
