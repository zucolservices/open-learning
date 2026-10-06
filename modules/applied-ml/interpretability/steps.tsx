"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { APPLICANTS, BASE, MEAN, permutation, risk, waterfall } from "./model";
import type { ExplainState } from "./state";

const r1 = (v: number) => Math.round(v * 10) / 10;
const signed = (v: number) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(r1(v))}`;

/* 1 ─ "Why was I refused?" ------------------------------------------------------------------------ */

export function WhyRefused() {
  return (
    <StepLayout
      eyebrow="Story"
      title="“Why was I refused?”"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface w-full max-w-sm rounded-xl border px-4 py-3 text-sm"
          >
            <p className="text-muted text-xs">Loan decision</p>
            <p className="text-bad mt-1 font-semibold">Application declined</p>
            <p className="text-muted mt-3 text-xs">Main reasons:</p>
            <ol className="mt-1 list-decimal pl-5 text-xs">
              <li>Debt is high compared with income</li>
              <li>Recent late payments</li>
              <li>Short time in current job</li>
            </ol>
          </motion.div>
          <p className="text-subtle text-[10px]">An illustrative letter.</p>
        </div>
      }
    >
      <p>
        Asha applies for a loan and is turned down. A good bank clerk could tell Asha why, and what
        would change the answer. When a model makes the call, someone still has to answer that
        question: the applicant, the bank&apos;s risk team, and often a regulator.
      </p>
      <p>
        This module shows how to ask a model why: for one prediction, and for the model as a whole.
        It also shows what those answers don&apos;t tell you.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Split one prediction into pushes ⭐ --------------------------------------------------------- */

export function Pushes() {
  const [s, set] = useSceneState<ExplainState>();
  const a = { ...APPLICANTS[s.who], ...(s.debt !== null ? { debt: s.debt } : {}) };
  const total = risk(a);
  const X = (v: number) => r1(20 + (v / 100) * 260);
  const bars = waterfall(a);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Split one prediction into pushes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {APPLICANTS.map((p, i) => (
              <button
                key={p.name}
                type="button"
                aria-pressed={s.who === i}
                onClick={() => set({ who: i, debt: null })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.who === i ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {p.name}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted">debt-to-income</span>
            <input
              type="range"
              min={10}
              max={80}
              value={a.debt}
              onChange={(e) => set({ debt: Number(e.target.value) })}
              className="accent-accent flex-1"
              aria-label="Debt-to-income"
            />
            <span className="w-12 font-mono">{a.debt}%</span>
          </label>
          <svg viewBox="0 0 300 150" className="mx-auto w-full max-w-lg">
            <line
              x1={X(BASE)}
              x2={X(BASE)}
              y1={8}
              y2={130}
              className="stroke-line"
              strokeDasharray="3 3"
            />
            <text
              x={X(BASE)}
              y={142}
              textAnchor="middle"
              className="fill-muted font-mono text-[7px]"
            >
              average {BASE}%
            </text>
            {bars.map((b, i) => (
              <g key={b.id}>
                <rect
                  x={X(Math.min(b.from, b.to))}
                  width={r1(Math.max(1, X(Math.max(b.from, b.to)) - X(Math.min(b.from, b.to))))}
                  y={12 + i * 26}
                  height={16}
                  rx={2}
                  className={b.p > 0 ? "fill-bad/70" : "fill-good/70"}
                />
                <text
                  x={X(Math.max(b.from, b.to)) + 3}
                  y={23 + i * 26}
                  className="fill-fg text-[7px]"
                >
                  {b.label} {a[b.id]} ({signed(b.p)})
                </text>
              </g>
            ))}
            <line
              x1={X(total)}
              x2={X(total)}
              y1={8}
              y2={130}
              className="stroke-accent"
              strokeWidth={1.5}
            />
            <text
              x={X(total)}
              y={6}
              textAnchor="middle"
              className="fill-accent font-mono text-[8px]"
            >
              {r1(total)}%
            </text>
          </svg>
          <p className="text-xs">
            {BASE}% {bars.map((b) => ` ${signed(b.p)}`).join("")} ={" "}
            <span className="font-mono font-semibold">{r1(total)}%</span> predicted risk of not
            repaying
          </p>
          <p className="text-subtle text-[10px]">
            A made-up, deliberately simple model. Average applicant: income {MEAN.income}, debt{" "}
            {MEAN.debt}%, {MEAN.late} late payment, {MEAN.years} years in job.
          </p>
        </div>
      }
    >
      <p>
        Start from the average prediction, then let each feature push the risk up (red) or down
        (green). The pushes add up exactly to this applicant&apos;s prediction. That is what{" "}
        <Term id="shap">SHAP</Term> values are (Lundberg and Lee, 2017), based on a fair way to
        share credit from game theory.
      </p>
      <p>
        Try each applicant, then drag Asha&apos;s debt down. For real models the pushes are
        estimated; TreeSHAP (2020) computes them exactly and fast for tree ensembles. LIME (2016) is
        an older approach: it fits a simple model to the black box&apos;s behaviour on nearby,
        slightly changed inputs.
      </p>
    </StepLayout>
  );
}

/* 3 ─ What does the model rely on? ---------------------------------------------------------------- */

export function Importance() {
  const [s, set] = useSceneState<ExplainState>();
  const rows = permutation(s.dup);
  const max = Math.max(...permutation(false).map((r) => r.drop));
  return (
    <StepLayout
      eyebrow="Explore"
      title="What does the model rely on?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.dup}
              onChange={(e) => set({ dup: e.target.checked })}
              className="accent-accent"
            />
            Add a near-copy of debt-to-income (the model now splits its weight between the two)
          </label>
          <div className="flex flex-col gap-1.5">
            {rows.map((r) => (
              <div key={r.id} className="grid grid-cols-[9rem_1fr_3rem] items-center gap-2 text-xs">
                <span className="text-muted">{r.label}</span>
                <div className="bg-surface-2 h-3 rounded">
                  <motion.div
                    animate={{ width: `${Math.max(1, (r.drop / max) * 100)}%` }}
                    className="bg-viz-data h-3 rounded"
                  />
                </div>
                <span className="text-right font-mono">{r.drop}</span>
              </div>
            ))}
          </div>
          <p className="text-muted text-xs">
            How much worse the Brier score gets (×1,000) when that column is shuffled, on 400
            made-up held-out applicants. Computed live.
          </p>
          <Code>{`from sklearn.inspection import permutation_importance
r = permutation_importance(model, X_valid, y_valid, n_repeats=10)`}</Code>
        </div>
      }
    >
      <p>
        <Term id="permutation-importance">Permutation importance</Term> shuffles one column of
        held-out data, breaking its link to the answer, and measures how much worse the model gets.
        It works for any model. Trees&apos; built-in importance is quicker but is computed on
        training data and tends to overrate features with many distinct values, such as IDs.
      </p>
      <p>
        Tick the box. With two copies of the same information, shuffling either one hurts less, so
        both look less important even though debt matters as much as before. And importance
        describes the model, not the world: it says what the model uses, not what causes people to
        default.
      </p>
    </StepLayout>
  );
}

/* 4 ─ When explanations are the law --------------------------------------------------------------- */

export function Rules() {
  const items: [string, string][] = [
    [
      "United States",
      "A lender that refuses credit must give the specific main reasons (the Equal Credit Opportunity Act and Regulation B), whatever kind of model it uses.",
    ],
    [
      "European Union, GDPR",
      "Whether the GDPR gives a “right to explanation” was long debated; the word appears only in a non-binding recital. In 2025 the EU's top court ruled that people refused credit by an automated system are owed an understandable account of how their data led to the result; handing over the algorithm isn't enough.",
    ],
    [
      "European Union, AI Act",
      "Credit scoring is “high-risk”. After a 2026 amendment, those obligations apply from 2 December 2027.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="When explanations are the law"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {items.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-1">{d}</p>
            </motion.div>
          ))}
          <p className="text-subtle text-[10px]">A summary, not legal advice.</p>
        </div>
      }
    >
      <p>
        In lending, explanations aren&apos;t optional. The reasons on Asha&apos;s letter are usually
        the features that pushed hardest towards refusal, which is why per-prediction explanations
        matter so much in credit.
      </p>
      <p>
        A <Term id="partial-dependence-plot">partial dependence plot</Term> helps the risk team see
        the whole picture: the average prediction as one feature varies. All of these tools describe
        the model. They can reveal that it leans on something unfair or odd; they can&apos;t prove
        the model is right.
      </p>
    </StepLayout>
  );
}

/* 5 ─ One prediction or the whole model? ---------------------------------------------------------- */

export function LocalOrGlobal() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="One prediction or the whole model?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="local-or-global"
            prompt="Does each explain one prediction or the model as a whole?"
            categories={[
              { id: "local", label: "One prediction" },
              { id: "global", label: "Whole model" },
            ]}
            items={[
              {
                id: "shap",
                label: "SHAP pushes for Asha's application",
                category: "local",
                why: "One applicant's prediction.",
              },
              {
                id: "perm",
                label: "Permutation importance on the validation set",
                category: "global",
                why: "Averaged over many rows.",
              },
              {
                id: "lime",
                label: "LIME on one customer's churn score",
                category: "local",
                why: "Fits a simple model around one point.",
              },
              {
                id: "pdp",
                label: "Partial dependence plot of income",
                category: "global",
                why: "Average prediction as income varies.",
              },
              {
                id: "letter",
                label: "Reasons on a refusal letter",
                category: "local",
                why: "Specific to that applicant.",
              },
            ]}
            explanation="Local explanations answer “why this prediction?”; global ones answer “what does the model rely on overall?”. Neither says what causes the outcome in the world."
          />
        </div>
      }
    >
      <p>Sort the explanations.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["SHAP splits one prediction", "Pushes from the average add up exactly."],
  ["Permutation importance", "Shuffle a column, measure the damage."],
  ["Copies hide importance", "Correlated features share the credit."],
  ["Model, not world", "Explanations aren't causes."],
  ["Lending needs reasons", "US reason codes; EU courts and AI Act."],
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
      <p>Next: predicting the future from the past, with time series.</p>
    </StepLayout>
  );
}
