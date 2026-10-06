"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

const DOGS = ["🐕", "🐩", "🦮", "🐕‍🦺", "🐶"];
const NOT = ["🐈", "🐄", "🦊"];

function Scene({ index }: { index: number }) {
  if (index === 0)
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
        <div className="flex gap-2 text-3xl">
          {DOGS.map((d, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i }}
            >
              {d}
            </motion.span>
          ))}
        </div>
        <p className="text-good text-xs">“dog”</p>
        <div className="flex gap-2 text-3xl opacity-80">
          {NOT.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <p className="text-muted text-xs">“not a dog”</p>
      </div>
    );
  if (index === 1)
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
        <div className="grid grid-cols-8 gap-0.5">
          {Array.from({ length: 64 }, (_, i) => (
            <span
              key={i}
              className={cn(
                "h-5 w-5",
                (Math.floor(i / 8) + i) % 2 ? "bg-surface-2" : "bg-viz-compute/30",
              )}
            />
          ))}
        </div>
        <p className="text-muted text-xs">Samuel&apos;s checkers program, IBM, 1959</p>
      </div>
    );
  const rules = [
    "if subject has “FREE” → spam",
    "if sender unknown and “!!!” → spam",
    "if “winner” → spam",
    "…and 200 more",
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-6">
      <div
        className={cn(
          "rounded-lg border px-3 py-2 text-xs",
          index === 2 ? "border-accent" : "border-line opacity-50",
        )}
      >
        <p className="text-muted text-[10px]">HAND-WRITTEN RULES</p>
        {rules.map((r) => (
          <p key={r} className="font-mono text-[11px]">
            {r}
          </p>
        ))}
      </div>
      <motion.div
        animate={{ opacity: index >= 3 ? 1 : 0.2 }}
        className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs"
      >
        <p className="text-muted text-[10px]">LEARNED FROM LABELLED EMAILS</p>
        <p className="font-mono text-[11px]">
          “claim” +2.1 · “free” +1.4 · “meeting” −1.9 · “invoice” −1.2 …
        </p>
      </motion.div>
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "dogs",
    kicker: "At home",
    title: "Nobody teaches a child the rules for “dog”",
    body: (
      <p>
        Try writing rules that pick out every dog: four legs, fur, a tail? Cats have those too.
        Children learn &ldquo;dog&rdquo; another way: someone points at lots of examples and says
        &ldquo;dog&rdquo; or &ldquo;not a dog&rdquo;, and they work out the pattern themselves.
      </p>
    ),
  },
  {
    id: "samuel",
    kicker: "1959",
    title: "A program that taught itself checkers",
    body: (
      <p>
        At IBM, Arthur Samuel wrote a checkers program that improved by playing, and within hours of
        practice it played better than Samuel. He hoped &ldquo;programming computers to learn from
        experience&rdquo; would end the need to spell out every rule. That idea is{" "}
        <Term id="machine-learning">machine learning</Term>.
      </p>
    ),
  },
  {
    id: "rules",
    kicker: "Spam, by hand",
    title: "Rules break as fast as you write them",
    body: (
      <p>
        Early spam filters were lists of hand-written rules. Spammers changed their wording, and the
        lists grew and grew, while blocking more and more real mail.
      </p>
    ),
  },
  {
    id: "learned",
    kicker: "Spam, learned",
    title: "Let the examples write the rules",
    body: (
      <p>
        Feed a program thousands of emails marked spam or not, and it learns how much each word
        counts. In 2002 Paul Graham reported that such a filter missed fewer than 5 in 1,000 spams
        with no real mail blocked, beating months of hand-written rules. Microsoft researchers had
        published the idea in 1998. This track is about building models like that, and running them
        well.
      </p>
    ),
  },
];

export function ByExample() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Teaching by example
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            Why some rules are better learned than written.
          </p>
        </div>
      }
    />
  );
}
