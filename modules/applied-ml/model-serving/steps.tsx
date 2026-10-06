"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BUGS, N, flipped, stats } from "./model";
import type { ServeState } from "./state";

/* 1 ─ Bake overnight or made to order? ------------------------------------------------------------ */

export function Bakery() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Bake overnight or made to order?"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "🥐",
              "Overnight",
              "Bake 300 croissants at 4 am. Every customer gets one instantly, but they were decided hours ago.",
            ],
            [
              "🥞",
              "Made to order",
              "Cook each pancake when it's ordered. Fresh and personal, but the customer waits and the kitchen must keep up.",
            ],
          ].map(([e, t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3 text-xs"
            >
              <p className="text-3xl">{e}</p>
              <p className="mt-1 text-sm font-semibold">{t}</p>
              <p className="text-muted mt-1">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A bakery chooses between baking ahead and cooking to order. A trained model faces the same
        choice. It is only useful once it&apos;s <Term id="model-serving">served</Term>: something
        asks it a question and gets an answer back.
      </p>
      <p>
        You can work out every answer ahead of time, or answer each request as it comes. Either way,
        the model must see data prepared exactly as it was in training. That&apos;s where the first
        surprise lies.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Same model, different answers ⭐ ------------------------------------------------------------ */

export function Skew() {
  const [s, set] = useSceneState<ServeState>();
  const off = stats(s.bugs, s.shared, false);
  const on = stats(s.bugs, s.shared, true);
  const flips = flipped(s.bugs, s.shared);
  const toggle = (id: (typeof BUGS)[number]["id"]) =>
    set({
      bugs: s.bugs.includes(id) ? s.bugs.filter((b) => b !== id) : [...s.bugs, id],
      shared: false,
    });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Same model, different answers"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {BUGS.map((b) => (
              <label
                key={b.id}
                className={cn(
                  "flex cursor-pointer gap-2 rounded-lg border px-3 py-2 text-xs",
                  s.bugs.includes(b.id) && !s.shared
                    ? "border-bad bg-bad/10"
                    : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={s.bugs.includes(b.id)}
                  onChange={() => toggle(b.id)}
                  className="accent-accent mt-0.5"
                  aria-label={b.name}
                />
                <span>
                  <span className="font-semibold">{b.name}</span>
                  <span className="text-muted block">{b.detail}</span>
                </span>
              </label>
            ))}
          </div>
          <button
            type="button"
            aria-pressed={s.shared}
            onClick={() => set({ shared: !s.shared })}
            className={cn(
              "self-start rounded-full border px-3 py-1 text-xs",
              s.shared ? "border-good bg-good/10" : "border-line",
            )}
          >
            {s.shared
              ? "✓ One shared feature definition for training and serving"
              : "Fix: share one feature definition"}
          </button>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px] uppercase">Offline (validation)</p>
              <p className="font-mono text-2xl">{off.accuracy}%</p>
              <p className="text-muted text-[11px]">accuracy · approves {off.approved}%</p>
            </div>
            <motion.div
              key={on.accuracy + on.approved}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className={cn(
                "rounded-lg border px-3 py-2",
                flips > 0 ? "border-bad bg-bad/10" : "border-good bg-good/10",
              )}
            >
              <p className="text-muted text-[10px] uppercase">Live (same applicants)</p>
              <p className="font-mono text-2xl">{on.accuracy}%</p>
              <p className="text-muted text-[11px]">accuracy · approves {on.approved}%</p>
            </motion.div>
          </div>
          <p className="text-xs">
            <span className="font-mono">{flips}</span> of {N} applicants get a different decision
            live than the identical applicant got in testing.
          </p>
          <p className="text-subtle text-[10px]">
            The loan-risk model from module 17 (refuse at 30% risk or more) on 300 made-up
            applicants, computed in your browser.
          </p>
        </div>
      }
    >
      <p>
        The model is identical; only the code that prepares its inputs differs. Training code was
        written by a data scientist in a notebook; the live code was rewritten by another team in
        another language. Toggle the bugs and watch the live answers change, with no error message
        anywhere. Turn on both: the errors partly cancel, so accuracy looks fine while about a third
        of decisions changed.
      </p>
      <p>
        This is <Term id="training-serving-skew">training-serving skew</Term>. Google&apos;s{" "}
        <em>Rules of ML</em> list three causes: the two pipelines differ, the data changed in
        between, or the model&apos;s outputs feed back into its inputs. Its top fix: log the exact
        features used when serving and train on those logs. A{" "}
        <Term id="feature-store">feature store</Term> keeps one definition of each feature for both
        sides.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Four ways to serve -------------------------------------------------------------------------- */

const MODES: { name: string; when: string; eg: string; flow: string[] }[] = [
  {
    name: "Batch",
    when: "Answers can be decided hours ahead.",
    eg: "Overnight churn-risk scores for tomorrow's call list.",
    flow: ["Nightly job", "Model scores every customer", "Table of scores", "App looks up a score"],
  },
  {
    name: "Online",
    when: "The answer depends on this moment's request.",
    eg: "Fraud check while a card payment waits.",
    flow: ["Request", "Fetch fresh features", "Model predicts", "Answer in milliseconds"],
  },
  {
    name: "Streaming",
    when: "Events arrive continuously and need quick reactions.",
    eg: "Flagging odd sensor readings as they stream in.",
    flow: ["Event stream", "Update features", "Model predicts", "Alert or action"],
  },
  {
    name: "On device",
    when: "No network, low latency or privacy matters.",
    eg: "Next-word suggestions on a phone keyboard.",
    flow: ["User types", "Small model on the phone", "Suggestion", "Data never leaves"],
  },
];

export function FourWays() {
  const [s, set] = useSceneState<ServeState>();
  const m = MODES[s.mode];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Four ways to serve"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {MODES.map((x, i) => (
              <button
                key={x.name}
                type="button"
                aria-pressed={s.mode === i}
                onClick={() => set({ mode: i })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.mode === i ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {x.name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {m.flow.map((f, i) => (
              <motion.span
                key={`${s.mode}-${i}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 * i }}
                className="flex items-center gap-1.5"
              >
                <span className="border-line bg-surface rounded-md border px-2 py-1">{f}</span>
                {i < m.flow.length - 1 && <span className="text-muted">→</span>}
              </motion.span>
            ))}
          </div>
          <p className="text-xs">
            <span className="font-semibold">When:</span> {m.when}{" "}
            <span className="text-muted">e.g. {m.eg}</span>
          </p>
          <Code>{`# A minimal online endpoint (FastAPI)
@app.post("/predict")
def predict(applicant: Applicant):
    features = build_features(applicant)   # the SAME code as training
    return {"risk": float(model.predict_proba([features])[0, 1])}`}</Code>
        </div>
      }
    >
      <p>
        Batch is the overnight bake: cheap and simple, but answers can be stale. Online is made to
        order: fresh, but every request has a latency budget that depends on the product. Streaming
        reacts to events; on-device models run where the data is.
      </p>
      <p>
        These categories blur in practice. Managed platforms host all of them: Amazon SageMaker AI,
        Google&apos;s Gemini Enterprise Agent Platform (formerly Vertex AI), Azure Machine Learning
        and Databricks Model Serving, or your own containers on Kubernetes.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Ship a new model safely --------------------------------------------------------------------- */

const STAGES: { name: string; text: string; share: number }[] = [
  {
    name: "Registered",
    text: "Version 8 is logged in the model registry with its data, code and metrics. Version 7 still has the @champion alias.",
    share: 0,
  },
  {
    name: "Shadow",
    text: "Version 8 sees a copy of real traffic and its answers are logged, but never shown to anyone. Compare with version 7.",
    share: 0,
  },
  {
    name: "Canary",
    text: "5% of users get version 8. Watch errors, latency and business numbers; roll back by moving the alias.",
    share: 5,
  },
  {
    name: "Champion",
    text: "Move @champion to version 8. Version 7 stays in the registry for a quick rollback.",
    share: 100,
  },
];

export function ShipSafely() {
  const [s, set] = useSceneState<ServeState>();
  const st = STAGES[s.stage];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Ship a new model safely"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {STAGES.map((x, i) => (
              <button
                key={x.name}
                type="button"
                aria-pressed={s.stage === i}
                onClick={() => set({ stage: i })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.stage === i ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {i + 1}. {x.name}
              </button>
            ))}
          </div>
          <div className="bg-surface-2 flex h-8 overflow-hidden rounded text-[10px]">
            <motion.div
              animate={{ width: `${100 - st.share}%` }}
              className="bg-viz-data/60 flex items-center px-2"
            >
              {st.share < 100 && "v7"}
            </motion.div>
            <motion.div
              animate={{ width: `${st.share}%` }}
              className="bg-accent text-accent-fg flex items-center px-2"
            >
              {st.share > 0 && "v8"}
            </motion.div>
          </div>
          <p className="text-muted text-xs">
            Share of live answers from each version: {st.share}% from version 8
            {s.stage === 1 && " (it runs, but silently)"}.
          </p>
          <p className="text-xs">{st.text}</p>
          <Code>{`client.set_registered_model_alias("loan-risk", "champion", version=8)
model = mlflow.pyfunc.load_model("models:/loan-risk@champion")`}</Code>
          <p className="text-bad text-xs">
            Only load model files you trust: Python&apos;s docs warn that unpickling can run
            arbitrary code.
          </p>
        </div>
      }
    >
      <p>
        A <Term id="model-registry">model registry</Term> catalogues every model version and its
        history. In MLflow, a movable label such as <code>@champion</code> marks the version in
        production; the older Staging/Production “stages” are deprecated.
      </p>
      <p>
        Many models are saved with Python&apos;s pickle, which isn&apos;t secure. Formats like ONNX
        (the model as a graph) or skops (checks types before loading) lower the risk, but files
        should still come from trusted sources.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which way to serve? ------------------------------------------------------------------------- */

export function WhichWay() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which way to serve?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="serve-mode"
            prompt="Which way of serving fits each case best?"
            categories={[
              { id: "batch", label: "Batch" },
              { id: "online", label: "Online" },
              { id: "device", label: "On device" },
            ]}
            items={[
              {
                id: "churn",
                label: "Churn-risk scores for tomorrow's call list",
                category: "batch",
                why: "Hours ahead is fine.",
              },
              {
                id: "fraud",
                label: "Fraud check during a card payment",
                category: "online",
                why: "Depends on this payment, right now.",
              },
              {
                id: "keyboard",
                label: "Next-word suggestions on a phone with no signal",
                category: "device",
                why: "Needs to work offline.",
              },
              {
                id: "forecast",
                label: "Weekly demand forecast for every store",
                category: "batch",
                why: "Decided once a week.",
              },
              {
                id: "search",
                label: "Ranking search results as someone types",
                category: "online",
                why: "Depends on the query.",
              },
            ]}
            explanation="Batch when answers can be decided ahead; online when they depend on the request; on device when the network, latency or privacy demand it."
          />
        </div>
      }
    >
      <p>Sort the cases.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Batch, online, streaming, device", "Pick by freshness and latency."],
  ["Skew fails silently", "Same model, different inputs."],
  ["Log what you serve", "Train on it; share feature definitions."],
  ["Registry and aliases", "@champion, quick rollback."],
  ["Shadow, then canary", "And only load trusted model files."],
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
      <p>Next: noticing when the world changes under a model.</p>
    </StepLayout>
  );
}
