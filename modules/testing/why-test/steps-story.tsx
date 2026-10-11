"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

/** What the scene shows per section: the code change, the bill, and whether a test exists. */
function Scene({ index }: { index: number }) {
  const replay = index >= 4;
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-5">
      <div className="border-line bg-surface rounded-lg border p-3 font-mono text-[11px]">
        <p className="text-muted mb-1 text-[10px]">checkout.js · made-up example</p>
        <p>function studentPrice(price) {"{"}</p>
        <p className={cn("pl-4", index >= 1 && "bg-bad/15")}>return Math.floor(price * 0.9);</p>
        <p>{"}"}</p>
      </div>
      <motion.div
        animate={{ opacity: index >= 2 && !replay ? 1 : 0.2 }}
        className="border-line bg-surface rounded-lg border p-3 text-xs"
      >
        <p className="text-muted text-[10px]">Receipt #2231</p>
        <p className="flex justify-between">
          <span>Masala chai, ₹105, student</span>
          <span className="font-mono">₹94</span>
        </p>
        <p className="text-bad mt-1 text-[10px]">
          Should be ₹94.50. Every student order, all weekend.
        </p>
      </motion.div>
      <motion.div
        animate={{ opacity: replay ? 1 : 0.15 }}
        className={cn(
          "rounded-lg border p-3 font-mono text-[11px]",
          index >= 5 ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
        )}
      >
        <p className="text-muted mb-1 text-[10px]">checkout.test.js</p>
        <p className="flex items-center gap-1.5">
          {index >= 5 ? <Check className="text-good size-3" /> : <X className="text-bad size-3" />}
          student price of ₹105 is ₹94.50
        </p>
        {index < 5 && (
          <p className="text-muted pl-[18px] text-[10px]">expected 94.5, received 94</p>
        )}
      </motion.div>
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "change",
    kicker: "Friday, 5 pm",
    title: "A small change",
    body: (
      <p>
        Noor looks after the ordering site of a made-up café. The owner wants a 10% student discount
        by the weekend. It&apos;s one line of code. Noor tries one order by hand, the total looks
        right, and the change goes live.
      </p>
    ),
  },
  {
    id: "bug",
    kicker: "The line",
    title: "A bug hiding in plain sight",
    body: (
      <p>
        <code>Math.floor</code> rounds down to a whole rupee. On Noor&apos;s test order the price
        happened to be a round number, so nothing looked odd.
      </p>
    ),
  },
  {
    id: "weekend",
    kicker: "Saturday and Sunday",
    title: "Customers find it",
    body: (
      <p>
        Hundreds of student orders are charged the wrong amount. On Monday the accountant spots that
        the till doesn&apos;t match. Nobody knows which change caused it, so it takes a day to find,
        plus refunds and an apology.
      </p>
    ),
  },
  {
    id: "cost",
    kicker: "The pattern",
    title: "Late bugs cost more",
    body: (
      <p>
        The fix was one word. What cost a day was finding the bug, long after the change, with real
        customers affected. The later a bug is found, the further it is from the change that caused
        it. There&apos;s no fixed multiplier (the popular &ldquo;100 times&rdquo; figure has no
        traceable source), but the direction is clear.
      </p>
    ),
  },
  {
    id: "replay",
    kicker: "Replay Friday",
    title: "Now with a test",
    body: (
      <p>
        This time Noor first writes a <Term id="test">test</Term>: a few lines of code that call{" "}
        <code>studentPrice</code> with an awkward price and check the answer. The{" "}
        <Term id="test-runner">test runner</Term> fails it in under a second, with a message saying
        exactly what is wrong.
      </p>
    ),
  },
  {
    id: "net",
    kicker: "And forever after",
    title: "A safety net that stays",
    body: (
      <p>
        Noor fixes the rounding and the test passes. It stays in the project and runs on every
        future change, so this bug can never quietly come back. That is the real job of tests:
        letting you change code without fear.
      </p>
    ),
  },
];

export function FridayChange() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            One line on a Friday
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            How a tiny change becomes a lost Monday, and what a test changes.
          </p>
        </div>
      }
    />
  );
}
