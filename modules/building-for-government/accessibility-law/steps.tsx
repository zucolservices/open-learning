"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BARRIERS, PEOPLE, stuckAt } from "./model";
import type { A11yLawState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Ramp() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Steps without a ramp"
      stage={
        <div className="flex flex-1 items-end justify-center gap-6 pb-6">
          <div className="flex items-end">
            {[1, 2, 3, 4].map((h) => (
              <div key={h} className="bg-line-strong w-6" style={{ height: h * 14 }} />
            ))}
            <span className="text-muted ml-2 text-[10px]">Office</span>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-xs"
          >
            <div className="border-accent bg-accent-soft h-14 w-28 border [clip-path:polygon(0_100%,100%_0,100%_100%)]" />
            <span className="text-accent">A ramp: required by law</span>
          </motion.div>
        </div>
      }
    >
      <p>
        A government office up a flight of steps, with no ramp, shuts out wheelchair users. Most
        countries now require ramps by law, not as a kindness.
      </p>
      <p>
        Digital services have steps too: unlabelled forms, low contrast, image puzzles. In India,
        the <Term id="rpwd-act">RPwD Act</Term> and the <Term id="is-17802">IS 17802</Term> standard
        make digital accessibility a legal duty, and the Supreme Court has called digital access
        part of the right to life.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix the problem ⭐ --------------------------------------------------------------------------- */

export function Barriers() {
  const [s, set] = useSceneState<A11yLawState>();
  const fixed = new Set(s.fixed);
  const toggle = (id: string) =>
    set({ fixed: fixed.has(id) ? s.fixed.filter((x) => x !== id) : [...s.fixed, id] });
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Remove the barriers"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <div className="grid gap-1.5 sm:grid-cols-2">
            {PEOPLE.map((p) => {
              const stuck = stuckAt(p.id, fixed);
              return (
                <motion.div
                  key={p.id}
                  layout
                  className={cn(
                    "rounded-lg border px-3 py-2",
                    stuck ? "border-bad/40 bg-bad/5" : "border-good/50 bg-good/10",
                  )}
                >
                  <p className="flex items-center gap-1.5 font-semibold">
                    {stuck ? (
                      <X className="text-bad size-3.5" />
                    ) : (
                      <Check className="text-good size-3.5" />
                    )}
                    {p.label}
                  </p>
                  <p className="text-muted">{p.how}</p>
                  <p className="mt-1">
                    {stuck
                      ? `Stuck at “${stuck.step}”: ${stuck.problem}`
                      : "Completes the application."}
                  </p>
                </motion.div>
              );
            })}
          </div>
          <div className="grid gap-1">
            {BARRIERS.map((b) => (
              <div
                key={b.id}
                className={cn(
                  "flex flex-col items-start gap-1 rounded-lg border px-3 py-1.5 sm:flex-row sm:items-center sm:gap-2",
                  fixed.has(b.id) ? "border-good/50 bg-good/10" : "border-line bg-surface",
                )}
              >
                <span className="w-full min-w-0 sm:flex-1">
                  <span className="text-muted mr-1 text-[10px]">{b.step}</span>
                  {b.problem}
                  <span className="text-subtle block text-[10px]">
                    {/^\d/.test(b.wcag) ? `WCAG ${b.wcag}` : b.wcag}
                  </span>
                </span>
                <button
                  type="button"
                  aria-pressed={fixed.has(b.id)}
                  onClick={() => toggle(b.id)}
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-left text-[10px]",
                    fixed.has(b.id) ? "border-good text-good" : "border-line-strong",
                  )}
                >
                  {fixed.has(b.id) ? "Fixed · undo" : b.fix}
                </button>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Two applicants try Kalpanagar&apos;s online pension application. Each card shows where they
        get stuck. Fix barriers until both can finish.
      </p>
      <p>
        Most fixes map to <Term id="wcag">WCAG</Term> success criteria, the yardstick that
        India&apos;s IS 17802 and GIGW use, as do laws in Europe, the UK and the US.
      </p>
    </StepLayout>
  );
}

/* 3 ─ India ---------------------------------------------------------------------------------------- */

export function IndiaLaw() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="India's law, step by step"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "2016",
              "RPwD Act: sections 40–46 require accessible ICT and services from public and private bodies; 21 disabilities recognised.",
            ],
            [
              "2017 and 2023",
              "The Rules set standards; the 2023 amendment adopted IS 17802 (based on Europe's EN 301 549) for ICT products and services.",
            ],
            [
              "Nov 2024",
              "Rajive Raturi: the Supreme Court said accessibility rules must be mandatory, not just guidelines, and asked the government to draw them up.",
            ],
            [
              "Apr 2025",
              "Pragya Prasun and Amar Jain: digital access is part of the right to life (Article 21). Twenty directions, including alternatives to “blink” checks in KYC.",
            ],
            [
              "Jul 2026",
              "Draft amendment rules (still proposed): mandatory IS 17802, accessibility conformance reports, and no government purchases of non-compliant ICT.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface flex gap-3 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent w-20 shrink-0 font-semibold">{t}</span>
              <span className="text-muted">{b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        India ratified the UN Convention on the Rights of Persons with Disabilities in 2007. The law
        has tightened steadily since, driven as much by the courts as by new rules.
      </p>
      <p>
        Complaints go to the Chief Commissioner or State Commissioners for Persons with
        Disabilities. This is an overview, not legal advice.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Abroad --------------------------------------------------------------------------------------- */

export function Abroad() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Rules in other countries"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "EU: public sector",
              "The Web Accessibility Directive covered all public websites by 2020 and apps by 2021, with accessibility statements.",
            ],
            [
              "EU: private services",
              "The European Accessibility Act has applied since 28 June 2025: online shops, banking, e-books, tickets.",
            ],
            [
              "UK",
              "Public Sector Bodies Accessibility Regulations 2018; GDS has tested against WCAG 2.2 AA since October 2024.",
            ],
            [
              "US",
              "Section 508 for federal agencies; a 2024 ADA rule for state and local governments, now due April 2027 (larger) and April 2028 (smaller).",
            ],
            [
              "The yardstick",
              "Almost every law targets WCAG level AA. WCAG 2.2 became the ISO standard ISO/IEC 40500:2025.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Because the laws share one yardstick, a service built to WCAG 2.2 AA is in good shape almost
        everywhere.
      </p>
      <p>Testing with disabled people themselves catches what automated checkers miss.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function LawCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The blink test"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="gov-accessibility"
            prompt="A service's video KYC asks applicants to blink. A blind applicant can't complete it. After the Supreme Court's April 2025 judgment, what should the service do?"
            options={[
              {
                id: "alt",
                label:
                  "Offer other ways to prove liveness and identity, including an assisted route",
                correct: true,
                feedback:
                  "Right. The Court read digital access into the right to life and directed alternatives to blink checks.",
              },
              {
                id: "office",
                label: "Tell blind applicants to apply at a branch instead",
                feedback: "That excludes them from the digital service everyone else can use.",
              },
              {
                id: "nothing",
                label: "Nothing: KYC rules require the blink",
                feedback:
                  "The Court directed the rules themselves to change; regulators issued new instructions.",
              },
              {
                id: "proxy",
                label: "Let a relative complete KYC using their own face",
                feedback: "That breaks the identity check rather than making it accessible.",
              },
            ]}
            explanation="Identity checks must have accessible alternatives. Digital access is now treated as a right, so a service that only one kind of body can complete is unlawful as well as unfair."
          />
        </div>
      }
    >
      <p>Pick the right response.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["A legal duty", "RPwD Act, IS 17802, court judgments."],
        ["Digital access is a right", "Supreme Court, 2025."],
        ["One yardstick", "WCAG level AA, almost everywhere."],
        ["Alternatives for identity", "No single body-dependent check."],
        ["Test with real people", "Screen readers, zoom, contrast."],
      ]}
    >
      <p>Next: serving people in every language and script.</p>
    </WrapStep>
  );
}
