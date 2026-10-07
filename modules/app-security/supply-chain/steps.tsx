"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ATTACKS, STEPS, TREE, type Step } from "./model";
import type { ChainState } from "./state";

/* 1 ─ Trusting the whole kitchen ------------------------------------------------------------------ */

export function Potluck() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Trusting the whole kitchen"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="flex flex-wrap justify-center gap-2 text-3xl">🥘 🍲 🥗 🍰 🍜</div>
          <p className="text-muted max-w-sm text-center text-xs">
            You cooked one dish. You&apos;re trusting every other cook, and everyone who supplied
            their ingredients, that you never met.
          </p>
        </div>
      }
    >
      <p>
        At a big potluck you bring one dish, but you eat from all of them. You&apos;re trusting
        cooks you&apos;ve never met, and the shops and farms that supplied each of them. One bad
        ingredient, anywhere up that chain, can make you ill.
      </p>
      <p>
        Modern software is a potluck. Most of your app is open-source packages, each pulling in more
        packages. A flaw or a planted backdoor in any of them becomes yours. That whole chain is the{" "}
        <Term id="supply-chain">software supply chain</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The flaw three levels down ⭐ --------------------------------------------------------------- */

export function DepTree() {
  const [s, set] = useSceneState<ChainState>();
  const on = s.on ?? [];
  const toggle = (st: Step) =>
    set({ on: on.includes(st) ? on.filter((x) => x !== st) : [...on, st] });
  const found = on.includes("scan");
  return (
    <StepLayout
      eyebrow="Simulation"
      title="The flaw three levels down"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-0.5 font-mono text-[11px]">
            {TREE.map((d) => (
              <motion.div
                key={d.name}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "flex items-center gap-2 rounded px-2 py-1",
                  d.bad ? (found ? "bg-good/10" : "bg-bad/10") : "",
                )}
                style={{ paddingLeft: `${d.depth * 1.1 + 0.5}rem` }}
              >
                <span
                  className={cn(
                    d.depth === 0
                      ? "text-accent font-semibold"
                      : d.direct
                        ? "text-fg"
                        : "text-muted",
                  )}
                >
                  {d.depth > 0 ? "└ " : ""}
                  {d.name}
                </span>
                {d.direct && <span className="text-subtle text-[9px]">direct</span>}
                {d.bad && (
                  <span className={found ? "text-good" : "text-bad"}>
                    {found ? "⛔ flagged" : "⚠ vulnerable"}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
          <p className="text-muted text-[11px]">
            You wrote one package and chose two directly; the rest came along for the ride.
          </p>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {STEPS.map((st) => (
              <label
                key={st.id}
                className={cn(
                  "flex cursor-pointer gap-2 rounded-lg border px-3 py-1.5 text-xs",
                  on.includes(st.id) ? "border-good bg-good/10" : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={on.includes(st.id)}
                  onChange={() => toggle(st.id)}
                  className="accent-accent mt-0.5"
                  aria-label={st.name}
                />
                <span>
                  <span className="font-semibold">{st.name}</span>
                  <span className="text-muted block">
                    {on.includes(st.id) ? st.catches : st.detail}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Here&apos;s a tiny dependency tree. You wrote the top package and chose two libraries. Those
        pulled in more, and a critical flaw sits in one three levels down, which no one on your team
        ever picked.
      </p>
      <p>
        Switch on the defences. An <Term id="sbom">SBOM</Term> (a software bill of materials, an
        ingredients list) plus scanning means that when the next Log4Shell lands, you can tell in
        minutes whether you&apos;re affected, instead of spending weeks searching.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Four ways in -------------------------------------------------------------------------------- */

export function FourAttacks() {
  const [s, set] = useSceneState<ChainState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Four ways in"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1.5">
            {ATTACKS.map((x, i) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.attack === i}
                onClick={() => set({ attack: i })}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-xs",
                  s.attack === i ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <span className="font-semibold">{x.name}</span>
                {s.attack === i && <span className="text-muted mt-0.5 block">{x.detail}</span>}
              </button>
            ))}
          </div>
          <p className="text-subtle text-[10px]">Conceptual summaries; no attack code.</p>
        </div>
      }
    >
      <p>
        Supply-chain attacks come in a few shapes: a flaw in popular code, a poisoned build, a
        deliberately planted backdoor, and hijacked maintainer accounts. Click each. The scary ones
        are invisible: the SolarWinds update was correctly signed, because the attackers were inside
        the build.
      </p>
      <p>
        These keep happening and keep spreading faster, including self-replicating worms on package
        registries in 2025 and 2026. Even the tools we use to defend, like a vulnerability scanner,
        are themselves dependencies that can be compromised.
      </p>
    </StepLayout>
  );
}

/* 4 ─ If you publish, too ------------------------------------------------------------------------- */

export function Publishing() {
  const items: [string, string][] = [
    [
      "Protect your account",
      "Phishing-resistant 2FA (a passkey or security key). Stolen maintainer accounts are now a top way in.",
    ],
    [
      "Short-lived or trusted publishing",
      "Publish from CI with a short-lived identity token (OIDC), not a long-lived key pasted into a setting.",
    ],
    [
      "Prove provenance",
      "Sign releases and record where they were built (Sigstore, package provenance), so others can verify them.",
    ],
    [
      "Human approval to release",
      "Registries increasingly let a person with 2FA approve each publish, and skip install scripts by default.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="If you publish, too"
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
        If your team publishes a package or a container, you&apos;re someone else&apos;s supply
        chain. The same care flows the other way: guard the accounts that can publish, and give
        consumers a way to check that what they downloaded is what you built.
      </p>
      <p>
        Rules are tightening too: the EU&apos;s Cyber Resilience Act now requires makers of software
        products to report serious vulnerabilities and, from the end of 2027, to meet security
        duties across a product&apos;s life.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which defence fits? ------------------------------------------------------------------------- */

export function ChainDefence() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which defence fits?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="chain-defence"
            prompt="Match each worry to the defence that helps most."
            categories={[
              { id: "know", label: "Know what you ship" },
              { id: "fresh", label: "Stay patched safely" },
              { id: "trust", label: "Trust what you install" },
            ]}
            items={[
              {
                id: "sbom",
                label: "“When the next big flaw drops, are we affected?”",
                category: "know",
                why: "An SBOM answers it fast.",
              },
              {
                id: "scan",
                label: "“Does anything we use have a known flaw?”",
                category: "know",
                why: "Scan dependencies against databases.",
              },
              {
                id: "pin",
                label: "“Could a surprise version break or poison a build?”",
                category: "fresh",
                why: "Pin versions; review update PRs.",
              },
              {
                id: "bot",
                label: "“How do we keep up with patches without chaos?”",
                category: "fresh",
                why: "Automated PRs a human reviews.",
              },
              {
                id: "prov",
                label: "“Was this package really built from its stated source?”",
                category: "trust",
                why: "Verify provenance / signatures.",
              },
              {
                id: "pin2",
                label: "“Could a CI action be swapped under us?”",
                category: "trust",
                why: "Pin actions to an exact commit.",
              },
            ]}
            explanation="Know what you ship (SBOM, scanning), stay patched safely (pinning, reviewed updates), and trust what you install (provenance, pinned actions)."
          />
        </div>
      }
    >
      <p>Sort the worries.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Most of your code isn't yours", "Every dependency is trust."],
  ["Keep an SBOM, scan it", "Answer “are we affected?” in minutes."],
  ["Pin and review updates", "No surprise versions."],
  ["Verify provenance", "Was it built from the real source?"],
  ["You're a supply chain too", "Guard publishing; short-lived tokens."],
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
      <p>Next: finding these and other bugs before attackers do, with security testing.</p>
    </StepLayout>
  );
}
