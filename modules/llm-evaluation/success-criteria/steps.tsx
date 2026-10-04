"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DIMS, OPTIONS } from "./model";
import type { CriteriaState } from "./state";

/* 1 ─ "Make it helpful" --------------------------------------------------------------------------- */

export function Brief() {
  return (
    <StepLayout
      eyebrow="Story"
      title="“Make it helpful”"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-muted text-[10px]">VAGUE BRIEF</p>
            <p className="mt-1 text-sm">&ldquo;Clean the house properly.&rdquo;</p>
            <p className="text-muted mt-2">
              Everyone pictures something different, and nobody can say whether it was done.
            </p>
          </div>
          <div className="border-accent bg-accent-soft rounded-xl border px-4 py-3 text-xs">
            <p className="text-muted text-[10px]">CHECKABLE BRIEF</p>
            <ul className="mt-1 list-disc pl-4 text-sm">
              <li>Floors mopped in every room</li>
              <li>Dishes washed and put away</li>
              <li>Bins out by 8 am Tuesday</li>
            </ul>
          </div>
        </div>
      }
    >
      <p>
        Ask someone to &ldquo;clean the house properly&rdquo; and you&apos;ll argue about whether
        they did. Give them a list they can tick off and there&apos;s nothing to argue about.
      </p>
      <p>
        AI projects start with briefs like &ldquo;make the assistant helpful&rdquo;. Before you can
        evaluate anything, you need <Term id="success-criteria">success criteria</Term>: specific,
        measurable statements of what good looks like. Both OpenAI&apos;s and Anthropic&apos;s
        evaluation guides start here.
      </p>
    </StepLayout>
  );
}

/* 2 ─ From "helpful" to measurable ⭐ ------------------------------------------------------------- */

export function BuildCriteria() {
  const [s, set] = useSceneState<CriteriaState>();
  const picks = s.picks ?? {};
  const chosen = DIMS.map((d) => ({ d, o: d.options.find((o) => o.id === picks[d.id]) }));
  const good = chosen.filter((c) => c.o?.kind === "good").length;
  return (
    <StepLayout
      eyebrow="Build and connect"
      title="From “helpful” to measurable"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-[1fr_15rem]">
          <div className="flex flex-col gap-2">
            {DIMS.map((d) => (
              <div
                key={d.id}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
              >
                <p className="font-semibold">{d.name}</p>
                <div className="mt-1 flex flex-col gap-1">
                  {d.options.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={picks[d.id] === o.id}
                      onClick={() => set({ picks: { ...picks, [d.id]: o.id } })}
                      className={cn(
                        "rounded border px-2 py-1 text-left text-[11px]",
                        picks[d.id] === o.id
                          ? o.kind === "good"
                            ? "border-good bg-good/10"
                            : o.kind === "proxy"
                              ? "border-viz-compute bg-viz-compute/10"
                              : "border-bad bg-bad/10"
                          : "border-line",
                      )}
                    >
                      {o.text}
                      {picks[d.id] === o.id && (
                        <span className="text-muted mt-0.5 block text-[10px]">{o.why}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-accent bg-accent-soft self-start rounded-xl border px-3 py-3 text-xs">
            <p className="text-muted text-[10px]">SUCCESS CRITERIA · SUPPORT ASSISTANT</p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {chosen.map(({ d, o }) => (
                <li
                  key={d.id}
                  className={cn(
                    !o && "text-subtle",
                    o?.kind === "vague" && "text-bad line-through",
                    o?.kind === "proxy" && "text-viz-compute",
                  )}
                >
                  <span className="font-semibold">{d.name}: </span>
                  {o ? o.text : "…"}
                </li>
              ))}
            </ul>
            <p className="text-muted mt-3">
              {good} of {DIMS.length} criteria are specific, measurable and worth measuring.
            </p>
          </div>
        </div>
      }
    >
      <p>
        For each side of &ldquo;helpful&rdquo;, pick the criterion you&apos;d put in the spec. Watch
        for two traps: vague wishes that can&apos;t be checked, and easy-to-count stand-ins that
        measure the wrong thing.
      </p>
      <p>
        Anthropic&apos;s guide asks for criteria that are specific, measurable, achievable and
        relevant, and lists many sides of quality to consider, including accuracy, consistency,
        tone, privacy, speed and price.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Criteria pull against each other ------------------------------------------------------------ */

export function TradeOffs() {
  const [s, set] = useSceneState<CriteriaState>();
  const rows = OPTIONS.map((o) => {
    const checks = [
      o.scores.accuracy >= 95,
      o.scores.tone >= 90,
      o.scores.leaks === 0,
      o.scores.p95 <= s.maxP95,
      o.scores.cost <= s.maxCost,
    ];
    return { o, checks, ok: checks.every(Boolean) };
  });
  const heads = [
    "Accuracy ≥ 95%",
    "Tone ≥ 90%",
    "0 leaks",
    `p95 ≤ ${s.maxP95.toFixed(1)} s`,
    `≤ ₹${s.maxCost.toFixed(1)}`,
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Criteria pull against each other"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 text-xs sm:grid-cols-2">
            <label className="flex items-center gap-2">
              <span className="text-muted w-20">speed limit</span>
              <input
                type="range"
                min={0.5}
                max={3}
                step={0.1}
                value={s.maxP95}
                onChange={(e) => set({ maxP95: Number(e.target.value) })}
                className="accent-accent flex-1"
                aria-label="Speed limit"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-muted w-20">budget</span>
              <input
                type="range"
                min={0.5}
                max={4}
                step={0.1}
                value={s.maxCost}
                onChange={(e) => set({ maxCost: Number(e.target.value) })}
                className="accent-accent flex-1"
                aria-label="Budget"
              />
            </label>
          </div>
          <div className="border-line bg-surface overflow-x-auto rounded-lg border">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted text-[10px]">
                  <th className="px-2 py-1.5 text-left font-normal">Option</th>
                  {heads.map((h) => (
                    <th key={h} className="px-2 py-1.5 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(({ o, checks, ok }) => (
                  <tr key={o.name} className={cn("border-line border-t", ok && "bg-good/10")}>
                    <td className="px-2 py-1.5 font-semibold">{o.name}</td>
                    {[
                      `${o.scores.accuracy}%`,
                      `${o.scores.tone}%`,
                      `${o.scores.leaks}`,
                      `${o.scores.p95} s`,
                      `₹${o.scores.cost}`,
                    ].map((v, i) => (
                      <td
                        key={i}
                        className={cn(
                          "px-2 py-1.5 text-center font-mono",
                          checks[i] ? "text-good" : "text-bad",
                        )}
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted text-xs">
            {rows.filter((r) => r.ok).length
              ? `Meets every criterion: ${rows
                  .filter((r) => r.ok)
                  .map((r) => r.o.name)
                  .join(", ")}.`
              : "No option meets every criterion. Something has to give."}
          </p>
          <p className="text-subtle text-[10px]">Illustrative scores.</p>
        </div>
      }
    >
      <p>
        Real criteria compete. The most accurate model may be too slow or too expensive; the
        cheapest may leak data. Move the speed limit and the budget and see which options survive.
      </p>
      <p>
        Writing thresholds down before you test keeps the decision honest: you agree what counts as
        good enough before you see which option you&apos;d like to win.
      </p>
    </StepLayout>
  );
}

/* 4 ─ When a measure becomes a target ------------------------------------------------------------- */

export function Goodhart() {
  const cases: [string, string][] = [
    [
      "Thumbs up",
      "Optimising for user approval helped push the April 2025 GPT-4o update toward flattering people.",
    ],
    ["Short replies", "A word-count target makes answers shorter by cutting the useful parts."],
    [
      "Tickets closed",
      "Rewarding “resolved” encourages closing conversations before the problem is solved.",
    ],
  ];
  const helm = [
    "accuracy",
    "calibration",
    "robustness",
    "fairness",
    "bias",
    "toxicity",
    "efficiency",
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="When a measure becomes a target"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <blockquote className="border-accent border-l-2 pl-3 text-sm">
            &ldquo;When a measure becomes a target, it ceases to be a good measure.&rdquo;
            <span className="text-muted mt-1 block text-[11px]">
              Marilyn Strathern (1997), summing up economist Charles Goodhart&apos;s point (1975)
            </span>
          </blockquote>
          {cases.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}: </span>
              <span className="text-muted">{d}</span>
            </motion.div>
          ))}
          <div className="text-xs">
            <p className="text-muted">
              Stanford&apos;s HELM (2022) scored models on seven things, not one:
            </p>
            <div className="mt-1 flex flex-wrap gap-1">
              {helm.map((h) => (
                <span key={h} className="bg-surface-2 rounded-full px-2 py-0.5 text-[11px]">
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <p>
        This is <Term id="goodharts-law">Goodhart&apos;s law</Term>: push hard on a single number
        and the system finds ways to raise the number without getting better.
      </p>
      <p>
        The defences: measure several things at once, so improving one at the expense of another
        shows up, and keep reading real outputs alongside the scores.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Measurable or not? -------------------------------------------------------------------------- */

export function Measurable() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Measurable or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="measurable"
            prompt="Could you test each criterion as written?"
            categories={[
              { id: "yes", label: "Testable" },
              { id: "no", label: "Too vague" },
            ]}
            items={[
              {
                id: "concise",
                label: "Answers should be concise and relevant",
                category: "no",
                why: "No threshold, no way to check.",
              },
              {
                id: "f1",
                label: "F1 of at least 0.85 on 10,000 held-out posts",
                category: "yes",
                why: "Anthropic's own example of a good criterion.",
              },
              {
                id: "toxic",
                label: "Under 0.1% of 10,000 outputs flagged as toxic",
                category: "yes",
                why: "Even safety can have a number.",
              },
              {
                id: "smart",
                label: "The assistant should feel smart",
                category: "no",
                why: "Feel smart to whom?",
              },
              {
                id: "p95",
                label: "95% of replies start within 2 seconds",
                category: "yes",
                why: "A percentile target.",
              },
            ]}
            explanation="A testable criterion says what is measured, on which cases, and what score counts as good enough."
          />
        </div>
      }
    >
      <p>Sort the criteria.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Define good first", "Before building any eval."],
  ["Specific and measurable", "What, on which cases, what threshold."],
  ["Many sides of quality", "Accuracy, tone, safety, speed, cost…"],
  ["Thresholds before results", "Agree what's good enough in advance."],
  ["Beware stand-ins", "Targets get gamed; measure several things."],
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
      <p>Next: building the set of test cases your criteria are measured on.</p>
    </StepLayout>
  );
}
