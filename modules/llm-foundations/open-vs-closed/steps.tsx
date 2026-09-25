"use client";

import { AnimatePresence, motion } from "motion/react";
import { BookOpen, Check, ChefHat, Minus, ScrollText, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FAMILIES, OPTIONS, REQUIREMENTS, ROWS, type Mark } from "./data";
import type { OpenState } from "./state";

function MarkIcon({ m }: { m: Mark }) {
  return m === "yes" ? (
    <Check className="text-good size-4 shrink-0" aria-label="yes" />
  ) : m === "no" ? (
    <X className="text-bad size-4 shrink-0" aria-label="no" />
  ) : (
    <Minus className="text-viz-compute size-4 shrink-0" aria-label="partly" />
  );
}

/* 1 ─ Restaurant, recipe, cookbook ------------------------------------------------------------------- */

const FRAMES = [
  {
    title: "A restaurant dish",
    Icon: ChefHat,
    text: "A closed model is like a restaurant: you order, you get the dish, and you never see the recipe. The kitchen can change the recipe, raise prices or close. That's the model maker's API.",
  },
  {
    title: "A published recipe",
    Icon: ScrollText,
    text: "An open-weight model publishes the finished recipe: the weights. You can cook it in your own kitchen, adjust it and serve it, within the licence. But how the recipe was developed, and from which ingredients, stays secret.",
  },
  {
    title: "The whole cookbook",
    Icon: BookOpen,
    text: "A fully open model also publishes where every ingredient came from and the kitchen notes: training data and code. Anyone can study it, check it or rebuild it. Only a few models go this far.",
  },
];

export function Kitchens() {
  const [s, set] = useSceneState<OpenState>();
  const f = Math.min(s.frame, FRAMES.length - 1);
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Restaurant, recipe or cookbook?"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid grid-cols-3 gap-2">
            {FRAMES.map((fr, i) => (
              <motion.div
                key={fr.title}
                animate={{ opacity: i <= f ? 1 : 0.3, y: i === f ? -4 : 0 }}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border p-3 text-center",
                  i === f ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <fr.Icon className={cn("size-8", i === f ? "text-accent" : "text-muted")} />
                <p className="text-xs font-semibold">{fr.title}</p>
                <div className="grid w-full gap-1 text-[10px]">
                  {[
                    ["Use it", true],
                    ["Run it yourself", i >= 1],
                    ["See how it was made", i >= 2],
                  ].map(([l, ok]) => (
                    <span key={l as string} className="flex items-center justify-center gap-1">
                      {ok ? (
                        <Check className="text-good size-3" />
                      ) : (
                        <X className="text-bad size-3" />
                      )}
                      {l as string}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          <Stepper step={f} count={FRAMES.length} onChange={(n) => set({ frame: n })} />
          <FrameCaption frameKey={f} title={FRAMES[f].title}>
            {FRAMES[f].text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        &ldquo;Open&rdquo; gets used loosely for AI models. Think about food: a dish, a recipe, or
        the whole cookbook.
      </p>
      <p>
        Most &ldquo;open&rdquo; models are <Term id="open-weights">open weights</Term>: the recipe,
        not the cookbook.
      </p>
    </StepLayout>
  );
}

/* 2 ─ What you actually get ⭐ ---------------------------------------------------------------------- */

export function WhatYouGet() {
  const [s, set] = useSceneState<OpenState>();
  const fam = FAMILIES.find((x) => x.id === s.family)!;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Read the licence"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {FAMILIES.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => set({ family: x.id })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs",
                  x.id === s.family
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {x.name}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={fam.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-line bg-surface rounded-xl border p-3"
            >
              <p className="text-sm font-semibold">{fam.name}</p>
              <p className="text-muted text-xs">
                {fam.examples} · <span className="font-mono">{fam.licence}</span>
              </p>
              <div className="mt-3 grid gap-2">
                {ROWS.map(([k, label]) => {
                  const [m, why] = fam.rows[k];
                  return (
                    <div key={k} className="flex items-start gap-2 text-xs">
                      <MarkIcon m={m} />
                      <span>
                        <span className="font-semibold">{label}.</span>{" "}
                        <span className="text-muted">{why}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="border-line bg-surface rounded-xl border px-3 py-2 text-xs">
            <p className="font-semibold">The official definition</p>
            <p className="text-muted mt-0.5">
              The Open Source Initiative&apos;s Open Source AI Definition (Oct 2024) asks for the
              weights, the complete training and inference code, and enough information about the
              training data for a skilled person to build an equivalent system. By that bar, most
              &ldquo;open&rdquo; models are open weights, not open source.
            </p>
          </div>
          <p className="text-subtle text-[10px]">
            Summaries of the licences and model cards as of Sep 2026. Licences change between
            versions, so always read the one for the exact model you use.
          </p>
        </div>
      }
    >
      <p>
        What you can do with a model is set by its <Term id="model-licence">licence</Term>, not by
        the word &ldquo;open&rdquo;.
      </p>
      <p>Compare four kinds of model.</p>
      <p className="text-muted text-sm">
        Worth knowing: permissively licensed open-weight models now come from all over the industry,
        including OpenAI (gpt-oss), Google (Gemma 4), Mistral and DeepSeek.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Where can it run? ⭐ (requirement matcher) -------------------------------------------------- */

export function WhereItRuns() {
  const [s, set] = useSceneState<OpenState>();
  const on = REQUIREMENTS.filter((r) => s.reqs.includes(r.id));
  const verdict = (opt: string): Mark =>
    on.some((r) => r.marks[opt][0] === "no")
      ? "no"
      : on.some((r) => r.marks[opt][0] === "partly")
        ? "partly"
        : "yes";
  return (
    <StepLayout
      eyebrow="Match"
      title="Where can it run?"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div>
            <p className="text-muted mb-1 text-[11px]">Your requirements</p>
            <div className="flex flex-wrap gap-1.5">
              {REQUIREMENTS.map((r) => {
                const active = s.reqs.includes(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      set({ reqs: active ? s.reqs.filter((x) => x !== r.id) : [...s.reqs, r.id] })
                    }
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs",
                      active
                        ? "border-accent bg-accent text-accent-fg"
                        : "border-line hover:bg-surface-2",
                    )}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>
          {on.length > 0 && OPTIONS.every((o) => verdict(o.id) === "no") && (
            <p className="border-bad/40 bg-bad/5 rounded-xl border px-3 py-2 text-xs">
              Nothing meets every requirement. Something has to give: for example, open weights on
              your own servers run by a managed-services partner, accepting slightly lower quality.
            </p>
          )}
          <div className="grid gap-2 sm:grid-cols-2">
            {OPTIONS.map((o) => {
              const v = verdict(o.id);
              return (
                <motion.div
                  key={o.id}
                  layout
                  className={cn(
                    "rounded-xl border p-3",
                    v === "yes"
                      ? "border-good/50 bg-good/10"
                      : v === "no"
                        ? "border-bad/30 bg-bad/5 opacity-70"
                        : "border-line bg-surface",
                  )}
                >
                  <p className="flex items-center gap-1.5 text-sm font-semibold">
                    <MarkIcon m={v} /> {o.name}
                  </p>
                  <p className="text-muted text-[11px]">{o.detail}</p>
                  <div className="mt-2 grid gap-1">
                    {on.map((r) => (
                      <p key={r.id} className="flex items-start gap-1.5 text-[11px]">
                        <MarkIcon m={r.marks[o.id][0]} />
                        <span className="text-muted">{r.marks[o.id][1]}</span>
                      </p>
                    ))}
                    {!on.length && <p className="text-subtle text-[11px]">Pick a requirement.</p>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      }
    >
      <p>
        The same model can often be reached several ways. Closed models run at their maker or on
        cloud platforms; open-weight models can also run on your own hardware.
      </p>
      <p>
        Switch requirements on and see which hosting options survive. Real projects usually have
        three or four at once.
      </p>
      <p className="text-muted text-sm">
        Cloud names change often: Google&apos;s Vertex AI became the Gemini Enterprise Agent
        Platform in April 2026, and Azure AI Foundry became Microsoft Foundry in November 2025.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Benchmarks and their limits -------------------------------------------------------------------- */

export function Benchmarks() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Leaderboards and their limits"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              [
                "Human-vote arenas",
                "Arena (formerly LMArena) shows people two anonymous answers and asks which is better; a Bradley–Terry model turns millions of votes into a ranking. Good for general chat preference.",
              ],
              [
                "Fixed test sets",
                "Maths, coding and knowledge exams. Easy to compare, but models can end up trained on the questions, and top models soon score near 100%.",
              ],
              [
                "The open–closed gap",
                "Epoch AI (May 2026) estimates the best open-weight models trail the best closed ones by about four months.",
              ],
            ].map(([t, d]) => (
              <div key={t} className="border-line bg-surface rounded-xl border px-3 py-2">
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted text-xs">{d}</p>
              </div>
            ))}
          </div>
          <ChoiceCheckpoint
            id="leaderboard"
            prompt="Two models are within a few points of each other on public leaderboards. You're building a support assistant for Hindi and Kannada speakers. What should decide between them?"
            options={[
              {
                id: "eval",
                label:
                  "Run both on a set of your own real questions, in those languages, and compare",
                correct: true,
                feedback:
                  "Yes. Leaderboards mostly test English and general tasks. Your own eval (from the prompting module) measures what you actually need, including token costs in Indian languages.",
              },
              {
                id: "arena",
                label: "Pick whichever is higher on the human-vote arena",
                feedback:
                  "A few points there is within noise, and the voters aren't asking your questions in your languages.",
              },
              {
                id: "bigger",
                label: "Pick the bigger model",
                feedback:
                  "Size is a weak guide: newer, smaller models often beat older, bigger ones, and bigger costs more.",
              },
            ]}
            explanation="Benchmarks narrow the shortlist; your own eval makes the decision."
          />
        </div>
      }
    >
      <p>
        Leaderboards help you shortlist models. They can&apos;t tell you which one works best for
        your task, your languages and your budget.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint: hosting ------------------------------------------------------------------------ */

export function PickHosting() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Pick the hosting"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="hosting"
            prompt="Where would you run the model for each project?"
            categories={[
              { id: "api", label: "Model maker's API" },
              { id: "cloud", label: "Cloud AI platform" },
              { id: "gpus", label: "Own GPUs, open weights" },
              { id: "device", label: "On the device" },
            ]}
            items={[
              {
                id: "prototype",
                label: "A startup prototyping a writing assistant this week",
                category: "api",
                why: "Fastest start, best models, nothing to operate. Revisit when volume grows.",
              },
              {
                id: "bank",
                label:
                  "A bank already on AWS that needs a frontier model inside its cloud account and region",
                category: "cloud",
                why: "Cloud platforms like Bedrock keep traffic within your existing account, network controls and billing.",
              },
              {
                id: "defence",
                label: "A defence lab's assistant on a network with no internet connection",
                category: "gpus",
                why: "Only open weights on your own servers can run in a closed network.",
              },
              {
                id: "field",
                label: "An app for health workers in villages with patchy mobile data",
                category: "device",
                why: "A small model on the phone keeps working offline, and data stays on the device.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Four projects, four sets of requirements.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ------------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "Open weights ≠ open source",
    "Most “open” models share the weights, not the data or training code.",
  ],
  [
    "The licence decides",
    "Commercial limits, attribution and use policies differ by model and version.",
  ],
  [
    "Requirements pick the hosting",
    "Quality, data location, control, ops effort and volume point to different options.",
  ],
  ["Test on your own tasks", "Leaderboards shortlist; your eval decides."],
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
      <p>Language is only one kind of input.</p>
      <p>Next: multimodal models that see, read documents and hear.</p>
    </StepLayout>
  );
}
