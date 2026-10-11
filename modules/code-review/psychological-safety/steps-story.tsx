"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { THREAD } from "./model";

function Scene({ index }: { index: number }) {
  const shown = Math.min(index, 3);
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-5">
      <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
        <p className="font-semibold">Sam&apos;s first pull request: show refunds on receipts</p>
        <p className="text-muted text-[10px]">made-up team · same code, two cultures</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {(["a", "b"] as const).map((k) => (
          <div key={k} className="flex flex-col gap-2">
            <p className="text-muted text-[10px] font-medium">{k === "a" ? "Team A" : "Team B"}</p>
            {THREAD.slice(0, shown).map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "rounded-lg border px-2 py-1.5 text-[11px]",
                  i === 2
                    ? k === "a"
                      ? "border-bad/40 bg-bad/10"
                      : "border-good/40 bg-good/10"
                    : "border-line bg-surface",
                )}
              >
                {t[k]}
              </motion.div>
            ))}
          </div>
        ))}
      </div>
      <motion.div
        animate={{ opacity: index >= 4 ? 1 : 0 }}
        className="border-line bg-surface-2 rounded-lg border px-3 py-2 text-center text-[11px]"
      >
        {index >= 5
          ? "Team B's reviewer still blocked the merge until the bug was fixed. Safe isn't soft."
          : "Better hospital teams reported more errors, not fewer."}
      </motion.div>
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "same",
    kicker: "The setup",
    title: "One pull request, two teams",
    body: (
      <p>
        Sam joined last week. Their first pull request shows refunds on receipts, and it uses a
        helper called formatPrice that Sam doesn&apos;t fully understand. Watch the same review play
        out in two teams.
      </p>
    ),
  },
  {
    id: "first",
    kicker: "The first comment",
    title: "Same concern, different words",
    body: (
      <p>
        Both reviewers would prefer a loop. Team A&apos;s reviewer asks &ldquo;why would you&rdquo;,
        which reads as a judgement. Team B&apos;s reviewer notices something good, then asks a real
        question.
      </p>
    ),
  },
  {
    id: "next",
    kicker: "What Sam does",
    title: "Speaking up, or keeping quiet",
    body: (
      <p>
        In Team A, Sam decides questions are risky and keeps their doubt about formatPrice to
        themselves. In Team B, it feels safe to say &ldquo;I&apos;m not sure&rdquo;.
      </p>
    ),
  },
  {
    id: "caught",
    kicker: "The outcome",
    title: "What silence costs",
    body: (
      <p>
        Team A ships the bug. Team B catches it, because the person who noticed something odd felt
        able to say so. That feeling has a name:{" "}
        <Term id="psychological-safety">psychological safety</Term>.
      </p>
    ),
  },
  {
    id: "hospital",
    kicker: "The research",
    title: "The surprise in the hospital",
    body: (
      <p>
        Amy Edmondson studied hospital teams and found the better ones <em>reported</em> more
        errors. They didn&apos;t make more; they felt safe admitting them. Edmondson&apos;s 1999 study of
        51 work teams linked safety to learning.
      </p>
    ),
  },
  {
    id: "standards",
    kicker: "The misunderstanding",
    title: "Safe, not soft",
    body: (
      <p>
        Psychological safety doesn&apos;t mean approving everything. Team B&apos;s reviewer still
        blocked the merge until the bug was fixed. The bar stayed high; only the fear went away.
      </p>
    ),
  },
];

export function TwoTeams() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            The question nobody asked
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            The same review thread, replayed in two team cultures.
          </p>
        </div>
      }
    />
  );
}
