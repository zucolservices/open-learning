"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FIXES, trace, type Fix } from "./model";
import type { OpsState } from "./state";

/* 1 ─ The taxi meter ------------------------------------------------------------------------------ */

export function Taxi() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The taxi meter"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">The fare</p>
            <p className="font-mono text-2xl font-semibold">₹640</p>
            <p className="text-muted mt-1">Expensive. But why?</p>
          </div>
          <div className="border-accent bg-accent-soft rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">The route log</p>
            <p className="text-muted mt-1">
              Twenty minutes in traffic on the ring road, a wrong turn, a loop back. Now you know
              what to change.
            </p>
          </div>
        </div>
      }
    >
      <p>
        A taxi fare tells you a trip was expensive; only the route tells you why: traffic, a wrong
        turn, a detour. Fix those and the next trip is cheaper and faster.
      </p>
      <p>
        Agents make many model calls per task, so cost and delay add up. A{" "}
        <Term id="llm-trace">trace</Term> is the agent&apos;s route log: every model call and tool
        call, with its time, tokens and cost.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Trace and trim a run ⭐ --------------------------------------------------------------------- */

export function TrimTrace() {
  const [s, set] = useSceneState<OpsState>();
  const fixes = s.fixes ?? [];
  const toggle = (f: Fix) =>
    set({ fixes: fixes.includes(f) ? fixes.filter((x) => x !== f) : [...fixes, f] });
  const base = trace([]);
  const t = trace(fixes);
  const scale = base.ms;
  const starts = t.spans.map((_, i) => t.spans.slice(0, i).reduce((a, x) => a + x.ms, 0));
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Trace and trim a run"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface flex flex-col gap-1 rounded-xl border p-3">
            <p className="text-muted text-[10px]">TRACE: ONE REFUND REQUEST</p>
            {t.spans.map((sp, i) => {
              const left = (starts[i] / scale) * 100;
              return (
                <div
                  key={sp.id}
                  className="grid grid-cols-[minmax(0,12rem)_1fr] items-center gap-2 text-[10px]"
                >
                  <span className="truncate font-mono">{sp.label}</span>
                  <span className="bg-surface-2 relative h-3 rounded">
                    <motion.span
                      layout
                      className={cn(
                        "absolute top-0 h-full rounded",
                        sp.kind === "model" ? "bg-accent" : "bg-viz-compute",
                      )}
                      style={{ left: `${left}%`, width: `${(sp.ms / scale) * 100}%` }}
                    />
                  </span>
                </div>
              );
            })}
            <div className="text-muted flex gap-3 pt-1 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="bg-accent size-2 rounded-sm" /> model call
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-viz-compute size-2 rounded-sm" /> tool call
              </span>
            </div>
          </div>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {FIXES.map((f) => (
              <label key={f.id} className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={fixes.includes(f.id)}
                  onChange={() => toggle(f.id)}
                  className="accent-accent"
                />
                {f.label}
              </label>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="font-mono text-lg font-semibold">{(t.ms / 1000).toFixed(1)} s</p>
              <p className="text-muted">was {(base.ms / 1000).toFixed(1)} s</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="font-mono text-lg font-semibold">₹{t.cost.toFixed(2)}</p>
              <p className="text-muted">was ₹{base.cost.toFixed(2)}</p>
            </div>
            <div
              className={cn(
                "rounded-lg border px-3 py-2",
                t.quality < 90 ? "border-bad bg-bad/10" : "border-good bg-good/10",
              )}
            >
              <p className="font-mono text-lg font-semibold">{t.quality}%</p>
              <p className="text-muted">evals passing</p>
            </div>
          </div>
          <p className="text-subtle text-[10px]">Illustrative timings and costs per request.</p>
        </div>
      }
    >
      <p>
        This trace shows one refund request. Read it like a route log: where does the time go, and
        which calls cost the most? Then apply fixes and watch time, cost and the evaluation score.
      </p>
      <p>
        Most fixes are free wins. One is a trap: a small model is fine for routine steps, but the
        refund decision needs judgement, and the evals catch the drop. Always re-run your evals
        after a cost cut.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Anatomy of a trace -------------------------------------------------------------------------- */

export function Anatomy() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Anatomy of a trace"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`span: invoke_agent "support"              4.9 s
  span: chat (gen_ai.request.model = "small-model")
        gen_ai.usage.input_tokens  = 6120
        gen_ai.usage.output_tokens = 42
  span: execute_tool "orders_search"     0.9 s
  span: chat (gen_ai.request.model = "large-model")
        gen_ai.usage.input_tokens  = 9310
  span: execute_tool "refunds_request"   0.7 s`}</Code>
          <p className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <span className="font-semibold">Tools that read traces: </span>
            <span className="text-muted">
              OpenAI Agents SDK (on by default), LangSmith, Langfuse (open source; owned by
              ClickHouse since January 2026), Arize Phoenix, Braintrust, W&amp;B Weave, Datadog, and
              most observability platforms that accept OpenTelemetry.
            </span>
          </p>
        </div>
      }
    >
      <p>
        A trace is made of spans: one per model call, tool call or handoff, each with its timing,
        tokens and cost. OpenTelemetry, the open standard for traces, has a shared vocabulary for AI
        spans (names starting with <span className="font-mono">gen_ai.</span>), still marked as in
        development.
      </p>
      <p>
        Traces are how you debug agents too: when a run goes wrong, the trace shows exactly which
        step went astray. The Observability track covers tracing in general.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Levers for cost and speed ------------------------------------------------------------------- */

export function Levers() {
  const items: [string, string][] = [
    [
      "Prompt caching",
      "Reusing an unchanged prompt start (system prompt, tools, history) is much cheaper and faster: Anthropic charges about a tenth of the normal price for cache reads on most models. Put stable parts first.",
    ],
    [
      "Smaller models for easy steps",
      "Classifying, looking up and formatting rarely need the largest model. Start with the best model, then swap down while evals still pass.",
    ],
    [
      "Fewer tokens",
      "Trim history, return compact tool results, summarise long context (module 11).",
    ],
    [
      "Batch APIs",
      "Half price if you can wait up to 24 hours: good for offline evaluations, never for live chats.",
    ],
    ["Fewer turns", "Clear tools and good error messages stop wasted loops (modules 4 and 9)."],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Levers for cost and speed"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {items.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
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
        Agents are token-hungry: Anthropic measured about four times the tokens of a chat for a
        single agent, and found that on one research benchmark token usage alone explained 80% of
        the differences in score. More tokens can buy quality, but you should know what you&apos;re
        paying for.
      </p>
      <p>
        Prices and discounts vary by provider and model and change often, so check current pricing
        pages rather than memorising numbers.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which lever? -------------------------------------------------------------------------------- */

export function WhichLever() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which lever?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="cost-lever"
            prompt="Which lever fits each situation best?"
            categories={[
              { id: "batch", label: "Batch API" },
              { id: "cache", label: "Prompt caching" },
              { id: "small", label: "Smaller model" },
            ]}
            items={[
              {
                id: "nightly",
                label: "A nightly evaluation run over 2,000 test cases",
                category: "batch",
                why: "Nobody's waiting; take the discount.",
              },
              {
                id: "system",
                label: "The same 6,000-token system prompt on every turn",
                category: "cache",
                why: "An unchanged prefix, reused.",
              },
              {
                id: "classify",
                label: "Sorting messages into five categories",
                category: "small",
                why: "An easy task.",
              },
              {
                id: "tools",
                label: "A long tool list sent with every call",
                category: "cache",
                why: "Stable, so cacheable.",
              },
              {
                id: "digest",
                label: "Summarising yesterday's tickets for a morning report",
                category: "batch",
                why: "Can wait hours.",
              },
            ]}
            explanation="Batch work that can wait, cache what repeats unchanged, and give easy steps to smaller models, checking with evals as you go."
          />
        </div>
      }
    >
      <p>Sort the situations.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Trace every run", "Each model and tool call, with time and cost."],
  ["Find the hotspots", "Big contexts, repeats, slow tools."],
  ["Cache, trim, route", "Free wins on cost and speed."],
  ["Batch what can wait", "Half price, not for live users."],
  ["Re-run evals", "A cheaper agent must still be right."],
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
      <p>Next: the capstone. Design a support agent, watch it fail, and fix it.</p>
    </StepLayout>
  );
}
