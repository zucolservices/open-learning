"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BUGS, FACTS, KINDS, type Kind } from "./model";
import type { TestState } from "./state";

/* 1 ─ Different inspectors ------------------------------------------------------------------------ */

export function Inspections() {
  const rows = [
    ["📐", "Read the blueprints", "SAST: check the plans"],
    ["🧱", "Inspect each delivered part", "SCA: check the materials"],
    ["🚪", "Try the doors and windows", "DAST: attack the finished building"],
    ["🕵️", "A burglar tries to break in", "Pen test: a person probes for gaps"],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="Different inspectors"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {rows.map(([e, t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface grid grid-cols-[2rem_1fr] items-center gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-xl">{e}</span>
              <span>
                <span className="font-semibold">{t}.</span> <span className="text-muted">{d}</span>
              </span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A new building is checked many ways: an engineer reads the blueprints, an inspector checks
        the delivered materials, someone tries every door once it&apos;s built, and a test burglar
        looks for what everyone missed. Each catches problems the others can&apos;t.
      </p>
      <p>
        Security testing is the same. No single tool finds every bug, so teams combine several and
        build them into the pipeline, a practice often called <Term id="devsecops">DevSecOps</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Build a testing pipeline ⭐ ----------------------------------------------------------------- */

export function Pipeline() {
  const [s, set] = useSceneState<TestState>();
  const on = s.on ?? [];
  const toggle = (k: Kind) => set({ on: on.includes(k) ? on.filter((x) => x !== k) : [...on, k] });
  const caught = BUGS.filter((b) => b.caughtBy.some((k) => on.includes(k))).length;
  return (
    <StepLayout
      eyebrow="Animated infographic"
      title="Build a testing pipeline"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-1 text-[10px]">
            {["commit", "pull request", "build", "test deploy", "production"].map((stage, i) => (
              <span key={stage} className="flex items-center gap-1">
                <span className="border-line bg-surface rounded px-2 py-1">{stage}</span>
                {i < 4 && <span className="text-muted">→</span>}
              </span>
            ))}
          </div>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {KINDS.map((k) => (
              <label
                key={k.id}
                className={cn(
                  "flex cursor-pointer gap-2 rounded-lg border px-3 py-1.5 text-xs",
                  on.includes(k.id) ? "border-good bg-good/10" : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={on.includes(k.id)}
                  onChange={() => toggle(k.id)}
                  className="accent-accent mt-0.5"
                  aria-label={k.name}
                />
                <span>
                  <span className="font-semibold">{k.name}</span>
                  <span className="text-muted block">{k.what}</span>
                  <span className="text-subtle block">{k.when}</span>
                </span>
              </label>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            {BUGS.map((b) => {
              const ok = b.caughtBy.some((k) => on.includes(k));
              return (
                <div
                  key={b.id}
                  className={cn(
                    "grid grid-cols-[1.5rem_1fr] rounded px-2 py-1 text-[11px]",
                    ok ? "text-good" : "text-subtle",
                  )}
                >
                  <span>{ok ? "✓" : "·"}</span>
                  <span>
                    {b.label}
                    {ok && (
                      <span className="text-muted">
                        {" "}
                        — caught by{" "}
                        {b.caughtBy
                          .filter((k) => on.includes(k))
                          .map((k) => KINDS.find((x) => x.id === k)?.name)
                          .join(" / ")}
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
          <p
            className={cn(
              "text-sm font-semibold",
              caught === BUGS.length ? "text-good" : "text-muted",
            )}
          >
            {caught} of {BUGS.length} bugs would be caught.
          </p>
        </div>
      }
    >
      <p>
        Switch on test types and watch which planted bugs they&apos;d catch.{" "}
        <Term id="sast">SAST</Term> reads the code, <Term id="dast">DAST</Term> attacks the running
        app, SCA checks dependencies, secret scanning hunts keys, and people find the rest.
      </p>
      <p>
        Notice the gaps. Only people catch the “approve your own refund” logic flaw, because nothing
        in the code looks wrong. And fast checks belong early, on every commit and pull request;
        slower ones run nightly.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Why layer them ------------------------------------------------------------------------------ */

export function LayersFacts() {
  const [s, set] = useSceneState<TestState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Why layer them"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {FACTS.map(([t, d], i) => (
            <button
              key={t}
              type="button"
              aria-pressed={s.fact === i}
              onClick={() => set({ fact: i })}
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-xs",
                s.fact === i ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <span className="font-semibold">{t}</span>
              {s.fact === i && <span className="text-muted mt-0.5 block">{d}</span>}
            </button>
          ))}
        </div>
      }
    >
      <p>
        Each tool has blind spots. Static analysis is quick and catches many coding bugs, but it
        also raises false alarms and can&apos;t see configuration or logic problems. Dynamic testing
        finds runtime and config issues, but only on paths it exercises.
      </p>
      <p>
        The free and open-source toolbox is rich: ZAP for dynamic testing, Semgrep or Opengrep and
        SonarQube for static, Trivy for dependencies and containers, gitleaks for secrets. Clouds
        and vendors add commercial options. Pick a few and run them automatically.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Where people still win ---------------------------------------------------------------------- */

export function PeopleTests() {
  const items: [string, string][] = [
    [
      "Penetration test",
      "Skilled testers probe an app within an agreed scope and time, and write up what they find. Best for logic flaws tools can't see.",
    ],
    [
      "Red team",
      "Acts like a real adversary chasing a goal, and also tests whether your monitoring and response notice.",
    ],
    [
      "Bug bounty",
      "Pays outside researchers for valid reports, continuously. HackerOne programmes paid about $81 million in the year to mid-2025.",
    ],
    [
      "Coordinated disclosure",
      "A clear way for anyone to report a flaw safely (a security.txt file, a contact), even without a reward. India's CERT-In runs such a programme.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where people still win"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {items.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Tools are tireless but literal. A human notices that a feature, though perfectly coded, lets
        anyone do something they shouldn&apos;t. Standards help you aim: OWASP&apos;s ASVS gives
        three levels of requirements to verify against, from a starting point to high assurance.
      </p>
      <p>
        One more habit for the age of AI assistants: treat generated code like any other. Studies
        from 2022 to 2026 found roughly 40 to 45% of AI-written code failed security checks, so
        review and scan it the same way.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which test catches it? ---------------------------------------------------------------------- */

export function CatchIt() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which test catches it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-test"
            prompt="Which kind of test would first catch each problem?"
            categories={[
              { id: "code", label: "SAST (reads code)" },
              { id: "dep", label: "SCA / secret scan" },
              { id: "run", label: "DAST or people" },
            ]}
            items={[
              {
                id: "concat",
                label: "A database query built from strings",
                category: "code",
                why: "Visible in the source.",
              },
              {
                id: "oldlib",
                label: "A dependency with a known CVE",
                category: "dep",
                why: "SCA matches versions to databases.",
              },
              {
                id: "key",
                label: "An AWS key committed to the repo",
                category: "dep",
                why: "Secret scanning.",
              },
              {
                id: "header",
                label: "A missing security header in production",
                category: "run",
                why: "Only visible on the running site.",
              },
              {
                id: "refund",
                label: "Users can approve their own refunds",
                category: "run",
                why: "A logic flaw people find.",
              },
              {
                id: "eval",
                label: "Use of a dangerous function in the code",
                category: "code",
                why: "A static pattern.",
              },
            ]}
            explanation="SAST reads code, SCA and secret scanning check dependencies and keys, and DAST or people find runtime and logic problems. Layer them."
          />
        </div>
      }
    >
      <p>Sort the problems.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["No single tool wins", "Layer SAST, DAST, SCA, secrets, people."],
  ["Build it into the pipeline", "Fast checks early; deeper ones nightly."],
  ["People find logic flaws", "Pen tests, red teams, bounties."],
  ["Standards to aim at", "ASVS levels; SAMM; SSDF."],
  ["Scan AI code too", "It isn't secure by default."],
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
      <p>
        Next: assuming something gets through anyway, and noticing it, with logging and response.
      </p>
    </StepLayout>
  );
}
