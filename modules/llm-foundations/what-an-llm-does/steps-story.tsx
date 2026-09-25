"use client";

import { AnimatePresence, motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

/* 1 ─ From autocomplete to assistant ⭐ ------------------------------------------------------------- */

const SECTIONS: StorySection[] = [
  {
    id: "phone",
    kicker: "Phone",
    title: "Your phone already does this",
    body: (
      <>
        <p>
          Type &ldquo;See you&rdquo; on your phone and it suggests &ldquo;tomorrow&rdquo;,
          &ldquo;soon&rdquo; or &ldquo;later&rdquo;. It has learned which words usually come next.
        </p>
        <p>
          A <Term id="llm">large language model</Term> is the same idea, made enormous: it{" "}
          <Term id="next-token-prediction">predicts what comes next</Term> in a piece of text.
        </p>
      </>
    ),
  },
  {
    id: "count",
    kicker: "Counting",
    title: "Guessing by counting",
    body: (
      <>
        <p>
          The simplest predictor just counts. Read a lot of text, and note which word follows which.
          After &ldquo;masala&rdquo;, it has only ever seen &ldquo;chai&rdquo;; after
          &ldquo;the&rdquo;, lots of words are possible.
        </p>
        <p>
          The guess isn&apos;t one word: it&apos;s a list of possibilities, each with a probability.
        </p>
      </>
    ),
  },
  {
    id: "context",
    kicker: "Context",
    title: "More context, better guesses",
    body: (
      <>
        <p>
          &ldquo;…of ___&rdquo; could be almost anything. &ldquo;A cup of ___&rdquo; is probably a
          drink. &ldquo;She ordered her usual cup of ___&rdquo;, in a story about a tea stall, is
          almost certainly chai.
        </p>
        <p>The more of the text a predictor can take into account, the better it guesses.</p>
      </>
    ),
  },
  {
    id: "learn",
    kicker: "Learning",
    title: "Learning patterns instead of counting",
    body: (
      <>
        <p>
          Counting breaks down fast: most long phrases have never been seen before. Instead, an LLM
          is a neural network with billions of adjustable numbers, trained on trillions of words
          until it predicts well.
        </p>
        <p>
          Along the way it picks up grammar, facts, styles, even some reasoning, because all of
          those help it guess the next word.
        </p>
      </>
    ),
  },
  {
    id: "loop",
    kicker: "Loop",
    title: "One piece at a time",
    body: (
      <>
        <p>
          To write a whole answer, the model predicts, picks a word, adds it to the text, and
          predicts again. Every word of a reply comes out of that loop.
        </p>
        <p>
          Models actually work in <em>tokens</em>, pieces of words, rather than whole words.
          That&apos;s the next module.
        </p>
      </>
    ),
  },
];

const PHONE: [string, number][] = [
  ["tomorrow", 0.46],
  ["soon", 0.31],
  ["later", 0.23],
];
const COUNT: [string, [string, number][]][] = [
  ["masala", [["chai", 1]]],
  [
    "the",
    [
      ["cafe", 0.38],
      ["barista", 0.23],
      ["bread", 0.08],
      ["coffee", 0.08],
      ["other", 0.23],
    ],
  ],
];
const CONTEXTS: [string, [string, number][]][] = [
  [
    "…of",
    [
      ["the", 0.3],
      ["course", 0.12],
      ["coffee", 0.06],
      ["them", 0.05],
    ],
  ],
  [
    "a cup of",
    [
      ["coffee", 0.45],
      ["tea", 0.3],
      ["chai", 0.15],
      ["water", 0.05],
    ],
  ],
  [
    "…at the tea stall, she ordered her usual cup of",
    [
      ["chai", 0.86],
      ["tea", 0.1],
      ["coffee", 0.02],
    ],
  ],
];
const LOOP = ["The", "cafe", "opens", "at", "seven", "in", "the", "morning", "."];

function Bars({ items, accent }: { items: [string, number][]; accent?: boolean }) {
  return (
    <div className="grid gap-1.5">
      {items.map(([w, p]) => (
        <div key={w} className="flex items-center gap-2 text-xs">
          <span className="w-20 shrink-0 truncate text-right font-mono">{w}</span>
          <span className="bg-surface-2 relative h-3 flex-1 overflow-hidden rounded">
            <motion.span
              className={cn(
                "absolute inset-y-0 left-0 rounded",
                accent ? "bg-accent" : "bg-viz-data/70",
              )}
              initial={{ width: 0 }}
              animate={{ width: `${p * 100}%` }}
              transition={{ duration: 0.6 }}
            />
          </span>
          <span className="text-muted w-10 text-right font-mono">{Math.round(p * 100)}%</span>
        </div>
      ))}
    </div>
  );
}

function Scene({ stage }: { stage: number }) {
  return (
    <div className="flex h-full items-center justify-center p-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          {stage === 0 && (
            <div className="border-line bg-surface mx-auto w-64 rounded-3xl border p-3 shadow-sm">
              <div className="bg-accent-soft ml-auto w-fit rounded-2xl px-3 py-1.5 text-sm">
                See you
              </div>
              <div className="border-line mt-16 flex justify-between gap-1 border-t pt-2">
                {PHONE.map(([w]) => (
                  <span key={w} className="bg-surface-2 flex-1 rounded-lg py-1 text-center text-xs">
                    {w}
                  </span>
                ))}
              </div>
              <div className="mt-3">
                <Bars items={PHONE} accent />
              </div>
              <p className="text-subtle mt-2 text-center text-[10px]">Illustrative numbers</p>
            </div>
          )}
          {stage === 1 && (
            <div className="grid gap-4">
              {COUNT.map(([w, items]) => (
                <div key={w} className="border-line bg-surface rounded-xl border p-3">
                  <p className="text-muted mb-2 text-xs">
                    After <span className="text-fg font-mono">&ldquo;{w}&rdquo;</span> the text had:
                  </p>
                  <Bars items={items} />
                </div>
              ))}
            </div>
          )}
          {stage === 2 && (
            <div className="grid gap-3">
              {CONTEXTS.map(([ctx, items], i) => (
                <motion.div
                  key={ctx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.25 }}
                  className="border-line bg-surface rounded-xl border p-3"
                >
                  <p className="mb-2 font-mono text-xs">{ctx} ___</p>
                  <Bars items={items} accent={i === 2} />
                </motion.div>
              ))}
              <p className="text-subtle text-center text-[10px]">Illustrative numbers</p>
            </div>
          )}
          {stage === 3 && (
            <svg viewBox="0 0 300 180" className="w-full" aria-label="A neural network">
              {[0, 1, 2, 3].map((layer) =>
                Array.from({ length: 5 }, (_, i) => {
                  const x = 40 + layer * 73;
                  const y = 20 + i * 35;
                  return (
                    <g key={`${layer}-${i}`}>
                      {layer < 3 &&
                        Array.from({ length: 5 }, (_, j) => (
                          <motion.line
                            key={j}
                            x1={x}
                            y1={y}
                            x2={x + 73}
                            y2={20 + j * 35}
                            stroke="var(--accent)"
                            initial={{ opacity: 0.05 }}
                            animate={{ opacity: [0.05, 0.5, 0.05] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: (layer * 5 + i + j) * 0.07,
                            }}
                          />
                        ))}
                      <circle cx={x} cy={y} r={7} fill="var(--surface)" stroke="var(--accent)" />
                    </g>
                  );
                }),
              )}
              <text x={40} y={177} textAnchor="middle" className="fill-muted text-[8px]">
                text in
              </text>
              <text x={259} y={177} textAnchor="middle" className="fill-muted text-[8px]">
                next-word guess
              </text>
            </svg>
          )}
          {stage === 4 && <LoopScene />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function LoopScene() {
  return (
    <div className="border-line bg-surface rounded-xl border p-4">
      <p className="flex flex-wrap gap-1 font-mono text-sm">
        {LOOP.map((w, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.45 }}
            className={cn("rounded px-1", i === LOOP.length - 1 ? "" : "bg-accent-soft")}
          >
            {w}
          </motion.span>
        ))}
      </p>
      <div className="text-muted mt-4 flex items-center justify-center gap-2 text-[11px]">
        {["predict", "pick", "append", "repeat"].map((s, i) => (
          <span key={s} className="flex items-center gap-2">
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.45 }}
              className="border-line rounded-full border px-2 py-0.5"
            >
              {s}
            </motion.span>
            {i < 3 && <span>→</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Autocomplete() {
  return (
    <ScrollStory
      sections={SECTIONS}
      renderScene={(i) => <Scene stage={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            From autocomplete to assistant
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            The one idea behind every chat assistant, built up from your phone keyboard.
          </p>
        </div>
      }
    />
  );
}
