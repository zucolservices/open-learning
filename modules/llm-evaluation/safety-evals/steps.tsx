"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { evaluate, rates } from "./model";
import type { SafetyState } from "./state";

/* 1 ─ Hiring someone to break in ------------------------------------------------------------------ */

export function FireDrill() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Hiring someone to break in"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="font-semibold">Too lax</p>
            <p className="text-muted mt-1">The tester walks in through an unlocked fire door.</p>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="font-semibold">Too strict</p>
            <p className="text-muted mt-1">
              Staff are locked out of their own building every morning.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Banks hire people to try to break in, so they find the weak spots before real burglars do. A
        good test also checks that staff can still get to work: a building nobody can enter
        isn&apos;t safe, it&apos;s broken.
      </p>
      <p>
        <Term id="red-teaming">Red-teaming</Term> does this for AI: deliberately trying to make a
        system produce harmful output. And a safety eval has to measure both sides: harmful requests
        that get through, and harmless ones that get refused.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Red-team a chatbot ⭐ ----------------------------------------------------------------------- */

export function TwoSided() {
  const [s, set] = useSceneState<SafetyState>();
  const rows = evaluate(s.strictness, s.smart);
  const r = rates(rows);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Red-team a chatbot"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className={cn("flex items-center gap-2 text-xs", s.smart && "opacity-40")}>
            <span className="text-muted">filter strictness</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={s.strictness}
              disabled={s.smart}
              onChange={(e) => set({ strictness: Number(e.target.value) })}
              className="accent-accent flex-1"
              aria-label="Filter strictness"
            />
            <span className="w-10 font-mono">{Math.round(s.strictness * 100)}%</span>
          </label>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.smart}
              onChange={(e) => set({ smart: e.target.checked })}
              className="accent-accent"
            />
            Replace the keyword filter with a model trained to judge intent in context
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            {[true, false].map((harm) => (
              <div
                key={String(harm)}
                className="border-line bg-surface rounded-lg border px-2.5 py-2"
              >
                <p className="text-subtle text-[10px]">
                  {harm
                    ? "HARMFUL REQUESTS (DESCRIBED, NOT SHOWN)"
                    : "SAFE REQUESTS THAT SOUND ALARMING"}
                </p>
                <div className="mt-1 flex flex-col gap-0.5">
                  {rows
                    .filter((x) => x.harmful === harm)
                    .map((x) => (
                      <div
                        key={x.text}
                        className={cn(
                          "flex items-center justify-between gap-2 rounded px-1.5 py-0.5 text-[11px]",
                          x.ok ? "" : "bg-bad/15",
                        )}
                      >
                        <span className={cn(harm && "text-muted italic")}>{x.text}</span>
                        <span
                          className={cn("shrink-0 text-[10px]", x.ok ? "text-good" : "text-bad")}
                        >
                          {x.refused ? "refused" : "answered"}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <div
              className={cn(
                "rounded-lg border px-2.5 py-1.5",
                r.unsafe ? "border-bad bg-bad/10" : "border-good bg-good/10",
              )}
            >
              <p className="text-subtle text-[10px]">Harmful requests answered</p>
              <p className="font-mono">
                {r.unsafe} of {r.harmTotal}
              </p>
            </div>
            <div
              className={cn(
                "rounded-lg border px-2.5 py-1.5",
                r.overRefused ? "border-bad bg-bad/10" : "border-good bg-good/10",
              )}
            >
              <p className="text-subtle text-[10px]">Safe requests refused</p>
              <p className="font-mono">
                {r.overRefused} of {r.safeTotal}
              </p>
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            Illustrative. Harmful requests appear only as descriptions in brackets.
          </p>
        </div>
      }
    >
      <p>
        A chatbot is guarded by a filter that reacts to alarming words. Turn the strictness up until
        no harmful request gets through, and watch what happens to harmless questions like killing a
        Python process. Then try a model that judges intent instead.
      </p>
      <p>
        That&apos;s why safety evals pair attack sets with{" "}
        <Term id="over-refusal">over-refusal</Term> sets. XSTest, for example, has 250 safe prompts
        that sound unsafe, alongside 200 unsafe contrasts. Even the better model misses one
        disguised request: red teams keep finding new framings.
      </p>
    </StepLayout>
  );
}

/* 3 ─ How red-teaming works ----------------------------------------------------------------------- */

export function RedTeams() {
  const items: [string, string][] = [
    [
      "People",
      "In 2022 Anthropic published nearly 39,000 attacks written by human red-teamers, and found models trained with human feedback got harder to break as they grew.",
    ],
    [
      "Automation",
      "Open-source tools such as Microsoft's PyRIT generate and send attacks at scale and score the replies.",
    ],
    [
      "Shared benchmarks",
      "HarmBench (510 harmful behaviours) and JailbreakBench (100) let different attacks and defences be compared.",
    ],
    [
      "Honest grading",
      "StrongREJECT (2024) found many reported “successful” jailbreaks produced little useful harmful content: how you grade decides the success rate.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="How red-teaming works"
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
        NIST describes red-teaming as a structured exercise to find flaws and vulnerabilities. In
        practice it combines creative people, automated attack tools and shared benchmarks.
      </p>
      <p>
        A <Term id="jailbreak">jailbreak</Term> is an input that tricks a model past its safety
        training. When you read a jailbreak success rate, ask who graded it and how.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Who tests the biggest models? --------------------------------------------------------------- */

export function WhoTests() {
  const items: [string, string][] = [
    [
      "Government institutes",
      "The UK AI Security Institute (renamed from AI Safety Institute in Feb 2025) tests frontier models and builds the open-source Inspect framework. In Aug 2024 the US government's AI safety institute agreed with OpenAI and Anthropic to test major models before and after release.",
    ],
    [
      "Lab frameworks",
      "OpenAI's Preparedness Framework (v2, Apr 2025) tracks biological and chemical, cyber and AI self-improvement risks against “High” and “Critical” thresholds. Anthropic's Responsible Scaling Policy (first Sept 2023, rewritten in Feb 2026) sets similar commitments.",
    ],
    [
      "For your product",
      "You won't test for bioweapons. You will test your own risks: leaking customer data, harmful advice in your domain, prompt injection, and over-refusal of normal requests.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Who tests the biggest models?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {items.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
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
        For the most capable models, safety evaluation is done by the labs themselves and
        increasingly by government institutes, against published thresholds for what would be too
        dangerous to release.
      </p>
      <p>
        For your application, the same idea scales down: list the harms that matter in your setting,
        build attack and over-refusal cases for each, and run them on every change.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Help or decline? ---------------------------------------------------------------------------- */

export function HelpOrDecline() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Help or decline?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="help-or-decline"
            prompt="What should a well-behaved assistant do with each?"
            categories={[
              { id: "help", label: "Help" },
              { id: "decline", label: "Decline" },
            ]}
            items={[
              {
                id: "python",
                label: "“How can I kill a Python process?”",
                category: "help",
                why: "A normal programming question.",
              },
              {
                id: "phish",
                label: "[write a phishing email posing as a bank]",
                category: "decline",
                why: "Enables fraud.",
              },
              {
                id: "mix",
                label: "“Which household chemicals should never be mixed?”",
                category: "help",
                why: "Safety information.",
              },
              {
                id: "track",
                label: "[track someone's phone without their knowledge]",
                category: "decline",
                why: "Enables stalking.",
              },
              {
                id: "history",
                label: "“Why was the Battle of the Somme so deadly?”",
                category: "help",
                why: "History.",
              },
            ]}
            explanation="Judge intent and likely use, not alarming words. Refusing safe requests is a failure too."
          />
        </div>
      }
    >
      <p>Sort the requests.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Attack your own system", "Before others do."],
  ["Measure both sides", "Harm let through and safe requests refused."],
  ["People plus automation", "Red teams, tools and shared benchmarks."],
  ["Grading decides the number", "Ask how a success rate was judged."],
  ["Test your own risks", "Data leaks, domain harms, injection."],
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
      <p>Next: checking whether a system treats different people fairly.</p>
    </StepLayout>
  );
}
