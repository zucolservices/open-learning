"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

const CALLS: { title: string; turns: [string, number, number][] }[] = [
  {
    title: "Two friends",
    turns: [
      ["A", 0, 22],
      ["B", 23, 40],
      ["A", 41, 58],
      ["B", 59, 80],
    ],
  },
  {
    title: "An old voice bot",
    turns: [
      ["You", 0, 18],
      ["Bot", 46, 68],
      ["You", 70, 84],
    ],
  },
];

function Scene({ index }: { index: number }) {
  return (
    <div className="flex h-full flex-col justify-center gap-6 p-6">
      {CALLS.map((c, ci) => (
        <motion.div
          key={c.title}
          animate={{ opacity: ci === 0 || index >= 2 ? 1 : 0.15 }}
          className="flex flex-col gap-1"
        >
          <p className="text-muted text-[10px] uppercase">{c.title}</p>
          <div className="bg-surface-2 relative h-8 rounded">
            {c.turns.map(([who, a, b], i) => (
              <span
                key={i}
                className={cn(
                  "absolute top-1 bottom-1 flex items-center rounded px-1 text-[10px]",
                  who === "A" || who === "You" ? "bg-viz-data/50" : "bg-accent/60",
                )}
                style={{ left: `${a}%`, width: `${b - a}%` }}
              >
                {who}
              </span>
            ))}
            {ci === 1 && index >= 2 && (
              <span className="text-bad absolute -bottom-5 text-[10px]" style={{ left: "20%" }}>
                ← 2.8 seconds of silence →
              </span>
            )}
          </div>
        </motion.div>
      ))}
      <motion.p animate={{ opacity: index >= 1 ? 1 : 0 }} className="text-muted text-xs">
        Gaps between friends: often 0–200 ms. Planning a single word takes about 600 ms, so they
        plan while still listening.
      </motion.p>
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "friends",
    kicker: "Listen in",
    title: "Two friends on the phone",
    body: (
      <p>
        Listen to two friends talk and you&apos;ll barely hear a gap. A study of ten languages found
        people usually start replying within about 0 to 200 milliseconds of the other person
        stopping. This dance is called <Term id="turn-taking">turn-taking</Term>.
      </p>
    ),
  },
  {
    id: "planning",
    kicker: "The trick",
    title: "They plan while listening",
    body: (
      <p>
        Producing even a single word takes the brain about 600 milliseconds to plan. So people
        can&apos;t wait until you&apos;ve finished: they predict where you&apos;re going and prepare
        their answer as you speak.
      </p>
    ),
  },
  {
    id: "bot",
    kicker: "Now a machine",
    title: "The slow voice bot",
    body: (
      <p>
        Early voice assistants built on large language models chained three separate models: one to
        transcribe, one to think, one to speak. OpenAI&apos;s own figures for its first ChatGPT
        voice mode: 2.8 to 5.4 seconds on average. Pauses of around 600 ms already start to sound
        like hesitation.
      </p>
    ),
  },
  {
    id: "today",
    kicker: "The challenge",
    title: "Hear, think and speak in under a second",
    body: (
      <p>
        In 2024 GPT-4o showed a model answering spoken questions in about 320 milliseconds on
        average, by OpenAI&apos;s measure. Builders of <Term id="voice-agent">voice agents</Term>{" "}
        commonly aim for half a second to under a second from when you stop talking to when the
        agent starts. That&apos;s what this track is about.
      </p>
    ),
  },
];

export function TwoCalls() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Two phone calls
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            Why a few hundred milliseconds decide whether talking to software feels natural.
          </p>
        </div>
      }
    />
  );
}
