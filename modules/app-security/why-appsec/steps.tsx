"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DEFENCES, STAGES, blockedAt, type Defence } from "./model";
import type { WhyState } from "./state";

/* 2 ─ Where could it have been stopped? ⭐ -------------------------------------------------------- */

export function StopTheBreach() {
  const [s, set] = useSceneState<WhyState>();
  const on = s.on ?? [];
  const stop = blockedAt(on);
  const toggle = (d: Defence) =>
    set({ on: on.includes(d) ? on.filter((x) => x !== d) : [...on, d] });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Where could it have been stopped?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5 sm:grid-cols-2">
            {DEFENCES.map((d) => (
              <label
                key={d.id}
                className={cn(
                  "flex cursor-pointer gap-2 rounded-lg border px-3 py-2 text-xs",
                  on.includes(d.id) ? "border-good bg-good/10" : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={on.includes(d.id)}
                  onChange={() => toggle(d.id)}
                  className="accent-accent mt-0.5"
                  aria-label={d.name}
                />
                <span>
                  <span className="font-semibold">{d.name}</span>
                  <span className="text-muted block">{d.detail}</span>
                </span>
              </label>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            {STAGES.map((st, i) => {
              const state = i < stop ? "passed" : i === stop ? "blocked" : "never";
              return (
                <motion.div
                  key={st.name}
                  animate={{ opacity: state === "never" ? 0.35 : 1 }}
                  className={cn(
                    "grid grid-cols-[1.5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs",
                    state === "passed"
                      ? "border-bad bg-bad/10"
                      : state === "blocked"
                        ? "border-good bg-good/10"
                        : "border-line bg-surface",
                  )}
                >
                  <span className="font-mono">
                    {state === "passed" ? "✗" : state === "blocked" ? "✓" : "·"}
                  </span>
                  <span>
                    <span className="font-semibold">
                      {i + 1}. {st.name}
                    </span>{" "}
                    <span className="text-muted">{st.what}</span>
                  </span>
                </motion.div>
              );
            })}
          </div>
          <p
            className={cn(
              "text-sm font-semibold",
              stop === STAGES.length ? "text-bad" : "text-good",
            )}
          >
            {stop === STAGES.length
              ? "The attack succeeds: data for about 147 million people leaves unnoticed."
              : `Stopped at step ${stop + 1}: ${STAGES[stop].name.toLowerCase()}.`}
          </p>
          <p className="text-subtle text-[10px]">
            A simplified chain based on the US GAO (2018) and House Oversight (2018) reports.
          </p>
        </div>
      }
    >
      <p>
        Switch on defences and watch how far the attackers get. Any one of these would have stopped
        the attack or cut it short. None is exotic: they&apos;re ordinary habits that slipped.
      </p>
      <p>
        Notice that the attack had to succeed at every step, while the defenders needed only one
        layer to work. Stacking independent layers, so one failure isn&apos;t fatal, is called
        defence in depth, and it&apos;s the subject of module 3.
      </p>
    </StepLayout>
  );
}

/* 3 ─ How attackers get in ------------------------------------------------------------------------ */

export function WaysIn() {
  const bars: [string, number][] = [
    ["Exploiting a vulnerability", 31],
    ["Phishing", 16],
    ["Using stolen credentials", 13],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="How attackers get in"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-[10px] uppercase">
            How breaches started (Verizon DBIR 2026)
          </p>
          {bars.map(([t, v], i) => (
            <div key={t} className="grid grid-cols-[10rem_1fr_3rem] items-center gap-2 text-xs">
              <span>{t}</span>
              <div className="bg-surface-2 h-3 rounded">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${v * 2.5}%` }}
                  transition={{ delay: 0.15 * i }}
                  className={cn("h-3 rounded", i === 0 ? "bg-accent" : "bg-viz-data/70")}
                />
              </div>
              <span className="text-right font-mono">{v}%</span>
            </div>
          ))}
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-mono text-xl">48%</p>
              <p className="text-muted">
                of breaches involved a third party, such as a supplier or a software dependency
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-mono text-xl">₹25.5 crore</p>
              <p className="text-muted">
                average cost of a breach in India (IBM, 2026); about US$4.99 million worldwide
              </p>
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            Verizon 2026 Data Breach Investigations Report (22,000+ confirmed breaches); IBM Cost of
            a Data Breach 2026.
          </p>
        </div>
      }
    >
      <p>
        Verizon studies thousands of confirmed breaches every year. In its 2026 report, exploiting a
        software flaw was the most common way in for the first time in its tracking, ahead of
        tricking people with phishing and logging in with stolen passwords.
      </p>
      <p>
        That is why this track is for every developer, not just a security team. Most of these flaws
        are ordinary code: a missing check, an input trusted too much, a library left unpatched.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Vulnerability, threat, risk ----------------------------------------------------------------- */

const LEVELS = ["Low", "Medium", "High"];

export function RiskWords() {
  const [s, set] = useSceneState<WhyState>();
  const score = s.likelihood + s.impact;
  const level = score <= 1 ? "Low" : score === 2 ? "Medium" : "High";
  return (
    <StepLayout
      eyebrow="Explore"
      title="Vulnerability, threat, risk"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              ["Vulnerability", "The broken latch: an unpatched Struts site."],
              ["Threat", "The burglar: criminals scanning for that flaw."],
              ["Risk", "How likely a break-in is, and how bad it would be."],
            ].map(([t, d]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted">{d}</p>
              </div>
            ))}
          </div>
          <p className="text-muted text-xs">
            Rate the risk of one unpatched public website holding credit records:
          </p>
          <div className="grid grid-cols-[4.5rem_repeat(3,1fr)] gap-1 text-center text-[11px]">
            <span />
            {LEVELS.map((l) => (
              <span key={l} className="text-muted">
                impact {l.toLowerCase()}
              </span>
            ))}
            {[2, 1, 0].map((li) => (
              <div key={li} className="contents">
                <span className="text-muted self-center text-right">
                  likely: {LEVELS[li].toLowerCase()}
                </span>
                {[0, 1, 2].map((im) => {
                  const v = li + im;
                  const sel = s.likelihood === li && s.impact === im;
                  return (
                    <button
                      key={im}
                      type="button"
                      aria-label={`Likelihood ${LEVELS[li]}, impact ${LEVELS[im]}`}
                      aria-pressed={sel}
                      onClick={() => set({ likelihood: li, impact: im })}
                      className={cn(
                        "h-9 rounded border",
                        v <= 1 ? "bg-good/15" : v <= 2 ? "bg-viz-compute/15" : "bg-bad/20",
                        sel ? "border-accent border-2" : "border-line",
                      )}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <p className="text-xs">
            Your rating: <span className="font-semibold">{level} risk</span>.{" "}
            {s.likelihood === 2 && s.impact === 2
              ? "Agreed: a known flaw, public exploits and millions of records. Patch it today."
              : "With a public exploit and millions of records at stake, most teams would put this in the top-right corner."}
          </p>
        </div>
      }
    >
      <p>
        Three words get mixed up. A <Term id="vulnerability">vulnerability</Term> is a weakness. A{" "}
        <Term id="threat">threat</Term> is anyone or anything that could use it to cause harm.{" "}
        <Term id="risk">Risk</Term> combines how likely that harm is with how bad it would be
        (NIST&apos;s definitions).
      </p>
      <p>
        You can&apos;t fix everything at once, so risk tells you what to fix first. Building
        security in from the start, rather than bolting it on before release, is called{" "}
        <Term id="shift-left">shifting left</Term>. Late fixes usually cost more because more
        depends on them, though the often-quoted “100 times more” figure has no traceable study
        behind it.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Name it ------------------------------------------------------------------------------------- */

export function SortWords() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Name it"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="vuln-threat-risk"
            prompt="Is each one a vulnerability, a threat or a risk?"
            categories={[
              { id: "vuln", label: "Vulnerability" },
              { id: "threat", label: "Threat" },
              { id: "risk", label: "Risk" },
            ]}
            items={[
              {
                id: "struts",
                label: "An unpatched web framework on a public site",
                category: "vuln",
                why: "A weakness that can be exploited.",
              },
              {
                id: "group",
                label: "A criminal group scanning the internet for that flaw",
                category: "threat",
                why: "Someone who could exploit it.",
              },
              {
                id: "chance",
                label: "A high chance of a breach exposing millions of records",
                category: "risk",
                why: "Likelihood combined with impact.",
              },
              {
                id: "file",
                label: "Passwords stored in a plain text file",
                category: "vuln",
                why: "A weakness waiting to be found.",
              },
              {
                id: "insider",
                label: "An employee who wants to sell customer data",
                category: "threat",
                why: "A person who could cause harm.",
              },
            ]}
            explanation="A vulnerability is the weakness, a threat is who or what could use it, and risk is how likely and how bad the harm would be."
          />
        </div>
      }
    >
      <p>Sort the examples.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Ordinary bugs, big breaches", "A missed patch, stored passwords, broken monitoring."],
  ["Attackers try every window", "One forgotten system is enough."],
  ["Flaws are the top way in", "31% of breaches in Verizon's 2026 report."],
  ["Vulnerability, threat, risk", "Weakness, who could use it, how likely and how bad."],
  ["Layers and early habits", "Defence in depth; shift left."],
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
      <p>Next: finding what could go wrong before you write the code, with threat modelling.</p>
    </StepLayout>
  );
}
