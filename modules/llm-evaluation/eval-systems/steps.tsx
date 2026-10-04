"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { GRADERS, QUESTION, RAG_CASES, RUNS, grade, triad } from "./model";
import type { SystemsState } from "./state";

/* 1 ─ Inspecting a restaurant --------------------------------------------------------------------- */

export function Restaurant() {
  const parts: [string, string][] = [
    ["Ingredients", "Did the kitchen get the right produce?"],
    ["Cooking", "Did the chef use only what was there, properly?"],
    ["Serving", "Did the diner get the dish they ordered?"],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="Inspecting a restaurant"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {parts.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}: </span>
              <span className="text-muted">{d}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A food inspector doesn&apos;t just taste the dish. A bad meal could come from bad
        ingredients, bad cooking or the wrong order reaching the table, and each needs a different
        fix.
      </p>
      <p>
        Real AI systems have stages too. A RAG system retrieves passages and then writes an answer;
        an agent calls tools and changes things. To fix them you need to know which stage broke, so
        you score each stage as well as the end result.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Evaluate a RAG answer ⭐ -------------------------------------------------------------------- */

function Meter({ label, v }: { label: string; v: number }) {
  return (
    <div className="border-line bg-surface rounded-lg border px-2.5 py-1.5 text-xs">
      <p className="text-subtle text-[10px]">{label}</p>
      <div className="bg-surface-2 mt-1 h-2 overflow-hidden rounded">
        <motion.div
          animate={{ width: `${Math.round(v * 100)}%` }}
          className={cn("h-full", v > 0.8 ? "bg-good" : v > 0.5 ? "bg-viz-compute" : "bg-bad")}
        />
      </div>
      <p className="mt-0.5 font-mono">{v.toFixed(2)}</p>
    </div>
  );
}

export function RagTriad() {
  const [s, set] = useSceneState<SystemsState>();
  const c = RAG_CASES.find((x) => x.id === s.rag) ?? RAG_CASES[0];
  const t = triad(c);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Evaluate a RAG answer"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {RAG_CASES.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.rag === x.id}
                onClick={() => set({ rag: x.id })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px]",
                  s.rag === x.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {x.name}
              </button>
            ))}
          </div>
          <p className="text-xs">
            <span className="text-muted">Question: </span>
            {QUESTION}
          </p>
          <div className="flex flex-col gap-1">
            <p className="text-subtle text-[10px]">RETRIEVED PASSAGES</p>
            {c.passages.map((p) => (
              <p
                key={p.text}
                className={cn(
                  "rounded-lg border px-2.5 py-1 text-[11px]",
                  p.relevant ? "border-good/60 bg-good/5" : "border-line bg-surface text-muted",
                )}
              >
                {p.text}
              </p>
            ))}
          </div>
          <div>
            <p className="text-subtle text-[10px]">ANSWER, SPLIT INTO CLAIMS</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {c.claims.map((x) => (
                <span
                  key={x.text}
                  className={cn(
                    "rounded px-2 py-0.5 text-[11px]",
                    x.supported ? "bg-good/20" : "bg-bad/25",
                  )}
                >
                  {x.text} {x.supported ? "✓" : "✗ unsupported"}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <Meter label="Context relevance" v={t.ctx} />
            <Meter label="Groundedness" v={t.grounded} />
            <Meter label="Answer relevance" v={t.relevance} />
          </div>
          <p className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
            {c.diagnosis}
          </p>
          <p className="text-subtle text-[10px]">Illustrative scores.</p>
        </div>
      }
    >
      <p>
        The <Term id="rag-triad">RAG triad</Term> checks three things: were the retrieved passages
        relevant, is every claim in the answer backed by them (
        <Term id="faithfulness">groundedness</Term>), and does the answer address the question? Step
        through four cases.
      </p>
      <p>
        Notice &ldquo;Retriever missed it&rdquo;: the answer is wrong yet perfectly faithful to what
        it was given. The triad shows which stage to fix, and none of it can rescue a knowledge base
        that&apos;s wrong. Tools such as Ragas add retrieval scores like context precision and
        recall, which need a reference answer.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Grade an agent run -------------------------------------------------------------------------- */

export function AgentRun() {
  const [s, set] = useSceneState<SystemsState>();
  const r = RUNS.find((x) => x.id === s.run) ?? RUNS[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Grade an agent run"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {RUNS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.run === x.id}
                onClick={() => set({ run: x.id })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px]",
                  s.run === x.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {x.name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1 font-mono text-[11px]">
            {r.calls.map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span className="text-subtle">→</span>}
                <span className="bg-viz-compute/20 rounded px-1.5 py-0.5">{c}()</span>
              </span>
            ))}
            <span className="text-subtle">→</span>
            <span className={cn("rounded px-1.5 py-0.5", r.booked ? "bg-good/20" : "bg-bad/25")}>
              {r.booked ? "booking in database" : "no booking"}
            </span>
          </div>
          <div className="border-line bg-surface flex flex-col rounded-lg border">
            {GRADERS.map((g, i) => {
              const ok = grade(g.id, r);
              return (
                <div
                  key={g.id}
                  className={cn(
                    "border-line flex items-center justify-between px-3 py-1.5 text-xs",
                    i > 0 && "border-t",
                  )}
                >
                  <span>{g.name}</span>
                  <span className={ok ? "text-good" : "text-bad"}>{ok ? "pass" : "fail"}</span>
                </div>
              );
            })}
          </div>
          <p className="text-muted text-xs">{r.note}</p>
        </div>
      }
    >
      <p>
        An agent can be graded on its outcome (is the booking really in the database?) and on its{" "}
        <Term id="trajectory-eval">trajectory</Term> (which tools it called, in what order).
        Frameworks offer strict and relaxed path checks.
      </p>
      <p>
        Anthropic warns that exact-path checks are brittle: agents find valid routes you didn&apos;t
        plan for. Grade the outcome first, and add path checks only where a rule demands an order,
        like checking availability before booking.
      </p>
    </StepLayout>
  );
}

/* 4 ─ The parts and the whole --------------------------------------------------------------------- */

export function PartsAndWhole() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The parts and the whole"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Component evals</p>
              <p className="text-muted mt-0.5">
                Score retrieval, each tool, each prompt on its own. Fast, and they point at the
                broken part.
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">End-to-end evals</p>
              <p className="text-muted mt-0.5">
                Score the whole task as a user experiences it. Slower, and the only proof users are
                served.
              </p>
            </div>
          </div>
          <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Reliability compounds</p>
            <p className="mt-1">
              An agent that succeeds 75% of the time on one try succeeds on three tries in a row
              only about <span className="font-mono">42%</span> of the time (0.75³). That&apos;s
              pass^k from module 11, and why agent evals run each task several times.
            </p>
          </div>
        </div>
      }
    >
      <p>
        You need both kinds. Component evals find the broken step quickly; end-to-end evals tell you
        whether the whole thing works. A system can pass every component test and still fail users
        when the parts meet.
      </p>
      <p>
        For agents, run each task several times and report how often it succeeds every time, not
        just once.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Where did it break? ------------------------------------------------------------------------- */

export function WhereBroke() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Where did it break?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="where-broke"
            prompt="Which stage needs fixing?"
            categories={[
              { id: "retrieve", label: "Retrieval" },
              { id: "generate", label: "Generation" },
              { id: "act", label: "Agent action" },
            ]}
            items={[
              {
                id: "nopassage",
                label: "The needed policy passage was never fetched",
                category: "retrieve",
                why: "Low context relevance or recall.",
              },
              {
                id: "invent",
                label: "The answer adds a discount no passage mentions",
                category: "generate",
                why: "Low groundedness.",
              },
              {
                id: "nobook",
                label: "It said “booked” but nothing is in the database",
                category: "act",
                why: "Outcome check fails.",
              },
              {
                id: "order",
                label: "It booked without checking availability first",
                category: "act",
                why: "A required step was skipped.",
              },
              {
                id: "topic",
                label: "Right passages, but it answered a different question",
                category: "generate",
                why: "Low answer relevance.",
              },
            ]}
            explanation="Score each stage so you know where to look: retrieval, generation, or the agent's actions."
          />
        </div>
      }
    >
      <p>Sort the failures.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Score each stage", "So you know what to fix."],
  ["The RAG triad", "Context relevance, groundedness, answer relevance."],
  ["Faithful isn't correct", "Bad retrieval gives faithful wrong answers."],
  ["Outcome first for agents", "Path checks only where order matters."],
  ["Run agent tasks several times", "Reliability compounds."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {POINTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>Next: testing for harm, deliberately.</p>
    </StepLayout>
  );
}
