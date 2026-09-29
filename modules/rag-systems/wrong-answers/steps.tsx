"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import data from "./data.json";
import type { WrongState } from "./state";

type Stage = "parse" | "chunk" | "search" | "fresh" | "prompt" | "model";

const STAGES: [Stage, string, string][] = [
  ["parse", "Parse", "Turn files into text"],
  ["chunk", "Chunk", "Cut the text into pieces"],
  ["search", "Search", "Find the best pieces"],
  ["fresh", "Index freshness", "Is the index up to date?"],
  ["prompt", "Prompt", "What the model was given"],
  ["model", "Model", "What it wrote"],
];

const CASES = data.cases;

/** Answers were capped in length; mark the ones that were cut off. */
const ended = (t: string) => (t.length < 40 || /[.!?)\]।]$/.test(t.trim()) ? t : `${t}…`);

/* 1 ─ The car that won't start ------------------------------------------------------------------ */

export function CarWontStart() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="The car that won't start"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            "Fuel in the tank?",
            "Battery charged?",
            "Spark reaching the engine?",
            "Engine turning over?",
          ].map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface flex items-center gap-2 rounded-xl border px-4 py-2 text-sm"
            >
              <span className="text-muted font-mono">{i + 1}</span>
              {t}
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A good mechanic doesn&apos;t replace the engine because the car won&apos;t start. They check
        in order, from where the trouble would begin: fuel, battery, spark. The first thing that
        fails is usually the cause, and everything after it is just a symptom.
      </p>
      <p>
        A RAG system that answers wrong is the same. The wrong answer comes out of the model, but
        the cause is often earlier: in parsing, chunking, search or a stale index. Practitioners put
        it simply: &ldquo;focus on the first upstream failure&rdquo;.
      </p>
      <p>
        This last module is five real wrong answers from this track. Find where each went wrong.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Reading a trace --------------------------------------------------------------------------- */

export function ReadTrace() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Reading a trace"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {STAGES.map(([k, n, d], i) => (
              <div key={k} className="flex items-center gap-1.5">
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="border-line bg-surface rounded-lg border px-2.5 py-1.5"
                >
                  <p className="text-xs font-semibold">{n}</p>
                  <p className="text-muted text-[10px]">{d}</p>
                </motion.div>
                {i < STAGES.length - 1 && <ArrowRight className="text-muted size-3.5" />}
              </div>
            ))}
          </div>
          <div className="border-line bg-surface-2 rounded-xl border px-3 py-2 text-xs">
            <p className="font-semibold">What a good trace records for one question</p>
            <ul className="text-muted mt-1 list-disc pl-4">
              <li>The question, and any rewrite of it</li>
              <li>
                Every passage retrieved, with its id, score and text, before and after reranking
              </li>
              <li>Which documents and versions the index held</li>
              <li>The exact prompt sent, and the model&apos;s reply</li>
            </ul>
          </div>
        </div>
      }
    >
      <p>
        You can&apos;t debug what you can&apos;t see. A <Term id="trace">trace</Term> records what
        each stage did for one question, so you can walk along it and find the first stage that went
        wrong.
      </p>
      <p>
        Tools do this: OpenTelemetry has emerging conventions for AI calls (including retrieval),
        OpenInference adds retriever and reranker steps with the passages themselves, and Langfuse,
        Arize Phoenix, LangSmith and MLflow show traces; the big clouds have their own. Whatever the
        tool, log the passages&apos; text, not just their ids.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Five wrong answers ⭐ (real traces) -------------------------------------------------------- */

export function Investigate() {
  const [s, set] = useSceneState<WrongState>();
  const c = CASES[s.c];
  const pick = s.picks[c.id] as Stage | undefined;
  const right = pick === c.fault;
  const trace = c.trace as Record<Stage, string>;
  return (
    <StepLayout
      eyebrow="Fix the problem · real output"
      title="Five wrong answers"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {CASES.map((x, i) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.c === i}
                onClick={() => set({ c: i, open: "" })}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px]",
                  s.c === i ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                  s.picks[x.id] === x.fault && s.c !== i && "text-muted",
                )}
              >
                {i + 1}. {x.title}
              </button>
            ))}
          </div>
          <div className="border-line bg-surface rounded-xl border px-3 py-2 text-xs">
            <p className="text-sm font-medium">{c.q}</p>
            <p className="border-bad/50 bg-bad/10 mt-1.5 rounded border px-2 py-1">
              <span className="text-muted text-[10px] tracking-wide uppercase">It answered </span>
              <span className="line-clamp-4">{ended(c.answer)}</span>
            </p>
            <p className="text-muted mt-1 text-[11px]">
              The right answer: {c.truth} · real output from {c.src}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-muted text-[11px]">
              The trace. Tap a stage to read it, and pick the one where it first went wrong.
            </p>
            {STAGES.map(([k, n]) => {
              const isPick = pick === k;
              return (
                <div
                  key={k}
                  className={cn(
                    "rounded-lg border text-[11px]",
                    isPick
                      ? right
                        ? "border-good bg-good/10"
                        : "border-bad bg-bad/10"
                      : "border-line bg-surface",
                  )}
                >
                  <div className="flex items-center gap-2 px-2.5 py-1.5">
                    <button
                      type="button"
                      onClick={() => set({ open: s.open === k ? "" : k })}
                      className="flex-1 text-left font-semibold"
                    >
                      {n}
                    </button>
                    <button
                      type="button"
                      onClick={() => set({ picks: { ...s.picks, [c.id]: k } })}
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px]",
                        isPick ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                      )}
                    >
                      {isPick ? (right ? "Found it" : "Not the first") : "Blame this stage"}
                    </button>
                  </div>
                  {(s.open === k || isPick) && (
                    <p className="border-line border-t px-2.5 py-1.5">{trace[k]}</p>
                  )}
                </div>
              );
            })}
          </div>
          {pick && !right && (
            <p className="text-muted text-[11px]">
              That stage shows the problem, but something before it caused it. Look further up.
            </p>
          )}
          {right && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-2"
            >
              <p className="border-line bg-surface-2 rounded-lg border px-3 py-2 text-xs">
                {c.why}
              </p>
              <div className="border-good/50 bg-good/10 rounded-lg border px-3 py-2 text-xs">
                <p className="font-semibold">Fix: {c.fix}</p>
                <p className="text-muted mt-1 text-[10px] tracking-wide uppercase">
                  After the fix · {c.fixedBy}
                </p>
                <p className="line-clamp-4">{ended(c.fixed)}</p>
              </div>
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        Five wrong answers from earlier modules, each with a trace of what every stage did. For
        each, find the <em>first</em> stage that went wrong, then see the fix and the answer after
        it. Every answer, before and after, is real model output.
      </p>
      <p>
        Notice how rarely the model is the first to blame. In four of the five, the cause came
        before the model saw anything. In the fifth, everything it needed was in the prompt, badly
        arranged.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Maps of what goes wrong ------------------------------------------------------------------- */

const MAPS: [string, string][] = [
  [
    "Seven failure points (2024)",
    "A study of three real RAG systems named seven: missing content, missed the top-ranked documents, not in context, not extracted, wrong format, incorrect specificity, and incomplete answers.",
  ],
  [
    "Blame the earliest stage (2026)",
    "A later study grouped 16 error types by the stage that caused them, and had annotators mark the earliest stage that went wrong, because errors carry forward. An automatic classifier agreed with them only 58% of the time.",
  ],
  [
    "Start with retrieval",
    "Practitioners advise evaluating retrieval first (it's a search problem you can measure, as in module 18) and reading real traces before building anything automatic.",
  ],
  [
    "Fix the right stage",
    "A bigger model can't answer from a chart that was never extracted, or a circular that was never indexed. Fix where it broke, then rerun your test set.",
  ],
];

export function Maps() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Maps of what goes wrong"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {MAPS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-0.5 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Researchers have catalogued how RAG systems fail. The lists differ in detail but agree on
        the method: trace the question through every stage and fix the earliest failure.
      </p>
      <p>Reading traces is still a human skill; automatic blame is often wrong.</p>
    </StepLayout>
  );
}

/* 5 ─ Where would you look? --------------------------------------------------------------------- */

export function WhereToLook() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Where would you look?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="where-to-look"
            prompt="A resident asks when the water bill is due. The answer says 30 days; the rules say 21. The trace shows the right section was retrieved, ranked second, and sent to the model along with the superseded 2019 rules, which say 30. Where do you look first?"
            options={[
              {
                id: "parse",
                label: "Parsing: the PDF must have been read wrongly",
                feedback:
                  "The right section was retrieved with the right text, so parsing worked for it.",
              },
              {
                id: "fresh",
                label: "The index: superseded rules shouldn't be reaching the prompt at all",
                correct: true,
                feedback:
                  "Yes. Search did its job; the index still serves rules that no longer apply. Filter or delete superseded documents (module 5), then rerun.",
              },
              {
                id: "model",
                label: "The model: switch to a bigger one",
                feedback:
                  "A bigger model might pick the right rule more often, but it would still be handed a conflict it shouldn't have to resolve.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        Walk the trace from the start. The first stage that let the problem through is the one to
        fix.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Trace every stage", "Question, passages with their text, index version, prompt, answer."],
  ["Blame the first failure", "The model is often last in line, not first at fault."],
  ["Fix the right stage", "Parse, chunk, search, freshness or prompt: then rerun the test set."],
  ["Keep a test set", "Every fixed failure becomes a test question, so it stays fixed."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        That completes the RAG Systems track. You&apos;ve followed a question from a PDF to an
        answer: parsing, chunking, search, ranking, prompting, evaluation, security and cost, and
        now how to find what broke.
      </p>
    </StepLayout>
  );
}
