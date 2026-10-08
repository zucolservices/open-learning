"use client";

import { motion } from "motion/react";
import { NotebookPen, Smartphone, Globe2 } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { QUESTIONS, SCENARIOS, walk } from "./model";
import type { ScopeState } from "./state";

/* 1 ─ Story: the ledger and the app ---------------------------------------------------------------- */

const PANELS = [
  { Icon: NotebookPen, title: "A paper ledger", sub: "Never typed up", inScope: false },
  { Icon: Smartphone, title: "A billing app", sub: "Same names, now digital", inScope: true },
  { Icon: Globe2, title: "A shop abroad", sub: "Selling to buyers in India", inScope: true },
];

export function LedgerAndApp() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The ledger and the app"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="grid w-full max-w-lg gap-2 sm:grid-cols-3">
            {PANELS.map(({ Icon, title, sub, inScope }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * i }}
                className={cn(
                  "flex flex-col items-center rounded-xl border p-3 text-center",
                  inScope ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <Icon className={cn("size-6", inScope ? "text-accent" : "text-subtle")} />
                <p className="mt-1 text-sm font-semibold">{title}</p>
                <p className="text-muted text-[11px]">{sub}</p>
                <p
                  className={cn(
                    "mt-2 rounded-full px-2 py-0.5 text-[10px] font-medium",
                    inScope ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted",
                  )}
                >
                  {inScope ? "Covered" : "Not covered"}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Meena runs a corner shop in Kalpanagar and writes customers&apos; credit in a paper ledger.
        Then Meena switches to a billing app on a phone, typing in the same names and numbers.
        Across the world, a website starts selling spices to buyers in India.
      </p>
      <p>
        The DPDP Act covers the second and third, not the first. It is a law about{" "}
        <Term id="digital-personal-data">digital personal data</Term>: data that is digital, or
        becomes digital later, and that is processed in India or used to offer goods or services to
        people in India. Section 3 sets that scope, from May 2027.
      </p>
    </StepLayout>
  );
}

/* 2 ─ In scope or not? ⭐ -------------------------------------------------------------------------- */

export function ScopeSorter() {
  const [s, set] = useSceneState<ScopeState>();
  const sc = SCENARIOS.find((x) => x.id === s.current) ?? SCENARIOS[0];
  const guess = s.guesses[sc.id];
  const w = walk(sc);
  const answered = Object.keys(s.guesses).length;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="In scope or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {SCENARIOS.map((x, i) => {
              const g = s.guesses[x.id];
              const ok = g && (g === "in") === walk(x).inScope;
              return (
                <button
                  key={x.id}
                  type="button"
                  aria-label={`Scenario ${i + 1}`}
                  aria-pressed={x.id === sc.id}
                  onClick={() => set({ current: x.id })}
                  className={cn(
                    "size-7 rounded-full border text-[11px] font-medium transition",
                    x.id === sc.id && "ring-accent ring-2",
                    !g && "border-line-strong text-muted",
                    g && ok && "border-good bg-good/15",
                    g && !ok && "border-bad bg-bad/15",
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
            <span className="text-subtle ml-auto self-center text-[10px]">
              {answered}/{SCENARIOS.length} tried
            </span>
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-sm font-medium">{sc.text}</p>
            <div className="mt-2 flex gap-1.5">
              {(["in", "out"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={guess === v}
                  onClick={() => set({ guesses: { ...s.guesses, [sc.id]: v } })}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs transition",
                    guess === v
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-line-strong text-muted hover:text-fg",
                  )}
                >
                  {v === "in" ? "In scope" : "Out of scope"}
                </button>
              ))}
            </div>
          </div>
          <ol className="grid gap-1">
            {QUESTIONS.map((q, i) => {
              const reached = guess && i <= w.stop;
              const stopHere = guess && i === w.stop;
              return (
                <li
                  key={q.id}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-lg border px-3 py-1.5 text-xs transition-colors",
                    !reached && "border-line text-subtle",
                    reached && !stopHere && "border-accent/40 bg-accent-soft",
                    stopHere && "border-bad/50 bg-bad/10",
                  )}
                >
                  <span>
                    {q.ask} <span className="text-subtle font-mono">{q.clause}</span>
                  </span>
                  <span className="shrink-0 font-medium">
                    {reached ? (sc.answers[q.id] ? "Yes" : "No") : ""}
                  </span>
                </li>
              );
            })}
          </ol>
          {guess && (
            <motion.div
              key={sc.id + guess}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs",
                (guess === "in") === w.inScope
                  ? "border-good/50 bg-good/10"
                  : "border-bad/50 bg-bad/10",
              )}
            >
              <p className="font-semibold">{w.inScope ? "In scope." : "Out of scope."}</p>
              <p className="mt-0.5">{sc.why}</p>
              {sc.note && <p className="text-muted mt-1">{sc.note}</p>}
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        Ten situations. For each, decide whether the Act will cover it, then watch the path through
        section 3 light up. The first question answered the wrong way takes it out.
      </p>
      <p>
        Engineers mostly meet the core case, scenario 1. The edges matter when someone asks
        &ldquo;does this even apply to us?&rdquo;
      </p>
    </StepLayout>
  );
}

/* 3 ─ Across the border ---------------------------------------------------------------------------- */

const BORDER = [
  {
    id: "shop",
    title: "A foreign shop selling to India",
    verdict: "Covered",
    body: "Processing outside India in connection with offering goods or services to Data Principals in India is within the Act (s.3(b)). Rupee pricing, Indian delivery or an Indian-language site are signs of offering to people in India.",
  },
  {
    id: "profiling",
    title: "A foreign firm only profiling Indian visitors",
    verdict: "Probably not covered",
    body: "The 2022 draft also covered profiling people in India. The final Act dropped it, so a firm that only watches Indian visitors, without offering them anything, is probably outside s.3(b). This is a reading of the text, not a settled answer.",
  },
  {
    id: "bpo",
    title: "An Indian firm serving foreign clients",
    verdict: "Covered, mostly exempt",
    body: "Processing in India is in scope. But s.17(1)(d) lifts most duties when an Indian company processes data of people outside India under a contract with a foreign company. Security safeguards still apply.",
  },
];

export function AcrossTheBorder() {
  const [s, set] = useSceneState<ScopeState>();
  const b = BORDER.find((x) => x.id === s.border) ?? BORDER[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Across the border"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5">
            {BORDER.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={x.id === b.id}
                onClick={() => set({ border: x.id })}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-sm transition",
                  x.id === b.id ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {x.title}
              </button>
            ))}
          </div>
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-4"
          >
            <p className="text-accent text-lg font-semibold">{b.verdict}</p>
            <p className="mt-1 text-sm">{b.body}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        The Act reaches beyond India&apos;s borders, but only in one way: when data is processed in
        connection with offering goods or services to people in India.
      </p>
      <p>
        That&apos;s narrower than Europe&apos;s GDPR, which also covers monitoring people&apos;s
        behaviour. A team building for Indian users from abroad should assume it is covered.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Public isn't a free pass ---------------------------------------------------------------------- */

const MYTHS: [string, string][] = [
  [
    "“It's on the internet, so it's public.”",
    "Only data the person chose to make public, or that someone had a legal duty to publish, is outside the Act. A leaked database is still in scope.",
  ],
  [
    "“We anonymised it, the Act says that's fine.”",
    "The Act never uses the word 'anonymised'. Data is outside it only if no one can be identified from it, which is hard to achieve. Removing names often isn't enough.",
  ],
  [
    "“Only sensitive data like health counts.”",
    "There is no separate sensitive category. A name and phone number are personal data just like a medical record.",
  ],
  [
    "“It's paper, so it doesn't count.”",
    "Paper is outside the Act only while it stays paper. Scan it or type it in and it's covered.",
  ],
];

export function PublicIsntFree() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Four myths about scope"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {MYTHS.map(([myth, fact], i) => (
            <motion.div
              key={myth}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{myth}</p>
              <p className="text-muted mt-0.5 text-xs">{fact}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The Act gives one illustration in section 3: a person blogging their views who makes their
        own personal data public on social media. That data is outside the Act.
      </p>
      <p>
        The exclusions are narrow, though. Most of the shortcuts teams hope for don&apos;t exist.
        <Term id="personal-data">Personal data</Term> is defined by one test: can a person be
        identified by or in relation to it?
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function ScopeCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Covered or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="dpdp-scope"
            prompt="After May 2027, does the Act cover each of these?"
            categories={[
              { id: "in", label: "Covered" },
              { id: "out", label: "Not covered" },
            ]}
            items={[
              {
                id: "crm",
                label: "Customer names and phone numbers in a CRM",
                category: "in",
                why: "Digital personal data processed in India.",
              },
              {
                id: "visitor",
                label: "A visitors' register on paper at a reception desk",
                category: "out",
                why: "Never digitised.",
              },
              {
                id: "photo",
                label: "That visitors' register, photographed and uploaded to a shared drive",
                category: "in",
                why: "Digitised later.",
              },
              {
                id: "wedding",
                label: "A family's wedding guest list on someone's own laptop",
                category: "out",
                why: "Personal or domestic purpose.",
              },
              {
                id: "leaked",
                label: "Leaked customer records a website has republished",
                category: "in",
                why: "Leaked isn't made public by the person.",
              },
              {
                id: "app-abroad",
                label: "A fitness app run from Singapore, sold to users in India",
                category: "in",
                why: "Offering services to people in India.",
              },
            ]}
            explanation="Digital, identifiable, linked to India, and not personal use or data the person made public: then it's covered."
          />
        </div>
      }
    >
      <p>Sort each case.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ------------------------------------------------------------------------------------------ */

const POINTS: [string, string][] = [
  ["Digital, or digitised later", "Paper alone is outside; scanned paper is in."],
  ["In India, or for people in India", "Foreign services offered to Indians are covered."],
  ["Two exclusions", "Personal or domestic use, and data made public by the person or by law."],
  ["No sensitive category", "All personal data counts the same."],
  ["From May 2027", "Section 3 starts with the other core duties."],
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
      <p>
        Next: if it&apos;s covered, where is it? Finding all the personal data in your systems is
        the first real engineering job.
      </p>
    </StepLayout>
  );
}
