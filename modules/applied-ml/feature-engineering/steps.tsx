"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BASE, CANDS, CITIES, ROW, auc } from "./model";
import type { FeState } from "./state";

/* 1 ─ Ingredients, prepared ----------------------------------------------------------------------- */

export function Ingredients() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Ingredients, prepared"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-muted text-[10px]">RAW</p>
            <p className="mt-1 text-2xl">🧅 🥕 🍅 🌿</p>
            <p className="text-muted mt-1">Whole, unwashed, in a bag.</p>
          </div>
          <div className="border-accent bg-accent-soft rounded-xl border px-4 py-3 text-xs">
            <p className="text-muted text-[10px]">PREPARED</p>
            <p className="mt-1 font-mono text-[11px]">
              diced onion · sliced carrot · chopped tomato · torn herbs
            </p>
            <p className="text-muted mt-1">Ready for the recipe.</p>
          </div>
        </div>
      }
    >
      <p>
        A chef doesn&apos;t throw whole vegetables into the pan. They wash, peel and chop them into
        a shape the recipe can use. That preparation often decides the dish more than the recipe
        does.
      </p>
      <p>
        Models need their ingredients prepared too: numbers, in useful shapes.{" "}
        <Term id="feature-engineering">Feature engineering</Term> turns raw columns like dates,
        categories and purchase logs into features that carry signal.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Build features, watch the score ⭐ ---------------------------------------------------------- */

export function BuildFeatures() {
  const [s, set] = useSceneState<FeState>();
  const score = auc(s.chosen);
  const toggle = (id: string) =>
    set({ chosen: s.chosen.includes(id) ? s.chosen.filter((x) => x !== id) : [...s.chosen, id] });
  const last = CANDS.find((c) => c.id === s.chosen[s.chosen.length - 1]);
  return (
    <StepLayout
      eyebrow="Build and connect"
      title="Build features, watch the score"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-[13rem_1fr]">
          <div className="border-line bg-surface self-start rounded-lg border px-3 py-2 text-[11px]">
            <p className="text-subtle text-[10px]">ONE RAW CUSTOMER ROW</p>
            {ROW.raw.map(([k, v]) => (
              <p key={k} className="flex justify-between gap-2 font-mono">
                <span className="text-muted">{k}</span>
                <span>{v}</span>
              </p>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              {CANDS.map((c) => (
                <label
                  key={c.id}
                  className={cn(
                    "flex items-start gap-2 rounded-lg border px-2.5 py-1 text-[11px]",
                    s.chosen.includes(c.id)
                      ? c.kind === "good"
                        ? "border-good bg-good/10"
                        : c.kind === "bad"
                          ? "border-bad bg-bad/10"
                          : "border-viz-compute bg-viz-compute/10"
                      : "border-line bg-surface",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={s.chosen.includes(c.id)}
                    onChange={() => toggle(c.id)}
                    className="accent-accent mt-0.5"
                  />
                  <span>
                    {c.name} <span className="text-subtle">· from {c.from}</span>
                  </span>
                </label>
              ))}
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted w-28">validation AUC</span>
                <div className="bg-surface-2 h-3 flex-1 overflow-hidden rounded">
                  <motion.div
                    animate={{ width: `${((score - 0.5) / 0.4) * 100}%` }}
                    className="bg-accent h-full"
                  />
                </div>
                <span className="w-10 text-right font-mono">{score.toFixed(2)}</span>
              </div>
              <p className="text-muted mt-1 text-[11px]">
                {last
                  ? last.note
                  : `With no features the model is a coin toss plus a little (${BASE.toFixed(2)}). Add some.`}
              </p>
            </div>
            <p className="text-subtle text-[10px]">
              Illustrative scores. AUC: 0.5 is guessing, 1.0 is perfect (module 12).
            </p>
          </div>
        </div>
      }
    >
      <p>
        You&apos;re predicting which subscribers will cancel. Add candidate features one at a time
        and watch the validation score. Some help a lot, some do nothing, some quietly hurt.
      </p>
      <p>
        The big wins usually come from understanding the problem: recent inactivity, engagement over
        the last few weeks, how long someone has been a customer. Notice too that each extra good
        feature adds a little less than the last.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Turning categories into numbers ------------------------------------------------------------- */

export function Encodings() {
  const [s, set] = useSceneState<FeState>();
  const cities = ["Agra", "Kochi", "Pune"];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Turning categories into numbers"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ["onehot", "One-hot"],
                ["ordinal", "Ordinal"],
                ["target", "Target"],
              ] as const
            ).map(([id, l]) => (
              <button
                key={id}
                type="button"
                aria-pressed={s.encoding === id}
                onClick={() => set({ encoding: id })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.encoding === id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="border-line bg-surface overflow-x-auto rounded-lg border">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="text-muted text-[10px]">
                  <th className="px-3 py-1.5 text-left font-normal">city</th>
                  {s.encoding === "onehot" ? (
                    cities.map((c) => (
                      <th key={c} className="px-3 py-1.5 font-normal">
                        is_{c}
                      </th>
                    ))
                  ) : (
                    <th className="px-3 py-1.5 font-normal">
                      {s.encoding === "ordinal" ? "city_code" : "city_churn_rate"}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {CITIES.map((r, i) => (
                  <tr key={i} className="border-line border-t">
                    <td className="px-3 py-1.5">{r.city}</td>
                    {s.encoding === "onehot" ? (
                      cities.map((c) => (
                        <td key={c} className="px-3 py-1.5 text-center">
                          {r.city === c ? 1 : 0}
                        </td>
                      ))
                    ) : (
                      <td className="px-3 py-1.5 text-center">
                        {s.encoding === "ordinal" ? cities.indexOf(r.city) + 1 : r.churn.toFixed(2)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted text-xs">
            {s.encoding === "onehot"
              ? "One yes/no column per value. Clear and safe, but 900 cities would mean 900 columns."
              : s.encoding === "ordinal"
                ? "1, 2, 3 implies Agra < Kochi < Pune. Fine for small < medium < large; misleading for cities, especially for linear models."
                : "Each city becomes its average churn rate. Compact for many values, but it uses the answer, so compute it out-of-fold or it leaks."}
          </p>
        </div>
      }
    >
      <p>
        Models need numbers, so text categories must be encoded.{" "}
        <Term id="one-hot-encoding">One-hot encoding</Term> is the safe default for a handful of
        values; ordinal codes suit categories with a real order;{" "}
        <Term id="target-encoding">target encoding</Term> handles columns with hundreds of values.
      </p>
      <p>
        scikit-learn&apos;s TargetEncoder (since 2023) does the out-of-fold computation for you when
        you call <span className="font-mono text-[13px]">fit_transform</span> on training data.
        Module 6 shows what happens when you don&apos;t.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Scales, logs and clocks --------------------------------------------------------------------- */

export function Shapes() {
  const [s, set] = useSceneState<FeState>();
  const a = (s.hour / 24) * Math.PI * 2 - Math.PI / 2;
  const x = Math.round((60 + 40 * Math.cos(a)) * 10) / 10;
  const y = Math.round((60 + 40 * Math.sin(a)) * 10) / 10;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Scales, logs and clocks"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid items-center gap-3 sm:grid-cols-[8rem_1fr]">
            <svg viewBox="0 0 120 120" className="mx-auto w-32">
              <circle cx={60} cy={60} r={40} className="stroke-line-strong fill-none" />
              {[0, 6, 12, 18].map((h) => {
                const aa = (h / 24) * Math.PI * 2 - Math.PI / 2;
                return (
                  <text
                    key={h}
                    x={Math.round((60 + 52 * Math.cos(aa)) * 10) / 10}
                    y={Math.round((63 + 52 * Math.sin(aa)) * 10) / 10}
                    textAnchor="middle"
                    className="fill-muted font-mono text-[8px]"
                  >
                    {h}
                  </text>
                );
              })}
              <circle cx={x} cy={y} r={5} className="fill-accent" />
            </svg>
            <div className="flex flex-col gap-2 text-xs">
              <label className="flex items-center gap-2">
                <span className="text-muted">hour</span>
                <input
                  type="range"
                  min={0}
                  max={23}
                  value={s.hour}
                  onChange={(e) => set({ hour: Number(e.target.value) })}
                  className="accent-accent flex-1"
                  aria-label="Hour"
                />
                <span className="w-6 font-mono">{s.hour}</span>
              </label>
              <p className="font-mono text-[11px]">
                sin = {Math.sin((s.hour / 24) * Math.PI * 2).toFixed(2)} · cos ={" "}
                {Math.cos((s.hour / 24) * Math.PI * 2).toFixed(2)}
              </p>
              <p className="text-muted text-[11px]">
                As a plain number, 23 and 0 look far apart. On the circle they&apos;re neighbours.
              </p>
            </div>
          </div>
          <Code>{`from sklearn.pipeline import make_pipeline
from sklearn.compose import make_column_transformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler, TargetEncoder
from sklearn.linear_model import LogisticRegression

prep = make_column_transformer(
    (OneHotEncoder(handle_unknown="ignore"), ["plan"]),
    (TargetEncoder(), ["city"]),
    (StandardScaler(), ["tenure", "log_spend"]),
)
model = make_pipeline(prep, LogisticRegression())   # learned from training data only`}</Code>
        </div>
      }
    >
      <p>
        <Term id="feature-scaling">Scaling</Term> puts numbers on comparable ranges, which matters
        for models that use distances or gradient descent; tree models are almost unaffected. A log
        transform tames long-tailed values such as income. Times of day and months go round in
        circles, so encode them as a sine and cosine pair.
      </p>
      <p>
        Wrap every step in a pipeline, so it&apos;s learned from training data only and replayed
        exactly the same way at prediction time.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which encoding? ----------------------------------------------------------------------------- */

export function WhichEncoding() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which encoding?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-encoding"
            prompt="Which encoding suits each column?"
            categories={[
              { id: "onehot", label: "One-hot" },
              { id: "ordinal", label: "Ordinal" },
              { id: "target", label: "Target (out-of-fold)" },
            ]}
            items={[
              {
                id: "payment",
                label: "Payment method: card, UPI, wallet",
                category: "onehot",
                why: "A few values, no order.",
              },
              {
                id: "size",
                label: "T-shirt size: S, M, L, XL",
                category: "ordinal",
                why: "A real order.",
              },
              {
                id: "pin",
                label: "PIN code, with 19,000 values",
                category: "target",
                why: "Too many for one-hot.",
              },
              {
                id: "edu",
                label: "Education: school, bachelor's, master's, doctorate",
                category: "ordinal",
                why: "Ordered levels.",
              },
              {
                id: "device",
                label: "Device: phone, tablet, laptop",
                category: "onehot",
                why: "Few values, unordered.",
              },
            ]}
            explanation="Few unordered values: one-hot. A real order: ordinal. Very many values: target encoding, computed out-of-fold."
          />
        </div>
      }
    >
      <p>Sort the columns.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Features carry the signal", "Often more than the algorithm."],
  ["Understand the problem", "Recency, engagement, tenure."],
  ["Encode categories carefully", "One-hot, ordinal or target."],
  ["Shape the numbers", "Scale, log, circles for time."],
  ["Use a pipeline", "Learned on training data, replayed in production."],
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
      <p>Next: the features that make a model look perfect and fail in production.</p>
    </StepLayout>
  );
}
