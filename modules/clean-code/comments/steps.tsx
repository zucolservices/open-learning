"use client";

import { motion } from "motion/react";
import { Wrench } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { Code } from "../_shared/code";
import { AFTER, BEFORE, KINDS, type Kind } from "./model";
import type { CommentsState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Signs() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Signs in the café"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-3">
          {[
            ["“This is a door”", "Says what you can already see.", "border-line bg-surface"],
            ["“Push” on a pull door", "Worse than no sign at all.", "border-bad/50 bg-bad/10"],
            [
              "“Mind the step: the floor drops 10 cm”",
              "Says what you can't see.",
              "border-accent bg-accent-soft",
            ],
          ].map(([t, b, c], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i }}
              className={cn("rounded-xl border p-3 text-xs", c)}
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A café full of signs saying &ldquo;door&rdquo; and &ldquo;chair&rdquo; is noisy. A sign
        saying &ldquo;push&rdquo; on a door you pull is worse than nothing. The sign worth having
        warns about the step you can&apos;t see.
      </p>
      <p>
        Comments are the same. The useful ones say what the code can&apos;t: why a decision was
        made, a warning, the rule behind a number. Comments that repeat the code are noise, and when
        the code changes and the comment doesn&apos;t, they start to lie.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Classify and fix ⭐ --------------------------------------------------------------------------- */

export function Classify() {
  const [s, set] = useSceneState<CommentsState>();
  const commented = BEFORE.map((l, i) => ({ ...l, i })).filter((l) => l.comment);
  const allLabelled = commented.every((c) => s.labels[c.i]);
  const label = (i: number, k: Kind) => set({ labels: { ...s.labels, [i]: k } });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Sort the comments, then fix the code"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {!s.fixed ? (
            <>
              <Code
                lines={BEFORE.map((l) => l.text)}
                marks={Object.fromEntries(
                  commented.map((c) => [
                    c.i,
                    s.labels[c.i] ? (s.labels[c.i] === c.comment!.kind ? "good" : "bad") : "hot",
                  ]),
                )}
                title="checkout.js"
              />
              <div className="grid gap-1">
                {commented.map((c) => {
                  const mine = s.labels[c.i];
                  return (
                    <div
                      key={c.i}
                      className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
                    >
                      <p className="text-muted font-mono text-[10px]">
                        line {c.i + 1}: {c.text.trim().slice(0, 56)}…
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {KINDS.map((k) => (
                          <button
                            key={k.id}
                            type="button"
                            aria-pressed={mine === k.id}
                            onClick={() => label(c.i, k.id)}
                            className={cn(
                              "rounded-full border px-2 py-0.5 text-[10px]",
                              mine === k.id
                                ? k.id === c.comment!.kind
                                  ? "border-good bg-good/20"
                                  : "border-bad bg-bad/15"
                                : "border-line text-muted",
                            )}
                          >
                            {k.label}
                          </button>
                        ))}
                      </div>
                      {mine && (
                        <p
                          className={cn(
                            "mt-0.5 text-[10px]",
                            mine === c.comment!.kind ? "text-good" : "text-muted",
                          )}
                        >
                          {mine === c.comment!.kind
                            ? c.comment!.why
                            : "Look again: what does this comment add that the code doesn't?"}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              {allLabelled && (
                <button
                  type="button"
                  onClick={() => set({ fixed: true })}
                  className="bg-accent text-accent-fg flex w-fit items-center gap-1.5 rounded-full px-4 py-1 text-xs font-medium"
                >
                  <Wrench className="size-3" /> Fix the code
                </button>
              )}
            </>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-2">
              <Code lines={AFTER} title="checkout.js, after" />
              <p className="text-xs">
                Names replaced the redundant comments, a constant fixed the lie, and a function name
                replaced the explanation. Two comments survive: the interface description and the
                warning, because only a comment can say those.
              </p>
              <button
                type="button"
                onClick={() => set({ fixed: false })}
                className="border-line-strong w-fit rounded-full border px-3 py-1 text-xs"
              >
                Show the original
              </button>
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        This file has five comments. Label each one, then fix the code so it needs fewer of them.
      </p>
      <p>
        A good test for any comment: if the code changed, would this comment still be true? And does
        it say anything the code doesn&apos;t?
      </p>
    </StepLayout>
  );
}

/* 3 ─ Two schools ---------------------------------------------------------------------------------- */

const SCHOOLS = {
  martin: {
    who: "Robert C. Martin, Clean Code (2008)",
    quote:
      "“The proper use of comments is to compensate for our failure to express ourself in code.”",
    points: [
      "Rewrite unclear code rather than comment it",
      "Comments drift and lie as code changes",
      "Still lists good comments: intent, warnings, legal notices, TODOs",
    ],
  },
  ousterhout: {
    who: "John Ousterhout, A Philosophy of Software Design (2018)",
    quote: "Comments capture design information that can't be expressed in code.",
    points: [
      "Describe what an interface promises",
      "Explain why, units, and assumptions",
      "Write the interface comment first, as a design tool",
    ],
  },
} as const;

export function TwoSchools() {
  const [s, set] = useSceneState<CommentsState>();
  const v = SCHOOLS[s.view];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Two schools of thought"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1">
            {(["martin", "ousterhout"] as const).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.view === k}
                onClick={() => set({ view: k })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.view === k
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line-strong text-muted",
                )}
              >
                {k === "martin" ? "Fewer comments" : "Comments as design"}
              </button>
            ))}
          </div>
          <motion.div
            key={s.view}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
          >
            <p className="text-muted text-[10px]">{v.who}</p>
            <p className="mt-1 font-medium">{v.quote}</p>
            <ul className="text-muted mt-1 grid gap-0.5">
              {v.points.map((p) => (
                <li key={p}>· {p}</li>
              ))}
            </ul>
          </motion.div>
          <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Common ground</p>
            <p className="text-muted">
              What and how belong in the code: names and small functions. Why, and what callers can
              rely on, belong in comments.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Experts genuinely disagree about how many comments good code needs. Martin calls comments a
        sign the code failed to explain itself, yet still lists kinds worth writing. Ousterhout sees
        them as an essential place for design knowledge.
      </p>
      <p>
        Both accept comments that explain <em>why</em>. Start there, and let your team&apos;s
        conventions settle the rest.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Doc comments --------------------------------------------------------------------------------- */

export function DocComments() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Comments for the people who call your code"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <Code
            numbers={false}
            title="Python docstring"
            lines={[
              "def total(basket, customer):",
              '    """Return the total in rupees, including GST.',
              "",
              "    Raises ValueError if the basket is empty.",
              '    """',
            ]}
          />
          <Code
            numbers={false}
            title="Go doc comment: starts with the name"
            lines={[
              "// Total returns the basket total in rupees, including GST.",
              "// It returns an error if the basket is empty.",
              "func Total(b Basket, c Customer) (float64, error)",
            ]}
          />
          <Code
            numbers={false}
            title="Java / JavaScript: Javadoc and JSDoc"
            lines={[
              "/**",
              " * Total in rupees, including GST.",
              " * @throws EmptyBasketException if the basket is empty",
              " */",
            ]}
          />
        </div>
      }
    >
      <p>
        <Term id="doc-comment">Doc comments</Term> on a function&apos;s <em>interface</em> are a
        different kind: they describe what callers can rely on, not how it works inside. Editors
        show them on hover, and tools turn them into reference documentation.
      </p>
      <p>
        Each language has conventions: Python docstrings (PEP 257), Go doc comments that start with
        the name, Javadoc and JSDoc. Keep them short and true; a small example is often the most
        useful line.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function CommentsCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Keep it or cut it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="clean-comments"
            prompt="Should each comment stay, or be replaced by better code?"
            categories={[
              { id: "keep", label: "Keep" },
              { id: "replace", label: "Replace with code" },
            ]}
            items={[
              {
                id: "inc",
                label: "// add one to count",
                category: "replace",
                why: "count++ already says it.",
              },
              {
                id: "why",
                label: "// Retry once: the bank's API drops the first request after idle",
                category: "keep",
                why: "A reason the code can't express.",
              },
              {
                id: "magic",
                label: "// 86400 = seconds in a day",
                category: "replace",
                why: "const SECONDS_PER_DAY = 86400.",
              },
              {
                id: "doc",
                label: "/** Returns null if the table isn't free. */",
                category: "keep",
                why: "An interface promise callers rely on.",
              },
              {
                id: "block",
                label: "// ---- send the email ----",
                category: "replace",
                why: "Extract a sendReceipt function.",
              },
            ]}
            explanation="Keep comments that explain why, warn, or describe an interface. Replace comments that a name, constant or function could say instead."
          />
        </div>
      }
    >
      <p>Sort each comment.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Explain why, not what", "The code already says what."],
        ["Comments can lie", "Code changes; comments are left behind."],
        ["Prefer names first", "A constant or function name can replace many comments."],
        ["Interfaces deserve comments", "What callers can rely on."],
        ["Warnings and reasons stay", "Only a comment can say them."],
      ]}
    >
      <p>
        That&apos;s the foundations. Next chapter: shape and simplicity, starting with formatting.
      </p>
    </WrapStep>
  );
}
