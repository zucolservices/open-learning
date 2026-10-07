"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { EXPOSED, LAYERS, PRINCIPLES, STEPS, stopAt, type Layer } from "./model";
import type { DesignState } from "./state";

/* 1 ─ How a hotel stays safe ---------------------------------------------------------------------- */

export function Hotel() {
  const items: [string, string][] = [
    ["🔑", "Your key card opens your room, not every room."],
    ["🛗", "Lobby desk, then a lift that needs a card, then your door."],
    ["🚪", "A new room stays locked until it's assigned to a guest."],
    ["🔥", "In a fire, exit doors open; the safe stays shut."],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="How a hotel stays safe"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {items.map(([e, t], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3 text-xs"
            >
              <p className="text-2xl">{e}</p>
              <p className="mt-1">{t}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A hotel can&apos;t stop every thief at the front door, so it doesn&apos;t try. Each key
        opens only what that guest needs. A thief who gets past the lobby still faces the lift and
        the room lock. New rooms start locked. And when something breaks, the hotel has decided in
        advance which doors open and which stay shut.
      </p>
      <p>
        Those habits have names in software: <Term id="least-privilege">least privilege</Term>,{" "}
        <Term id="defence-in-depth">defence in depth</Term>, fail-safe defaults and failing safely.
        They prevent whole families of bugs at once, because they limit what any single mistake can
        do.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Stop a phished password ⭐ ------------------------------------------------------------------ */

export function Layers() {
  const [s, set] = useSceneState<DesignState>();
  const on = s.on ?? [];
  const stop = stopAt(on);
  const toggle = (l: Layer) => set({ on: on.includes(l) ? on.filter((x) => x !== l) : [...on, l] });
  const R = [78, 62, 46, 30];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Stop a phished password"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5 sm:grid-cols-2">
            {LAYERS.map((l) => (
              <label
                key={l.id}
                className={cn(
                  "flex cursor-pointer gap-2 rounded-lg border px-3 py-2 text-xs",
                  on.includes(l.id) ? "border-good bg-good/10" : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={on.includes(l.id)}
                  onChange={() => toggle(l.id)}
                  className="accent-accent mt-0.5"
                  aria-label={l.name}
                />
                <span>
                  <span className="font-semibold">{l.name}</span>{" "}
                  <span className="text-accent">· {l.principle}</span>
                  <span className="text-muted block">{l.detail}</span>
                </span>
              </label>
            ))}
          </div>
          <div className="grid items-center gap-3 sm:grid-cols-[10rem_1fr]">
            <svg viewBox="0 0 170 170" className="mx-auto w-40">
              {R.map((r, i) => (
                <circle
                  key={r}
                  cx={85}
                  cy={85}
                  r={r}
                  className={cn(
                    "fill-none",
                    i < stop ? "stroke-bad" : i === stop ? "stroke-good" : "stroke-line-strong",
                  )}
                  strokeWidth={i === stop ? 3 : 1.5}
                  strokeDasharray={i < stop ? "4 3" : undefined}
                />
              ))}
              <circle
                cx={85}
                cy={85}
                r={12}
                className={stop === STEPS.length ? "fill-bad" : "fill-good/60"}
              />
              <text x={85} y={88} textAnchor="middle" className="fill-fg text-[7px]">
                data
              </text>
              <circle
                cy={stop >= STEPS.length ? 85 : 85 - R[stop] - 2}
                style={{ transition: "cy 0.4s" }}
                cx={85}
                r={4}
                className="fill-accent"
              />
            </svg>
            <div className="flex flex-col gap-1">
              {STEPS.map((st, i) => (
                <p
                  key={st.what}
                  className={cn(
                    "text-xs",
                    i < stop ? "text-bad" : i === stop ? "text-good font-semibold" : "text-subtle",
                  )}
                >
                  {i < stop ? "✗" : i === stop ? "✓" : "·"} {i === stop ? st.ifStopped : st.what}
                </p>
              ))}
              <p className="mt-1 text-sm">
                Records exposed:{" "}
                <span className="font-mono font-semibold">
                  {EXPOSED[stop].toLocaleString("en-IN")}
                </span>
              </p>
            </div>
          </div>
          <p className="text-subtle text-[10px]">A made-up company and illustrative numbers.</p>
        </div>
      }
    >
      <p>
        An attacker has phished a support agent&apos;s password. Turn on layers and watch where the
        attack stops. Try each layer on its own: any one of them changes the outcome, and together
        they mean no single failure is fatal.
      </p>
      <p>
        The password was always going to leak one day. Good design assumes that and limits the
        damage. OWASP lists <Term id="insecure-design">insecure design</Term> in its Top 10 (A06 in
        the 2025 edition): a perfect implementation can&apos;t fix a design that never planned for
        this.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Eight principles from 1975 ------------------------------------------------------------------ */

export function EightPrinciples() {
  const [s, set] = useSceneState<DesignState>();
  const [name, short, eg] = PRINCIPLES[s.principle] ?? PRINCIPLES[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Eight principles from 1975"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {PRINCIPLES.map(([n], i) => (
              <button
                key={n}
                type="button"
                aria-pressed={s.principle === i}
                onClick={() => set({ principle: i })}
                className={cn(
                  "rounded-lg border px-2 py-2 text-left text-[11px]",
                  s.principle === i ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-lg border px-4 py-3"
          >
            <p className="text-sm font-semibold">{name}</p>
            <p className="text-xs">{short}</p>
            <p className="text-muted mt-1 text-xs">For example: {eg}</p>
          </motion.div>
          <p className="text-subtle text-[10px]">
            Jerome Saltzer and Michael Schroeder, “The Protection of Information in Computer
            Systems”, 1975.
          </p>
        </div>
      }
    >
      <p>
        In 1975 Jerome Saltzer and Michael Schroeder wrote down eight design principles for
        protecting information. Half a century later, their names are still the vocabulary of secure
        design. Click through them.
      </p>
      <p>
        They called them warnings, not rules: if your design breaks one, look again carefully. Note
        open design in particular: hiding how a system works (“security through obscurity”)
        isn&apos;t protection; secret keys are.
      </p>
    </StepLayout>
  );
}

/* 4 ─ When things break --------------------------------------------------------------------------- */

export function FailSafely() {
  const [s, set] = useSceneState<DesignState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="When things break"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-sm">
            The permissions service times out. What should the app do with the next request?
          </p>
          <div className="flex gap-1.5">
            {(["open", "closed"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={s.failMode === m}
                onClick={() => set({ failMode: m })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.failMode === m ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {m === "open" ? "Fail open: allow it" : "Fail closed: refuse it"}
              </button>
            ))}
          </div>
          <motion.div
            key={s.failMode}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              s.failMode === "open" ? "border-bad bg-bad/10" : "border-good bg-good/10",
            )}
          >
            {s.failMode === "open"
              ? "Every user can now do anything, including the attacker who triggered the timeout on purpose. OWASP's 2025 Top 10 added “Mishandling of Exceptional Conditions”, which includes failing open."
              : "Users see an error for a few minutes; nobody gets access they shouldn't. For a security check, that's usually the right trade."}
          </motion.div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Zero trust</p>
              <p className="text-muted">
                Don&apos;t trust a request because it comes from “inside” the network; check every
                access (NIST SP 800-207, 2020).
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Secure by Design</p>
              <p className="text-muted">
                A voluntary US-led pledge for products that are safe out of the box: 68 companies at
                launch in May 2024, 387 listed by October 2026.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        Every system breaks sometimes. Decide in advance what a broken check does. For security
        decisions, failing closed (refusing) is usually right; attackers love systems that let
        everything through when confused.
      </p>
      <p>
        It&apos;s a choice, not a dogma: fire exits deliberately fail open so people can escape. The
        mistake is not choosing at all and finding out during an incident.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which principle? ---------------------------------------------------------------------------- */

export function WhichPrinciple() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which principle?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-principle"
            prompt="Which principle does each design choice apply best?"
            categories={[
              { id: "least", label: "Least privilege" },
              { id: "depth", label: "Defence in depth" },
              { id: "default", label: "Fail-safe defaults" },
            ]}
            items={[
              {
                id: "readonly",
                label: "The reporting service connects with a read-only database user",
                category: "least",
                why: "Only the access it needs.",
              },
              {
                id: "waf",
                label:
                  "Input validation, parameterised queries and a firewall rule all guard the same form",
                category: "depth",
                why: "Several independent layers.",
              },
              {
                id: "newrole",
                label: "A new user role starts with no permissions",
                category: "default",
                why: "The starting answer is no.",
              },
              {
                id: "ci",
                label: "The build pipeline can deploy, but not read production data",
                category: "least",
                why: "Limited to its job.",
              },
              {
                id: "bucket",
                label: "New storage buckets are private unless made public on purpose",
                category: "default",
                why: "Safe by default.",
              },
              {
                id: "alerts",
                label: "Even after login and permission checks, unusual downloads raise an alert",
                category: "depth",
                why: "Another layer if the others fail.",
              },
            ]}
            explanation="Least privilege limits what each part can do; defence in depth stacks independent layers; fail-safe defaults start from no."
          />
        </div>
      }
    >
      <p>Sort the design choices.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Assume something leaks", "Design so one mistake isn't fatal."],
  ["Least privilege", "Only the access the job needs."],
  ["Defence in depth", "Independent layers."],
  ["Start from no", "Fail-safe defaults; check every request."],
  ["Choose how to fail", "Usually closed for security checks."],
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
      <p>Next: the OWASP Top 10, the best-known list of what goes wrong in web applications.</p>
    </StepLayout>
  );
}
