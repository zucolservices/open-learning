"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

const CLOCK = ["9:05", "9:40", "11:15", "11:20", "11:21", "Later"];

function Scene({ index }: { index: number }) {
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-5">
      <div className="flex items-center justify-between">
        <span className="text-muted text-[10px]">made-up café chain · support rota</span>
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-accent font-mono text-sm"
        >
          {CLOCK[index]}
        </motion.span>
      </div>
      <div className="border-bad/40 bg-bad/10 rounded-lg border px-3 py-2 text-xs">
        Bug report: Saturday orders are getting double loyalty points.
      </div>
      <div className="border-line bg-surface rounded-lg border p-3 font-mono text-[10.5px]">
        {[
          "function p(o) {",
          "  let r = 0;",
          "  for (let i = 0; i < o.l.length; i++) {",
          "    if (o.l[i].c != 3) {",
          "      r += Math.floor(o.l[i].q * o.l[i].p / 10);",
          "    }",
          "  }",
          "  if (new Date(o.t).getDay() % 6 == 0) r *= 2;",
          "  return r;",
          "}",
        ].map((l, i) => (
          <pre
            key={i}
            className={cn(
              "whitespace-pre",
              index >= 3 && i === 7 && "bg-bad/20",
              index >= 1 && index < 3 && i >= 2 && i <= 5 && "bg-accent/10",
            )}
          >
            {l}
          </pre>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
        <div className="border-line bg-surface rounded border px-2 py-1">
          <p className="text-muted">reading</p>
          <motion.p animate={{ opacity: index >= 3 ? 1 : 0.3 }} className="font-mono text-sm">
            2 h 10 min
          </motion.p>
        </div>
        <div className="border-line bg-surface rounded border px-2 py-1">
          <p className="text-muted">typing the fix</p>
          <motion.p animate={{ opacity: index >= 4 ? 1 : 0.3 }} className="font-mono text-sm">
            1 min
          </motion.p>
        </div>
      </div>
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "report",
    kicker: "9:05",
    title: "A small bug",
    body: (
      <p>
        Rina is on the support rota for a made-up café chain. A bug report comes in: customers get
        double loyalty points on Saturdays, but the rule says Sundays only. It sounds like a
        five-minute job.
      </p>
    ),
  },
  {
    id: "decode",
    kicker: "9:40",
    title: "Decoding",
    body: (
      <p>
        The function is called <code>p</code>. Its argument is <code>o</code>. What&apos;s{" "}
        <code>o.l</code>? Why is category 3 skipped? Rina opens three other files to find out that{" "}
        <code>l</code> means lines and 3 means gift cards.
      </p>
    ),
  },
  {
    id: "found",
    kicker: "11:15",
    title: "There it is",
    body: (
      <p>
        <code>getDay() % 6 == 0</code>. Day 0 is Sunday; day 6 is Saturday. Both divide by 6 with
        nothing left over. Someone was being clever.
      </p>
    ),
  },
  {
    id: "fix",
    kicker: "11:20",
    title: "The fix takes a minute",
    body: (
      <p>
        <code>getDay() === 0</code>. The change is a few characters. Rina spent over two hours
        reading and one minute writing.
      </p>
    ),
  },
  {
    id: "pattern",
    kicker: "The pattern",
    title: "Most of programming is reading",
    body: (
      <p>
        Robert C. Martin estimated that programmers read code more than ten times as much as they
        write it. Studies that watched developers at work found them spending around 58% to 70% of
        their time understanding code. Every minute saved for the reader pays back many times.
      </p>
    ),
  },
  {
    id: "clean",
    kicker: "Later",
    title: "What clean code means here",
    body: (
      <p>
        <Term id="clean-code">Clean code</Term> isn&apos;t about being pretty or clever. It&apos;s
        code the next person can understand quickly and change safely. Rina renames <code>p</code>{" "}
        to <code>loyaltyPoints</code> while she&apos;s there, so the next person doesn&apos;t lose
        their morning.
      </p>
    ),
  },
];

export function TwoLineFix() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            A two-hour, one-minute fix
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            Where the time on a small bug actually goes.
          </p>
        </div>
      }
    />
  );
}
