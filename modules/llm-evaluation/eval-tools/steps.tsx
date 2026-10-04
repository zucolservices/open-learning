"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CATS, CHANGES, NEEDS, TOOLS } from "./model";
import type { ToolsMapState } from "./state";

/* 1 ─ The right tool for the job ------------------------------------------------------------------ */

export function Toolbox() {
  const tools: [string, string][] = [
    ["Spirit level", "Checks one thing precisely"],
    ["Tape measure", "Measures anything you point it at"],
    ["Building inspector", "Checks the whole house, on site"],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="The right tool for the job"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {tools.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}: </span>
              <span className="text-muted">{d}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Builders own many measuring tools because each answers a different question. Evaluation
        tools are the same: some score models on public tests, some test your own app, some watch
        live traffic.
      </p>
      <p>
        This module maps the landscape as of October 2026. Names are examples, not recommendations,
        and the landscape changes fast.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The eval tool map ⭐ ------------------------------------------------------------------------ */

export function ToolMap() {
  const [s, set] = useSceneState<ToolsMapState>();
  const need = NEEDS.find((n) => n.id === s.need) ?? NEEDS[0];
  return (
    <StepLayout
      eyebrow="Animated infographic"
      title="The eval tool map"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {NEEDS.map((n) => (
              <button
                key={n.id}
                type="button"
                aria-pressed={s.need === n.id}
                onClick={() => set({ need: n.id })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px]",
                  s.need === n.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {n.label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.osiOnly}
              onChange={(e) => set({ osiOnly: e.target.checked })}
              className="accent-accent"
            />
            Only tools under an open-source licence
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            {CATS.map((c) => (
              <motion.div
                key={c.id}
                animate={{ opacity: c.id === need.cat ? 1 : 0.4 }}
                className={cn(
                  "rounded-lg border px-3 py-2",
                  c.id === need.cat ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <p className="text-xs font-semibold">{c.name}</p>
                <p className="text-muted text-[10px]">{c.job}</p>
                <div className="mt-1.5 flex flex-col gap-0.5">
                  {TOOLS.filter((t) => t.cat === c.id).map((t) => (
                    <div
                      key={t.name}
                      className={cn(
                        "text-[11px]",
                        s.osiOnly && !t.osi && "line-through opacity-40",
                      )}
                    >
                      <span>{t.name}</span>{" "}
                      <span className="text-subtle text-[10px]">· {t.licence}</span>
                      {t.note && c.id === need.cat && (
                        <span className="text-muted block text-[10px]">{t.note}</span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Status as of October 2026. Examples, not endorsements.
          </p>
        </div>
      }
    >
      <p>
        Pick what you need to do and the map highlights the kind of tool for it. Most teams combine
        two: an <Term id="eval-framework">eval framework</Term> for tests in CI, and a tracing
        platform for production.
      </p>
      <p>
        Check licences. Most frameworks are open source; some popular platforms are{" "}
        <Term id="source-available">source-available</Term> or commercial, which matters if you need
        to self-host or modify them.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The ground keeps moving --------------------------------------------------------------------- */

export function Moving() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The ground keeps moving"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {CHANGES.map(([d, t], i) => (
            <motion.div
              key={d + t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface grid grid-cols-[4.5rem_1fr] gap-2 rounded-lg border px-3 py-1.5 text-xs"
            >
              <span className="text-accent font-mono">{d}</span>
              <span className="text-muted">{t}</span>
            </motion.div>
          ))}
          <p className="text-muted mt-1 text-[11px]">
            Cloud renames too: Vertex AI is now Gemini Enterprise Agent Platform; Azure AI Foundry
            is Microsoft Foundry.
          </p>
        </div>
      }
    >
      <p>
        In about eighteen months, several evaluation tools were bought, one shut down, a major
        benchmark went into maintenance, and a hosted evals product announced its end.
      </p>
      <p>
        If your test cases and results live only inside a tool, a change like this can cost you
        months. The next step is about avoiding that.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Choosing, and staying portable -------------------------------------------------------------- */

export function Choosing() {
  const qs: [string, string][] = [
    [
      "Where does the data go?",
      "Self-hosted or vendor cloud; data residency; who can read traces.",
    ],
    ["What's the licence?", "Open source, source-available or commercial."],
    [
      "Does it fit your workflow?",
      "CI integration, the languages you use, judges with any model provider.",
    ],
    ["Can you leave?", "Export datasets and results in plain formats."],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Choosing, and staying portable"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {qs.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-0.5">{d}</p>
            </motion.div>
          ))}
          <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
            Your eval set, rubrics and judge prompts are the real asset. Keep them in your own
            repository, in plain files.
          </div>
        </div>
      }
    >
      <p>
        Tools come and go; good test cases last for years. Choose tools that let you take your
        cases, rubrics and results with you.
      </p>
      <p>
        That way, swapping a framework or platform is an afternoon&apos;s work rather than a
        rebuild.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which kind of tool? ------------------------------------------------------------------------- */

export function WhichKind() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which kind of tool?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-tool"
            prompt="Which kind of tool is each?"
            categories={[
              { id: "bench", label: "Benchmark runner" },
              { id: "app", label: "App framework" },
              { id: "platform", label: "Tracing platform" },
              { id: "cloud", label: "Cloud service" },
            ]}
            items={[
              {
                id: "harness",
                label: "lm-evaluation-harness",
                category: "bench",
                why: "Runs standard benchmarks.",
              },
              {
                id: "promptfoo",
                label: "promptfoo",
                category: "app",
                why: "Tests prompts, often in CI.",
              },
              {
                id: "langfuse",
                label: "Langfuse",
                category: "platform",
                why: "Traces and online evals.",
              },
              {
                id: "bedrock",
                label: "Amazon Bedrock evaluations",
                category: "cloud",
                why: "Inside AWS.",
              },
              { id: "ragas", label: "Ragas", category: "app", why: "Evaluates RAG apps." },
              {
                id: "phoenix",
                label: "Arize Phoenix",
                category: "platform",
                why: "Tracing and evals.",
              },
            ]}
            explanation="Benchmark runners score models; app frameworks test your system; platforms watch production; cloud services keep it all in your cloud."
          />
        </div>
      }
    >
      <p>Sort the tools.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Four kinds of tool", "Benchmarks, app frameworks, platforms, cloud."],
  ["Usually combine two", "Tests in CI plus production tracing."],
  ["Check the licence", "Open source isn't universal."],
  ["Expect change", "Acquisitions, shutdowns, renames."],
  ["Own your eval set", "Plain files in your repository."],
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
      <p>Next: the capstone, where you decide whether a change should ship.</p>
    </StepLayout>
  );
}
