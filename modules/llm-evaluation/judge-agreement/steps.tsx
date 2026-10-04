"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { VERSIONS, kappaFor, landisKoch, stats } from "./model";
import type { AgreementState } from "./state";

/* 1 ─ Checking the new examiner ------------------------------------------------------------------- */

export function SecondOpinion() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Checking the new examiner"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-xs">
          <div className="grid w-full max-w-sm grid-cols-2 gap-2">
            {["Senior examiner", "New examiner"].map((t) => (
              <div
                key={t}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-center"
              >
                <p className="font-semibold">{t}</p>
                <p className="text-muted">marks the same 50 scripts</p>
              </div>
            ))}
          </div>
          <p className="text-muted max-w-sm text-center">
            Where they differ, they talk it through, and the marking guide gets clearer.
          </p>
        </div>
      }
    >
      <p>
        Exam boards don&apos;t let a new examiner mark alone straight away. A senior examiner marks
        the same scripts, they compare, and the new examiner only works alone once they agree
        closely enough.
      </p>
      <p>
        Your LLM judge is the new examiner. Before trusting its grades, compare them with labels
        from a domain expert, measure the agreement properly, and improve the rubric where they
        disagree.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Judge versus experts ⭐ --------------------------------------------------------------------- */

export function JudgeVsExperts() {
  const [s, set] = useSceneState<AgreementState>();
  const v = VERSIONS.find((x) => x.id === s.version) ?? VERSIONS[0];
  const st = stats(v);
  const cells: [string, number, string][] = [
    ["Both say FAIL", v.caught, "bg-good/20"],
    ["Expert FAIL, judge PASS", v.missed, "bg-bad/20"],
    ["Expert PASS, judge FAIL", v.falseFail, "bg-viz-compute/20"],
    ["Both say PASS", st.trueNeg, "bg-good/10"],
  ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Judge versus experts"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {VERSIONS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.version === x.id}
                onClick={() => set({ version: x.id })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.version === x.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {x.name}
              </button>
            ))}
          </div>
          <p className="border-line bg-surface rounded-lg border px-3 py-2 font-mono text-[11px]">
            {v.rubric}
          </p>
          <div className="grid grid-cols-[auto_1fr_1fr] gap-1 text-xs">
            <span />
            <span className="text-muted text-center text-[10px]">judge FAIL</span>
            <span className="text-muted text-center text-[10px]">judge PASS</span>
            <span className="text-muted self-center text-[10px]">expert FAIL</span>
            {cells.slice(0, 2).map(([k, n, c]) => (
              <motion.div key={k} layout className={cn("rounded-lg px-2 py-2 text-center", c)}>
                <p className="font-mono text-lg">{n}</p>
                <p className="text-muted text-[10px]">{k}</p>
              </motion.div>
            ))}
            <span className="text-muted self-center text-[10px]">expert PASS</span>
            {cells.slice(2).map(([k, n, c]) => (
              <motion.div key={k} layout className={cn("rounded-lg px-2 py-2 text-center", c)}>
                <p className="font-mono text-lg">{n}</p>
                <p className="text-muted text-[10px]">{k}</p>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs sm:grid-cols-4">
            {[
              ["Raw agreement", `${Math.round(st.agreement * 100)}%`],
              ["Cohen's kappa", st.kappa.toFixed(2)],
              ["Fails caught", `${v.caught} of ${v.caught + v.missed}`],
              [
                "Its fails that were real",
                v.caught + v.falseFail ? `${Math.round(st.precisionFail * 100)}%` : "—",
              ],
            ].map(([k, val]) => (
              <div key={k} className="border-line bg-surface rounded-lg border px-2.5 py-1.5">
                <p className="text-subtle text-[10px]">{k}</p>
                <p className="font-mono">{val}</p>
              </div>
            ))}
          </div>
          <p className="text-muted text-xs">{v.example}</p>
          <p className="text-subtle text-[10px]">
            Illustrative: 50 outputs, 10 of which the expert failed.
          </p>
        </div>
      }
    >
      <p>
        An expert has labelled 50 support replies PASS or FAIL; 10 are real failures. Step through
        the judge&apos;s versions, starting with a lazy one that passes everything.
      </p>
      <p>
        The lazy judge agrees 80% of the time and catches nothing, which is why raw agreement
        misleads when most outputs pass. Read the{" "}
        <Term id="confusion-matrix">confusion matrix</Term>, how many real fails it catches, and{" "}
        <Term id="cohens-kappa">Cohen&apos;s kappa</Term>, which discounts lucky agreement.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Agreement beyond luck ----------------------------------------------------------------------- */

export function Kappa() {
  const [s, set] = useSceneState<AgreementState>();
  const k = kappaFor(s.po, s.passRate);
  const pe = s.passRate ** 2 + (1 - s.passRate) ** 2;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Agreement beyond luck"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted w-28">raters agree on</span>
            <input
              type="range"
              min={0.5}
              max={1}
              step={0.01}
              value={s.po}
              onChange={(e) => set({ po: Number(e.target.value) })}
              className="accent-accent flex-1"
              aria-label="Observed agreement"
            />
            <span className="w-10 font-mono">{Math.round(s.po * 100)}%</span>
          </label>
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted w-28">outputs that pass</span>
            <input
              type="range"
              min={0.5}
              max={0.98}
              step={0.01}
              value={s.passRate}
              onChange={(e) => set({ passRate: Number(e.target.value) })}
              className="accent-accent flex-1"
              aria-label="Pass rate"
            />
            <span className="w-10 font-mono">{Math.round(s.passRate * 100)}%</span>
          </label>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 font-mono text-xs">
            <p>κ = (agreement − chance) / (1 − chance)</p>
            <p className="mt-1">
              = ({s.po.toFixed(2)} − {pe.toFixed(2)}) / (1 − {pe.toFixed(2)}) ={" "}
              <span className="text-accent text-base">{k.toFixed(2)}</span>
            </p>
          </div>
          <p className="text-xs">
            Rough label: <span className="font-semibold">{landisKoch(k)}</span>
            <span className="text-muted">
              {" "}
              (Landis &amp; Koch, 1977: a guide based on opinion, not a standard)
            </span>
          </p>
        </div>
      }
    >
      <p>
        Two raters who both pass 90% of outputs will agree about 82% of the time by pure luck. Jacob
        Cohen&apos;s kappa (1960) asks how much better than luck they do: 1 is perfect, 0 is chance,
        below 0 is worse than chance.
      </p>
      <p>
        Push the pass rate up and watch the same raw agreement shrink to a small kappa. When
        failures are rare, report how many real failures the judge catches, not just how often it
        agrees.
      </p>
    </StepLayout>
  );
}

/* 4 ─ The calibration loop ------------------------------------------------------------------------ */

export function Loop() {
  const steps: [string, string][] = [
    ["Pick one expert", "Someone whose judgement defines “good” for this product."],
    ["Label with reasons", "PASS or FAIL, plus a short written critique, on real outputs."],
    ["Run the judge", "Compare verdicts; read every disagreement."],
    [
      "Fix the rubric",
      "Add rules and examples from the critiques. Expect the expert's own criteria to sharpen too.",
    ],
    ["Test on fresh labels", "Measure agreement on examples you didn't tune on."],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="The calibration loop"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {steps.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface grid grid-cols-[1.5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-mono">{i + 1}</span>
              <span>
                <span className="font-semibold">{t}: </span>
                <span className="text-muted">{d}</span>
              </span>
            </motion.div>
          ))}
          <p className="text-muted text-center text-[11px]">
            ↻ repeat until agreement is high enough for the decisions you&apos;ll make
          </p>
        </div>
      }
    >
      <p>
        Practitioners such as Hamel Husain suggest one principal expert, pass/fail labels with
        written critiques, and rounds of rubric fixes until the judge agrees closely.
      </p>
      <p>
        A 2024 study by Shreya Shankar and colleagues found{" "}
        <Term id="criteria-drift">criteria drift</Term>: people refine what they mean by
        &ldquo;good&rdquo; as they read outputs. You can&apos;t write the perfect rubric up front;
        you discover it by grading.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Trust it more or less? ---------------------------------------------------------------------- */

export function TrustIt() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Trust it more or less?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="trust-it"
            prompt="Does each finding make you trust the judge more or less?"
            categories={[
              { id: "more", label: "Trust more" },
              { id: "less", label: "Trust less" },
            ]}
            items={[
              {
                id: "rare",
                label: "92% agreement, but 95% of outputs pass",
                category: "less",
                why: "Luck alone gives about 90%.",
              },
              {
                id: "caught",
                label: "It catches 9 of the expert's 10 failures",
                category: "more",
                why: "It finds what matters.",
              },
              {
                id: "k05",
                label: "Kappa of 0.05",
                category: "less",
                why: "Barely better than chance.",
              },
              {
                id: "fresh",
                label: "Agreement measured on new labels it was never tuned on",
                category: "more",
                why: "An honest test.",
              },
              {
                id: "same",
                label: "Agreement measured on the examples used to write the rubric",
                category: "less",
                why: "It was tuned to pass those.",
              },
            ]}
            explanation="Look past raw agreement: chance-corrected agreement, failures caught, and a test on fresh labels."
          />
        </div>
      }
    >
      <p>Sort the findings.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Validate the judge", "Against an expert's labels."],
  ["Raw agreement misleads", "Especially when most outputs pass."],
  ["Kappa corrects for luck", "Bands are rough guides."],
  ["Count failures caught", "Read the confusion matrix."],
  ["Iterate with critiques", "Criteria sharpen as you grade."],
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
      <p>Next: when people themselves are the judges.</p>
    </StepLayout>
  );
}
