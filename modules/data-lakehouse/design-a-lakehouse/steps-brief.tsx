"use client";

import { AnimatePresence, motion } from "motion/react";
import { Building2, CreditCard, FileCheck2, ShieldAlert, Users } from "lucide-react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { cn } from "@/lib/cn";
import { REQUIREMENTS } from "./data";

/* 1 ─ The brief ⭐ -------------------------------------------------------------------------------- */

const FACTS = [
  { icon: Users, text: "800,000 members" },
  { icon: Building2, text: "140 branches" },
  { icon: CreditCard, text: "3 million UPI and card transactions a day" },
  { icon: FileCheck2, text: "Monthly regulatory filings" },
  { icon: ShieldAlert, text: "A rising number of fraud attempts" },
];

/** Which requirement cards each section reveals. */
const REVEAL: string[][] = [
  [],
  [],
  ["fresh"],
  ["repro"],
  ["fast", "privacy"],
  ["ops", "cost", "india"],
];

function Scene({ stage }: { stage: number }) {
  const shown = new Set(REVEAL.slice(0, stage + 1).flat());
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <div
        className={cn(
          "border-line bg-surface rounded-xl border p-3",
          stage >= 2 && "hidden sm:block",
        )}
      >
        <p className="text-sm font-semibold">Sahyog Cooperative Bank</p>
        <div className="mt-2 grid grid-cols-2 gap-1">
          {FACTS.map((f, i) => (
            <motion.p
              key={f.text}
              initial={false}
              animate={{ opacity: stage >= 1 ? 1 : 0.3 }}
              transition={{ delay: i * 0.05 }}
              className="text-muted flex items-center gap-2 text-xs"
            >
              <f.icon className="text-accent size-3.5 shrink-0" /> {f.text}
            </motion.p>
          ))}
        </div>
      </div>
      <p className="text-subtle text-[10px] tracking-wide uppercase">Requirements</p>
      <div className="grid grid-cols-2 gap-1.5">
        <AnimatePresence initial={false}>
          {REQUIREMENTS.filter((r) => shown.has(r.id)).map((r) => (
            <motion.div
              key={r.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "rounded-lg border px-3 py-2",
                REVEAL[stage]?.includes(r.id)
                  ? "border-accent bg-accent-soft"
                  : "border-line bg-surface",
              )}
            >
              <p className="text-xs font-semibold">{r.label}</p>
              <p className="text-muted hidden text-[10px] sm:block">{r.detail}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "letter",
    kicker: "Your assignment",
    title: "A letter from the CIO",
    body: (
      <>
        <p>
          &ldquo;We&apos;ve outgrown spreadsheets and overnight reports. We want a proper lakehouse,
          and we&apos;d like you to design it.&rdquo;
        </p>
        <p>
          This capstone brings every chapter together. First, meet the bank. (Sahyog is fictional;
          its problems are not.)
        </p>
      </>
    ),
  },
  {
    id: "bank",
    kicker: "The bank",
    title: "Sahyog Cooperative Bank",
    body: (
      <p>
        A cooperative bank owned by its 800,000 members, with 140 branches. Its core banking system
        records about three million UPI and card transactions a day.
      </p>
    ),
  },
  {
    id: "fraud",
    kicker: "Team 1",
    title: "The fraud team is always a day behind",
    body: (
      <p>
        Fraud analysts get yesterday&apos;s data every morning. By then, the money is gone. They
        want transactions within five minutes.
      </p>
    ),
  },
  {
    id: "compliance",
    kicker: "Team 2",
    title: "Compliance can't reproduce last year",
    body: (
      <p>
        An auditor asked for the exact data behind a filing from last March. Nobody could produce
        it: the tables had been corrected since.
      </p>
    ),
  },
  {
    id: "branches",
    kicker: "Teams 3 and 4",
    title: "Branches want speed; members want privacy",
    body: (
      <p>
        Branch managers want dashboards that load in seconds. Meanwhile, members&apos; personal data
        must be hidden from staff who don&apos;t need it, and removed when members ask, as
        India&apos;s data protection law requires.
      </p>
    ),
  },
  {
    id: "constraints",
    kicker: "The constraints",
    title: "Six people, a careful budget, and India",
    body: (
      <>
        <p>
          The data team is six people. As a cooperative, every rupee is members&apos; money. And
          bank policy says all data must stay in India.
        </p>
        <p>Seven requirements. Next, you make the decisions.</p>
      </>
    ),
  },
];

export function Brief() {
  return (
    <ScrollStory
      sections={SECTIONS}
      renderScene={(i) => <Scene stage={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Capstone</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">The brief</h2>
          <p className="text-muted mt-3 text-[15px]">
            A cooperative bank needs a lakehouse. Read the brief; you&apos;ll design it next.
          </p>
        </div>
      }
    />
  );
}
