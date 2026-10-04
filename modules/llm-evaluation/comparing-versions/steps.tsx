"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { N, mcnemarP, nullPValues, table, unpairedP } from "./model";
import type { CompareState } from "./state";

/* 1 ─ A fair taste test --------------------------------------------------------------------------- */

export function TasteTest() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A fair taste test"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-muted text-[10px]">UNFAIR</p>
            <p className="mt-1 text-sm">Group 1 tastes recipe A. Group 2 tastes recipe B.</p>
            <p className="text-muted mt-2">
              Maybe group 2 just likes spicy food. You can&apos;t tell recipe from people.
            </p>
          </div>
          <div className="border-accent bg-accent-soft rounded-xl border px-4 py-3 text-xs">
            <p className="text-muted text-[10px]">FAIR</p>
            <p className="mt-1 text-sm">Every taster tries both, and says which they prefer.</p>
            <p className="text-muted mt-2">
              Each person is their own comparison. Far fewer tasters needed.
            </p>
          </div>
        </div>
      }
    >
      <p>
        To compare two recipes, you don&apos;t give each to a different crowd: you let the same
        people taste both. That cancels out differences between tasters.
      </p>
      <p>
        Comparing two prompts or models works the same way. Run both on the same questions and look
        question by question: a <Term id="paired-comparison">paired comparison</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ A versus B, honestly ⭐ --------------------------------------------------------------------- */

export function AvsB() {
  const [s, set] = useSceneState<CompareState>();
  const t = table(s.fixed, s.broke);
  const pu = unpairedP(t.a, t.b, N);
  const pm = mcnemarP(s.fixed, s.broke);
  const cells: [string, number, string][] = [
    ["Both right", t.bothRight, "bg-surface-2"],
    ["B fixed it", s.fixed, "bg-good/30"],
    ["B broke it", s.broke, "bg-bad/30"],
    ["Both wrong", t.bothWrong, "bg-surface-2"],
  ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="A versus B, honestly"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {(
            [
              ["fixed", "questions B fixed"],
              ["broke", "questions B broke"],
            ] as const
          ).map(([k, l]) => (
            <label key={k} className="flex items-center gap-2 text-xs">
              <span className="text-muted w-32">{l}</span>
              <input
                type="range"
                min={0}
                max={30}
                value={s[k]}
                onChange={(e) => set({ [k]: Number(e.target.value) })}
                className="accent-accent flex-1"
                aria-label={l}
              />
              <span className="w-8 font-mono">{s[k]}</span>
            </label>
          ))}
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {cells.map(([k, v, c]) => (
              <motion.div key={k} layout className={cn("rounded-lg px-2 py-2 text-center", c)}>
                <p className="font-mono text-lg">{v}</p>
                <p className="text-muted text-[10px]">{k}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-sm">
            A: <span className="font-mono">{((t.a / N) * 100).toFixed(1)}%</span> · B:{" "}
            <span className="font-mono">{((t.b / N) * 100).toFixed(1)}%</span>
          </p>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {[
              ["Treating them as separate scores", pu],
              ["Paired (McNemar, flips only)", pm],
            ].map(([k, p]) => (
              <div
                key={k as string}
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs",
                  (p as number) < 0.05 ? "border-good bg-good/10" : "border-line bg-surface",
                )}
              >
                <p className="text-muted text-[11px]">{k}</p>
                <p className="font-mono">
                  p = {(p as number) < 0.001 ? "< 0.001" : (p as number).toFixed(3)}
                </p>
                <p className="text-[11px]">
                  {(p as number) < 0.05 ? "Unlikely to be luck" : "Could easily be luck"}
                </p>
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Illustrative: 200 questions; both versions get 144 of the same questions right.
          </p>
        </div>
      }
    >
      <p>
        Both versions answer the same 200 questions. Questions both get right, or both get wrong,
        say nothing about which is better. What matters are the flips: questions B fixed and
        questions B broke.
      </p>
      <p>
        McNemar&apos;s test (1947) looks only at those flips. With 12 fixed and 2 broken, the paired
        test is fairly sure B is better while separate scores can&apos;t tell. Now set fixed and
        broken nearly equal: lots of change, no winner. A <Term id="p-value">p-value</Term> is how
        often luck alone would produce a gap this big.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Try enough variants and one will "win" ------------------------------------------------------ */

export function ManyTries() {
  const [s, set] = useSceneState<CompareState>();
  const ps = nullPValues(20, s.seed);
  const cut = s.bonferroni ? 0.05 / 20 : 0.05;
  const wins = ps.filter((p) => p < cut).length;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Try enough variants and one will “win”"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => set({ seed: s.seed + 1 })}
              className="border-accent rounded-full border px-3 py-1 text-xs"
            >
              Test 20 new prompt variants
            </button>
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={s.bonferroni}
                onChange={(e) => set({ bonferroni: e.target.checked })}
                className="accent-accent"
              />
              Bonferroni: require p &lt; 0.05 ÷ 20
            </label>
          </div>
          <div className="grid grid-cols-10 gap-1">
            {ps.map((p, i) => (
              <motion.div
                key={`${s.seed}-${i}`}
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                className={cn(
                  "flex h-10 flex-col items-center justify-center rounded text-[9px]",
                  p < cut ? "bg-viz-compute/40" : "bg-surface-2",
                )}
              >
                <span className="text-muted">#{i + 1}</span>
                <span className="font-mono">{p.toFixed(2)}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-sm">
            <span className="font-mono">{wins}</span> “significant” winner{wins === 1 ? "" : "s"},
            though none of these variants is actually better.
          </p>
        </div>
      }
    >
      <p>
        Here, 20 prompt variants are each tested against the baseline, and none is truly better. At
        the usual 5% bar you should still expect about one to look like a winner by luck. Press the
        button a few times.
      </p>
      <p>
        Bonferroni&apos;s correction tightens the bar for each test; it&apos;s safe but strict. The
        quieter version of the same trap is the &ldquo;garden of forking paths&rdquo;: choosing
        which metric, subset or prompt to report after seeing the numbers. Decide what you&apos;ll
        compare before you look.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Win rates and ties -------------------------------------------------------------------------- */

export function WinRates() {
  const rows: [string, string][] = [
    [
      "Win rate",
      "Share of comparisons the new version wins. Say how ties count: AlpacaEval counts a tie as half a win, so a model against itself scores 50%.",
    ],
    ["Sign test", "Drop the ties, then ask whether wins and losses look like fair coin flips."],
    [
      "Most ideas don't work",
      "At Microsoft, only about a third of tested ideas improved the metric they targeted; in mature products, fewer. Expect many prompt tweaks to be flat or worse.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Win rates and ties"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {rows.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
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
        When a judge compares answers side by side, you get wins, losses and ties instead of scores.
        A <Term id="win-rate">win rate</Term> summarises them, as long as you say how ties were
        counted.
      </p>
      <p>
        Experiment veterans like Ron Kohavi have a sobering lesson: most ideas don&apos;t move the
        needle. Honest comparisons will often tell you your clever change made no difference, and
        that&apos;s worth knowing.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Honest or fooling yourself? ----------------------------------------------------------------- */

export function HonestOrNot() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Honest or fooling yourself?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="honest-or-not"
            prompt="Is each practice an honest comparison?"
            categories={[
              { id: "honest", label: "Honest" },
              { id: "fool", label: "Fooling yourself" },
            ]}
            items={[
              {
                id: "same",
                label: "Run both versions on the same questions and compare per question",
                category: "honest",
                why: "A paired comparison.",
              },
              {
                id: "best",
                label: "Try 30 prompts and report the best one's score as the improvement",
                category: "fool",
                why: "One will win by luck.",
              },
              {
                id: "subset",
                label: "After seeing results, report only the subset where B wins",
                category: "fool",
                why: "A forking path.",
              },
              {
                id: "plan",
                label: "Write down the metric and threshold before running",
                category: "honest",
                why: "Decided before looking.",
              },
              {
                id: "ties",
                label: "Report a win rate without saying how ties counted",
                category: "fool",
                why: "The number can't be interpreted.",
              },
            ]}
            explanation="Pair your comparisons, decide what you'll measure in advance, and correct for the number of things you tried."
          />
        </div>
      }
    >
      <p>Sort the practices.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Pair your comparisons", "Same questions, compared one by one."],
  ["Only flips matter", "Fixed versus broken (McNemar)."],
  ["Many tries, false wins", "Expect 1 in 20 by luck at 5%."],
  ["Decide before you look", "Avoid the garden of forking paths."],
  ["Say how ties count", "And expect most ideas to be flat."],
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
      <p>Next: what happens when the same question gets different answers each time.</p>
    </StepLayout>
  );
}
