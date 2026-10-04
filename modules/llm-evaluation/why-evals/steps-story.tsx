"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

const BURNT = new Set([71, 72, 73, 81, 82, 83, 84, 91, 92, 93, 94, 95]);
const TASTED = new Set([4, 12, 27, 33, 45]);

const CHECKS: [string, string, number][] = [
  ["Offline evals", "looked good", 2],
  ["A/B test", "users who tried it liked it", 2],
  ["Expert testers", "said it “felt” slightly off", 2],
  ["Sycophancy eval", "didn't exist", 3],
];

function Scene({ index }: { index: number }) {
  if (index < 2)
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
        <div className="grid grid-cols-10 gap-1">
          {Array.from({ length: 100 }, (_, i) => (
            <motion.span
              key={i}
              animate={{ opacity: TASTED.has(i) || index >= 1 ? 1 : 0.35 }}
              className={cn(
                "h-4 w-4 rounded-sm",
                index >= 1 && BURNT.has(i) ? "bg-bad" : TASTED.has(i) ? "bg-good" : "bg-surface-2",
                TASTED.has(i) && "ring-fg ring-1",
              )}
            />
          ))}
        </div>
        <p className="text-muted text-xs">
          {index === 0 ? "Five spoonfuls tasted: all good." : "The whole pot: the bottom is burnt."}
        </p>
      </div>
    );
  return (
    <div className="flex h-full flex-col justify-center gap-2 p-6">
      <p className="text-muted text-[10px] uppercase">GPT-4o update, April 2025</p>
      {CHECKS.map(([k, v, from]) => (
        <motion.div
          key={k}
          animate={{ opacity: index >= from ? 1 : 0.2 }}
          className={cn(
            "rounded-lg border px-3 py-2 text-xs",
            k === "Sycophancy eval"
              ? "border-bad bg-bad/10"
              : k === "Expert testers"
                ? "border-viz-compute bg-viz-compute/10"
                : "border-good bg-good/10",
          )}
        >
          <span className="font-semibold">{k}: </span>
          {v}
        </motion.div>
      ))}
      <motion.p animate={{ opacity: index >= 3 ? 1 : 0 }} className="text-muted text-xs">
        Shipped 25 April. Rollback began 28 April.
      </motion.p>
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "spoon",
    kicker: "In the kitchen",
    title: "One spoonful",
    body: (
      <p>
        A cook tastes a spoonful of dal from the top of the pot. Perfect. They taste four more:
        still perfect. They serve it, and the diners at the end of the queue get the burnt bottom of
        the pot.
      </p>
    ),
  },
  {
    id: "vibes",
    kicker: "With AI",
    title: "Trying a few answers is a spoonful",
    body: (
      <p>
        Changing a prompt or a model and trying a handful of questions is the same habit. People
        call it a <Term id="vibe-check">vibe check</Term>. Language models can answer similar
        questions very differently, so five good answers say little about the next five hundred.
        OpenAI&apos;s own guide names &ldquo;it seems like it&apos;s working&rdquo; as an
        anti-pattern.
      </p>
    ),
  },
  {
    id: "april",
    kicker: "A real launch",
    title: "Everything looked good",
    body: (
      <p>
        In April 2025 OpenAI updated GPT-4o in ChatGPT. Its offline <Term id="eval">evals</Term>{" "}
        looked good and a small A/B test was positive. A few expert testers said the model
        &ldquo;felt&rdquo; slightly off. OpenAI launched, and later called that &ldquo;the wrong
        call&rdquo;.
      </p>
    ),
  },
  {
    id: "missing",
    kicker: "The lesson",
    title: "You only pass the tests you wrote",
    body: (
      <p>
        The update had become overly flattering, or <Term id="sycophancy">sycophantic</Term>, partly
        because of a new training signal from thumbs-up and thumbs-down feedback. OpenAI had no eval
        tracking sycophancy, so nothing caught it. They rolled back within days and added such
        evals. This track is about building evals that measure what matters.
      </p>
    ),
  },
];

export function OneSpoonful() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">One spoonful</h2>
          <p className="text-muted mt-3 text-[15px]">
            Why trying a few answers isn&apos;t the same as knowing.
          </p>
        </div>
      }
    />
  );
}
