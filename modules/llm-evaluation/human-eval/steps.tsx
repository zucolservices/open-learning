"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ITEMS, MODELS, RATERS, fleiss, interval, labels, unanimous } from "./model";
import type { HumanEvalState } from "./state";

/* 1 ─ Talent-show judges -------------------------------------------------------------------------- */

export function Judges() {
  const scores = [
    [8, 9, 4],
    [7, 6, 9],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="Talent-show judges"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {scores.map((row, i) => (
            <div
              key={i}
              className="border-line bg-surface flex items-center gap-3 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-muted w-20">Act {i + 1}</span>
              {row.map((s, j) => (
                <motion.span
                  key={j}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15 * (i * 3 + j) }}
                  className="bg-surface-2 flex h-9 w-9 items-center justify-center rounded-lg font-mono text-sm"
                >
                  {s}
                </motion.span>
              ))}
            </div>
          ))}
          <p className="text-muted text-xs">
            Same act, very different scores. Is the act unclear, or are the judges?
          </p>
        </div>
      }
    >
      <p>
        On talent shows, three judges watch the same act and give wildly different scores. Each is
        sincere; they just value different things.
      </p>
      <p>
        Some qualities, such as whether a reply is genuinely helpful or appropriate, are best judged
        by people. But people disagree too, so a human evaluation needs clear guidelines, several
        raters, and a measure of <Term id="inter-rater-agreement">how much they agree</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Run a rating study ⭐ ----------------------------------------------------------------------- */

const SETUP: [keyof HumanEvalState, string][] = [
  ["guidelines", "Written guidelines with worked examples"],
  ["calibration", "A calibration session: rate 10 together, discuss differences"],
  ["screened", "Screen raters with a short test first"],
];

export function RatingStudy() {
  const [s, set] = useSceneState<HumanEvalState>();
  const rows = labels({
    guidelines: s.guidelines,
    calibration: s.calibration,
    screened: s.screened,
  });
  const k = fleiss(rows);
  const u = unanimous(rows);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Run a rating study"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1.5">
            {SETUP.map(([key, l]) => (
              <label
                key={key}
                className={cn(
                  "flex items-start gap-2 rounded-lg border px-2.5 py-1.5 text-[11px]",
                  s[key] ? "border-good bg-good/10" : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={s[key] as boolean}
                  onChange={(e) => set({ [key]: e.target.checked })}
                  className="accent-accent mt-0.5"
                />
                {l}
              </label>
            ))}
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2">
            <div className="grid grid-cols-[4.5rem_repeat(16,minmax(0,1fr))] gap-[3px] text-[9px]">
              <span />
              {Array.from({ length: ITEMS }, (_, i) => (
                <span key={i} className="text-subtle text-center font-mono">
                  {i + 1}
                </span>
              ))}
              {Array.from({ length: RATERS }, (_, r) => (
                <div key={r} className="contents">
                  <span className="text-muted">Rater {r + 1}</span>
                  {rows.map((row, i) => {
                    const split = !row.every((x) => x === row[0]);
                    return (
                      <motion.span
                        key={`${i}-${row[r]}`}
                        initial={{ scale: 0.6 }}
                        animate={{ scale: 1 }}
                        className={cn(
                          "h-4 rounded-sm",
                          row[r] ? "bg-good/60" : "bg-bad/70",
                          split && "ring-viz-compute ring-1",
                        )}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            <p className="text-muted mt-2 text-[10px]">
              Green: helpful. Red: not helpful. Outlined: raters disagree.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <div className="border-line bg-surface rounded-lg border px-2.5 py-1.5">
              <p className="text-subtle text-[10px]">All four agree</p>
              <p className="font-mono">
                {u} of {ITEMS}
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-2.5 py-1.5">
              <p className="text-subtle text-[10px]">Fleiss&apos; kappa</p>
              <p className="font-mono">{k.toFixed(2)}</p>
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            Illustrative study. Replies 4 and 12 are genuinely borderline: raters split however
            careful the setup.
          </p>
        </div>
      }
    >
      <p>
        Four raters judge 16 assistant replies as helpful or not. Switch on the practices good
        studies use and watch agreement rise. A couple of replies stay disputed however careful you
        are: some cases really are borderline.
      </p>
      <p>
        Even trained raters disagree: in OpenAI&apos;s 2022 InstructGPT work, labellers agreed on
        which of two answers was better about 73% of the time. With more than two raters, use
        Fleiss&apos; kappa or <Term id="krippendorffs-alpha">Krippendorff&apos;s alpha</Term>.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Side-by-side votes -------------------------------------------------------------------------- */

export function Arena() {
  const [s, set] = useSceneState<HumanEvalState>();
  const ci = interval(s.votes);
  const lo = 1150;
  const hi = 1360;
  const x = (v: number) => `${((v - lo) / (hi - lo)) * 100}%`;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Side-by-side votes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted">votes per model</span>
            <input
              type="range"
              min={50}
              max={20000}
              step={50}
              value={s.votes}
              onChange={(e) => set({ votes: Number(e.target.value) })}
              className="accent-accent flex-1"
              aria-label="Votes per model"
            />
            <span className="w-16 font-mono">{s.votes.toLocaleString("en-IN")}</span>
          </label>
          <div className="flex flex-col gap-2">
            {MODELS.map((m) => (
              <div
                key={m.name}
                className="grid grid-cols-[4.5rem_1fr_5rem] items-center gap-2 text-xs"
              >
                <span>{m.name}</span>
                <div className="bg-surface-2 relative h-4 rounded">
                  <motion.span
                    className="bg-viz-data/40 absolute top-0 bottom-0 rounded"
                    animate={{
                      left: x(m.strength - ci),
                      width: `${((2 * ci) / (hi - lo)) * 100}%`,
                    }}
                  />
                  <span
                    className="bg-viz-data absolute top-0 bottom-0 w-0.5"
                    style={{ left: x(m.strength) }}
                  />
                </div>
                <span className="font-mono">
                  {m.strength} ±{ci}
                </span>
              </div>
            ))}
          </div>
          <p className="text-muted text-xs">
            {2 * ci > MODELS[0].strength - MODELS[1].strength
              ? "A and B's ranges overlap: you can't honestly say which is better."
              : "With enough votes the ranges separate, and the order means something."}
          </p>
          <p className="text-subtle text-[10px]">Illustrative ratings.</p>
        </div>
      }
    >
      <p>
        Rating scales are hard to keep consistent; comparisons are easier. Chatbot Arena, launched
        by Berkeley researchers in 2023 and now called Arena, shows people two anonymous models side
        by side, collects their vote, and turns millions of votes into ratings with the{" "}
        <Term id="bradley-terry">Bradley–Terry model</Term>.
      </p>
      <p>
        Every rating comes with a ± range. Slide the number of votes down and watch close models
        become indistinguishable.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Reading a leaderboard carefully ------------------------------------------------------------- */

export function Caveats() {
  const items: [string, string][] = [
    [
      "Who votes?",
      "Arena voters are self-selected and ask what interests them, which may not resemble your users or tasks.",
    ],
    [
      "Private testing",
      "A 2025 paper, “The Leaderboard Illusion”, argued a few large providers could test many private variants and publish only the best. Arena disputed parts of it.",
    ],
    [
      "Tuned versions",
      "In April 2025 Meta's Arena entry for Llama 4 Maverick was an experimental chat version; the released model ranked much lower, and Arena changed its policies.",
    ],
    [
      "Style counts",
      "People reward length and formatting; Arena now offers style-controlled rankings.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Reading a leaderboard carefully"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {items.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-0.5">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Preference leaderboards are a valuable public signal, and they measure what voters prefer,
        not what&apos;s best for your product.
      </p>
      <p>
        For your own app, a small study with your own users and guidelines usually tells you more
        than a public ranking.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which statistic? ---------------------------------------------------------------------------- */

export function WhichStat() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which statistic?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-stat"
            prompt="Which agreement statistic fits each study?"
            categories={[
              { id: "cohen", label: "Cohen's kappa" },
              { id: "fleiss", label: "Fleiss' kappa" },
              { id: "kripp", label: "Krippendorff's alpha" },
            ]}
            items={[
              {
                id: "two",
                label: "Two raters label the same 200 replies pass/fail",
                category: "cohen",
                why: "Exactly two raters.",
              },
              {
                id: "five",
                label: "Five raters each label every reply into one of three categories",
                category: "fleiss",
                why: "Many raters, categories.",
              },
              {
                id: "missing",
                label: "Twelve raters, each rating a different subset, on a 1–5 scale",
                category: "kripp",
                why: "Missing ratings and an ordered scale.",
              },
              {
                id: "judge",
                label: "An LLM judge compared with one expert",
                category: "cohen",
                why: "Two raters.",
              },
            ]}
            explanation="Two raters: Cohen. Many raters, categories: Fleiss. Missing ratings or ordered scales: Krippendorff's alpha."
          />
        </div>
      }
    >
      <p>Sort the studies.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["People see what metrics can't", "Helpfulness, appropriateness, taste."],
  ["People disagree", "Measure agreement, not just averages."],
  ["Guidelines and calibration", "Raise agreement; some cases stay borderline."],
  ["Comparisons scale", "Pairwise votes become ratings with ranges."],
  ["Leaderboards aren't your users", "Run your own study for your product."],
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
      <p>Next: why a score is an estimate, and how to put error bars on it.</p>
    </StepLayout>
  );
}
