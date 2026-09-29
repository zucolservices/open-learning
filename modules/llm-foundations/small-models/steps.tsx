"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import data from "./data.json";
import type { SmallState } from "./state";

const pct = (x: number) => `${+(x * 100).toFixed(1)}%`;
const ms = (x: number) =>
  x < 10 ? `${x.toFixed(1)} ms` : x < 1000 ? `${Math.round(x)} ms` : `${(x / 1000).toFixed(1)} s`;

/* 1 ─ Sizes, from phone to data centre ------------------------------------------------------------ */

const LADDER: [string, number, string][] = [
  ["all-MiniLM-L6-v2 (embedding model)", 22.7e6, "phone"],
  ["Gemma 3 270M", 270e6, "phone"],
  ["Qwen2.5 0.5B", 0.49e9, "phone"],
  ["Qwen2.5 1.5B", 1.54e9, "phone"],
  ["Phi-4-mini", 3.8e9, "laptop"],
  ["Llama 3.1 8B", 8.03e9, "laptop"],
  ["Llama 3.1 70B", 70.6e9, "one big GPU (4-bit)"],
  ["DeepSeek-V3", 671e9, "a GPU server"],
];

export function Sizes() {
  const lo = Math.log10(1e7);
  const hi = Math.log10(1e12);
  return (
    <StepLayout
      eyebrow="Overview"
      title="From phone to data centre"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {LADDER.map(([n, p, where], i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-2 text-xs"
            >
              <span className="w-44 shrink-0 truncate sm:w-56">{n}</span>
              <span className="bg-surface-2 relative h-4 flex-1 overflow-hidden rounded">
                <motion.span
                  className={cn(
                    "absolute inset-y-0 left-0 rounded",
                    i < 4 ? "bg-accent" : "bg-viz-data/70",
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${((Math.log10(p) - lo) / (hi - lo)) * 100}%` }}
                  transition={{ delay: i * 0.06 }}
                />
              </span>
              <span className="w-16 text-right font-mono">
                {p >= 1e9 ? `${+(p / 1e9).toFixed(1)}B` : `${Math.round(p / 1e6)}M`}
              </span>
              <span className="text-muted hidden w-32 text-[10px] sm:block">{where}</span>
            </motion.div>
          ))}
          <p className="text-subtle mt-1 text-[10px]">
            Parameters on a log scale: each step right is ten times bigger. &ldquo;Runs on&rdquo; is
            a rough guide at 4-bit precision.
          </p>
        </div>
      }
    >
      <p>
        A hospital doesn&apos;t send every patient to the most senior surgeon. A pharmacist checks
        prescriptions faster, and a triage nurse sorts cases in seconds.
      </p>
      <p>
        Models are similar. <Term id="small-language-model">Small models</Term>, from a few million
        to a few billion parameters, run on phones and laptops and are very good at narrow jobs.
      </p>
    </StepLayout>
  );
}

/* 2 ─ A real routing test ⭐ ----------------------------------------------------------------------- */

const ENTRIES: [string, string, keyof typeof data.test, keyof typeof data.ms, string][] = [
  ["Qwen2.5 0.5B", "just asked", "qwen05_zero", "qwen05_zero", "bg-viz-data/60"],
  ["Qwen2.5 1.5B", "just asked", "qwen15_zero", "qwen15_zero", "bg-viz-data/60"],
  ["Phi-4-mini 3.8B", "just asked", "phi_zero", "phi_zero", "bg-viz-data/60"],
  ["Qwen2.5 1.5B", "with 8 examples", "qwen15_few", "qwen15_few", "bg-viz-data"],
  ["22M student", "trained on the 1.5B's labels", "student_soft", "student", "bg-accent/70"],
  ["22M student", "trained on correct labels", "student_truth", "student", "bg-accent"],
];

export function RoutingTest() {
  return (
    <StepLayout
      eyebrow="Real measurements"
      title="Sorting support messages"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-2 text-[11px]">
              Correct queue on {data.testN} unseen messages · time per message on a laptop
            </p>
            <div className="grid gap-2">
              {ENTRIES.map(([n, how, k, t, c], i) => (
                <div
                  key={`${n}${how}`}
                  className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_4.5rem] items-center gap-2 text-xs"
                >
                  <span className="min-w-0">
                    <span className="font-semibold">{n}</span>
                    <span className="text-muted block truncate text-[10px]">{how}</span>
                  </span>
                  <span className="bg-surface-2 relative h-4 overflow-hidden rounded">
                    <motion.span
                      className={cn("absolute inset-y-0 left-0 rounded", c)}
                      initial={{ width: 0 }}
                      animate={{ width: `${data.test[k] * 100}%` }}
                      transition={{ delay: i * 0.08 }}
                    />
                    <span className="absolute inset-y-0 left-2 grid place-items-center font-mono text-[10px]">
                      {pct(data.test[k])}
                    </span>
                  </span>
                  <span className="text-right font-mono">{ms(data.ms[t])}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              [
                "Bigger isn't automatically better",
                "The 3.8B model, just asked, did worse than the 1.5B.",
              ],
              ["Prompting mattered more", "Eight examples took the 1.5B model from 75% to 95%."],
              ["Tiny and trained wins", "A 22M model trained on good labels: 97.5%, in 2 ms."],
            ].map(([t, d]) => (
              <div key={t} className="border-line bg-surface rounded-xl border px-3 py-2">
                <p className="text-xs font-semibold">{t}</p>
                <p className="text-muted text-[11px]">{d}</p>
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Measured by us: {data.n} invented support messages in four queues (delivery, payments,
            quality, account); tested on {data.testN} built from phrasings not used for training.
            Language models at 4-bit on an Apple M3 Pro CPU, answer chosen by the
            highest-probability label. The student is all-MiniLM-L6-v2 embeddings plus a small
            classifier.
          </p>
        </div>
      }
    >
      <p>
        A real, narrow job: sort customer messages into four support queues. We ran it on models
        from 22 million to 3.8 billion parameters.
      </p>
      <p>
        The star is tiny: a small embedding model with a simple classifier on top, 400 times faster
        than the 1.5B model with examples, and as accurate once it has good training labels.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Distillation ------------------------------------------------------------------------------------ */

const DISTIL = [
  {
    title: "A teacher labels examples",
    text: "A bigger, slower model (here, Qwen2.5 1.5B with eight examples in its prompt) sorts 160 training messages. It agrees with the correct queue 86% of the time.",
  },
  {
    title: "A student learns from the teacher",
    text: "A tiny model is trained to copy the teacher's answers, ideally its full probabilities (“soft labels”), not just its top pick. That's knowledge distillation (Hinton et al., 2015).",
  },
  {
    title: "It learns the teacher's flaws too",
    text: "The student learns the teacher's habits, flaws included: it sometimes fixes the teacher's errors and makes new ones of its own, reaching 75% on unseen messages. Trained on correct labels, the same student reaches 97.5%. Label quality matters more than student size.",
  },
  {
    title: "How it's done in practice",
    text: "Use a strong model as teacher, have people check a sample of its labels, then train the small model. DeepSeek, for example, distilled its R1 reasoning model into smaller Qwen and Llama models, and Google trained the smaller Gemma 2 models by distillation.",
  },
];

export function Distillation() {
  const [s, set] = useSceneState<SmallState>();
  const f = Math.min(s.distil, DISTIL.length - 1);
  const ex = data.examples
    .filter((e) => (f >= 2 ? e.teacher !== e.truth || e.student !== e.truth : true))
    .slice(0, 5);
  return (
    <StepLayout
      eyebrow="Step through"
      title="Distillation"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface overflow-x-auto rounded-xl border">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 text-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">Message</th>
                  <th className="px-3 py-2 font-medium">Correct</th>
                  <th className="px-3 py-2 font-medium">Teacher</th>
                  {f >= 1 && <th className="px-3 py-2 font-medium">Student</th>}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {ex.map((e) => (
                    <motion.tr
                      key={e.text}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-line border-t"
                    >
                      <td className="max-w-56 px-3 py-1.5">{e.text}</td>
                      <td className="px-3 py-1.5">{e.truth}</td>
                      <Verdict label={e.teacher} ok={e.teacher === e.truth} />
                      {f >= 1 && <Verdict label={e.student} ok={e.student === e.truth} />}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          <Stepper step={f} count={DISTIL.length} onChange={(n) => set({ distil: n })} />
          <FrameCaption frameKey={f} title={DISTIL[f].title}>
            {DISTIL[f].text}
          </FrameCaption>
          <p className="text-subtle text-[10px]">
            Real messages and predictions from the test above.
          </p>
        </div>
      }
    >
      <p>
        Where do good small models come from? Often from a bigger model&apos;s answers:{" "}
        <Term id="distillation">distillation</Term>.
      </p>
      <p>Step through it with the real teacher and student from the last step.</p>
    </StepLayout>
  );
}

function Verdict({ label, ok }: { label: string; ok: boolean }) {
  return (
    <td className="px-3 py-1.5">
      <span className="inline-flex items-center gap-1">
        {ok ? <Check className="text-good size-3.5" /> : <X className="text-bad size-3.5" />}
        {label}
      </span>
    </td>
  );
}

/* 4 ─ Small first, escalate when unsure ⭐ ------------------------------------------------------- */

export function Cascade() {
  const [s, set] = useSceneState<SmallState>();
  const curve = data.cascade;
  const c = curve[Math.min(s.threshold, curve.length - 1)];
  const W = 520;
  const H = 150;
  const x = (esc: number) => 40 + esc * (W - 60);
  const y = (a: number) => H - 20 - ((a - 0.6) / 0.4) * (H - 36);
  return (
    <StepLayout
      eyebrow="Real measurements"
      title="Small first, escalate when unsure"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <label className="grid gap-1 text-xs">
            <span className="text-muted flex justify-between">
              Send to the big model when the student is less than this sure
              <span className="text-fg font-mono">
                {c.threshold > 1 ? "always" : pct(c.threshold)}
              </span>
            </span>
            <input
              type="range"
              min={0}
              max={curve.length - 1}
              step={1}
              value={s.threshold}
              onChange={(e) => set({ threshold: Number(e.target.value) })}
              aria-label="Confidence threshold"
            />
          </label>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted text-[11px]">
              Correct answers (up) against the share sent to the big model (right)
            </p>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              role="img"
              aria-label="Accuracy against share escalated"
            >
              {[0.6, 0.8, 1].map((a) => (
                <g key={a}>
                  <line
                    x1={36}
                    x2={W - 16}
                    y1={y(a)}
                    y2={y(a)}
                    stroke="var(--line-strong)"
                    strokeOpacity={0.3}
                  />
                  <text x={32} y={y(a) + 3} textAnchor="end" className="fill-muted text-[10px]">
                    {pct(a)}
                  </text>
                </g>
              ))}
              <polyline
                fill="none"
                stroke="var(--accent)"
                strokeWidth={2.5}
                points={curve.map((p) => `${x(p.escalated)},${y(p.acc)}`).join(" ")}
              />
              <motion.circle
                initial={{ cx: x(c.escalated), cy: y(c.acc) }}
                animate={{ cx: x(c.escalated), cy: y(c.acc) }}
                r={6}
                fill="var(--accent)"
              />
              {[0, 0.5, 1].map((e) => (
                <text
                  key={e}
                  x={x(e)}
                  y={H - 4}
                  textAnchor="middle"
                  className="fill-muted text-[10px]"
                >
                  {pct(e)}
                </text>
              ))}
            </svg>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Correct", pct(c.acc)],
              ["Sent to the big model", pct(c.escalated)],
              ["Average time", ms(c.ms)],
            ].map(([l, v]) => (
              <div key={l} className="bg-surface-2 rounded-lg px-2.5 py-1.5">
                <p className="text-muted text-[10px]">{l}</p>
                <motion.p
                  key={v}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 1 }}
                  className="font-mono text-sm"
                >
                  {v}
                </motion.p>
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Computed from the real runs: the soft-label student answers when confident; otherwise
            the 1.5B teacher (with examples) answers. Times are laptop measurements.
          </p>
        </div>
      }
    >
      <p>
        You don&apos;t have to choose one model. Let the small one answer when it&apos;s confident
        and hand the rest to the big one: a cascade, a form of{" "}
        <Term id="model-routing">model routing</Term>.
      </p>
      <p>
        Here, escalating just 30% of messages gives the big model&apos;s 95% accuracy at about a
        third of its average time.
      </p>
      <div className="border-line bg-surface rounded-xl border px-3 py-2.5 text-sm">
        <p className="font-semibold">Can you trust “confident”?</p>
        <p className="text-muted mt-1">
          A cascade only works if the small model&apos;s confidence means something. A model is{" "}
          <Term id="calibration">calibrated</Term> when answers given with 90% confidence are right
          about 90% of the time; many modern networks are overconfident (Guo et al., 2017).
        </p>
        <p className="text-muted mt-1">
          New &ldquo;decision models&rdquo; are built around this idea. TypeSafe&apos;s Jev
          (announced September 2026, closed and API-only) returns only a choice, a score or a yes/no
          with probabilities, trained for calibration. TypeSafe notes calibration holds across many
          predictions, not for any single answer, and one independent test found it still
          overconfident on some question types. Whatever the model, check its calibration on your
          own data before trusting a threshold.
        </p>
      </div>
    </StepLayout>
  );
}

/* 5 ─ On the device -------------------------------------------------------------------------------- */

export function OnDevice() {
  return (
    <StepLayout
      eyebrow="Reference"
      title="Models on your phone"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              ["Private", "Text, photos and voice never leave the device."],
              [
                "Works offline",
                "No network, no problem: useful in the field and on patchy connections.",
              ],
              ["Instant and free per use", "No round trip to a server and no per-token bill."],
              [
                "But limited",
                "Memory, battery and heat cap model size; hard questions still need a big model.",
              ],
            ].map(([t, d], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={cn(
                  "rounded-xl border px-3 py-2",
                  i === 3 ? "border-bad/40 bg-bad/5" : "border-line bg-surface",
                )}
              >
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted text-xs">{d}</p>
              </motion.div>
            ))}
          </div>
          <div className="border-line bg-surface rounded-xl border px-3 py-2 text-xs">
            <p className="font-semibold">Where you&apos;ll meet them</p>
            <p className="text-muted mt-0.5">
              Apple&apos;s on-device foundation model (about 3B parameters in 2025, open to app
              developers through its Foundation Models framework); Google&apos;s Gemini Nano on
              Android through the ML Kit GenAI APIs; open models such as Gemma 3 270M, Qwen and Phi
              run locally with tools like llama.cpp and Ollama, or with Transformers.js, the library
              we used to run the models in this track.
            </p>
          </div>
        </div>
      }
    >
      <p>
        The smallest models now ship inside phones and laptops, often quantized to 4 bits or fewer.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function SmallOrLarge() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Small or large?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="small-or-large"
            prompt="Which size of model fits each job?"
            categories={[
              { id: "small", label: "Small, focused model" },
              { id: "large", label: "Large general model" },
            ]}
            items={[
              {
                id: "spam",
                label: "Flag spam in 50 million product reviews a day",
                category: "small",
                why: "Narrow, huge volume, easy to train on labelled examples: a small model is faster and far cheaper.",
              },
              {
                id: "keyboard",
                label: "Suggest the next word on a phone keyboard",
                category: "small",
                why: "Must be instant, offline and private.",
              },
              {
                id: "contract",
                label: "Explain the risks in a 40-page supplier contract",
                category: "large",
                why: "Open-ended reasoning over long, unfamiliar text.",
              },
              {
                id: "pii",
                label: "Mask phone numbers and Aadhaar numbers before logs are stored",
                category: "small",
                why: "A narrow extraction task: small models (or even rules) do it reliably and cheaply.",
              },
              {
                id: "strategy",
                label: "Draft a policy response weighing five conflicting reports",
                category: "large",
                why: "Broad knowledge, nuance and long context favour a large model.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Narrow and high-volume, or broad and difficult?</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ------------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Narrow jobs, small models", "Well-defined tasks at volume rarely need a giant."],
  ["Data beats size", "A tiny model trained on good labels matched a model 70× bigger."],
  ["Distillation", "Big models teach small ones; they pass on their mistakes too."],
  ["Cascade", "Small first, escalate when unsure: most of the quality at a fraction of the cost."],
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
      <p>That completes the model landscape.</p>
      <p>Next chapter: safety and responsibility, starting with prompt injection.</p>
    </StepLayout>
  );
}
