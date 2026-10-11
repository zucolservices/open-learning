"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

const SHOW = [
  { authorOnly: true, comments: 0 },
  { authorOnly: false, comments: 1 },
  { authorOnly: false, comments: 2 },
  { authorOnly: false, comments: 3 },
  { authorOnly: false, comments: 3 },
  { authorOnly: false, comments: 3 },
];

const THREAD = [
  "This loses a rupee when ₹100 is split three ways.",
  "There's already splitEvenly() in money.ts.",
  "TIL about rounding modes in Intl.NumberFormat!",
];

function Scene({ index }: { index: number }) {
  const s = SHOW[index];
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-5">
      <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
        <p className="font-semibold">Add bill splitting</p>
        <p className="text-muted text-[10px]">made-up café app · 1 file changed, +38 −2</p>
      </div>
      {THREAD.slice(0, s.comments).map((c, i) => (
        <motion.div
          key={c}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * i }}
          className={cn(
            "rounded-lg border px-3 py-2 text-xs",
            i === 0 ? "border-bad/40 bg-bad/10" : "border-line bg-surface",
          )}
        >
          {c}
        </motion.div>
      ))}
      <motion.div
        animate={{ opacity: index >= 4 ? 1 : 0.15 }}
        className="grid grid-cols-3 gap-2 text-center text-[10px]"
      >
        {[
          ["1", "bug fixed"],
          ["1", "helper reused"],
          ["2", "people who know the code"],
        ].map(([n, l]) => (
          <div key={l} className="border-line bg-surface rounded border px-2 py-1.5">
            <p className="text-accent font-mono text-base">{n}</p>
            <p className="text-muted">{l}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "open",
    kicker: "Monday",
    title: "Arjun opens a pull request",
    body: (
      <p>
        Arjun has added bill splitting to a made-up café&apos;s app. It works on their laptop.
        Before it&apos;s merged, the team&apos;s rule is that someone else reads it: a{" "}
        <Term id="code-review">code review</Term>.
      </p>
    ),
  },
  {
    id: "bug",
    kicker: "Comment 1",
    title: "A bug nobody would have tested",
    body: (
      <p>
        Meena, reviewing, tries ₹100 split three ways: ₹33.33 each, ₹99.99 in total. A rupee
        vanishes. Arjun fixes it before any customer notices.
      </p>
    ),
  },
  {
    id: "know",
    kicker: "Comment 2",
    title: "Knowledge moves to Arjun",
    body: (
      <p>
        Meena points out a helper that already does this. Arjun didn&apos;t know it existed; now
        they do, and the codebase keeps one way of splitting money.
      </p>
    ),
  },
  {
    id: "back",
    kicker: "Comment 3",
    title: "…and back to Meena",
    body: (
      <p>
        Arjun&apos;s code uses a formatting option Meena had never seen. Review is a conversation;
        both people learn.
      </p>
    ),
  },
  {
    id: "result",
    kicker: "Wednesday",
    title: "What the review produced",
    body: (
      <p>
        One bug fixed, one helper reused, and now two people understand bill splitting. If Arjun is
        on holiday when it breaks, Meena can fix it.
      </p>
    ),
  },
  {
    id: "research",
    kicker: "The research",
    title: "Less about bugs than people expect",
    body: (
      <p>
        A Microsoft study (Bacchelli and Bird, 2013) found developers review mainly to find defects,
        yet most of what reviews produce is knowledge transfer, team awareness and better solutions.
        Google&apos;s 2018 study adds education, keeping norms, and gatekeeping.
      </p>
    ),
  },
];

export function BillSplit() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Two pairs of eyes
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            One small pull request, and everything its review produced.
          </p>
        </div>
      }
    />
  );
}
