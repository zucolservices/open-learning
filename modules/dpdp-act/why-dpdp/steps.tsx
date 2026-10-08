"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { TermId } from "@/glossaries";
import { END, INCIDENTS, MILESTONES, NOW, PARTS, START, inForce, monthLabel } from "./model";
import type { WhyState } from "./state";

/* 2 ─ What's in force when ⭐ --------------------------------------------------------------------- */

const pct = (at: number) => ((at - START) / (END - START)) * 100;

export function Runway() {
  const [s, set] = useSceneState<WhyState>();
  const shown = MILESTONES.filter((x) => x.at >= START);
  return (
    <StepLayout
      eyebrow="Explore"
      title="What's in force when?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <div>
            <div className="flex items-baseline justify-between">
              <p className="text-muted text-[10px] uppercase">Pick a date</p>
              <p className="font-mono text-sm font-semibold">{monthLabel(s.at)}</p>
            </div>
            <div className="relative mt-6 mb-1 h-2">
              <div className="bg-surface-2 absolute inset-0 rounded-full" />
              {shown.map((x) => (
                <div
                  key={x.id}
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${pct(x.at)}%` }}
                >
                  <span
                    className={cn(
                      "block size-2.5 rounded-full border-2",
                      x.proposed
                        ? "border-line-strong bg-surface border-dashed"
                        : s.at >= x.at
                          ? "border-accent bg-accent"
                          : "border-line-strong bg-surface",
                    )}
                  />
                </div>
              ))}
              <div
                className="absolute -top-5 -translate-x-1/2 text-[9px] whitespace-nowrap"
                style={{ left: `${pct(NOW)}%` }}
              >
                <span className="text-muted">today</span>
              </div>
            </div>
            <input
              type="range"
              aria-label="Date"
              min={START}
              max={END}
              value={s.at}
              onChange={(e) => set({ at: Number(e.target.value) })}
              className="accent-accent w-full"
            />
            <div className="text-subtle relative h-3 font-mono text-[10px]">
              {[2023, 2024, 2025, 2026, 2027].map((y) => (
                <span
                  key={y}
                  className="absolute -translate-x-1/2 first:translate-x-0"
                  style={{ left: `${pct((y - 2017) * 12)}%` }}
                >
                  {y}
                </span>
              ))}
            </div>
          </div>
          <ul className="grid gap-1.5">
            {PARTS.map((p) => {
              const on = inForce(p, s.at);
              return (
                <li
                  key={p.id}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-lg border px-3 py-1.5 text-xs transition-colors",
                    on
                      ? p.old
                        ? "border-line-strong bg-surface-2"
                        : "border-accent/60 bg-accent-soft"
                      : "border-line text-subtle",
                  )}
                >
                  <span>{p.label}</span>
                  <span className="shrink-0 font-medium">
                    {on ? "In force" : s.at < p.from ? `From ${monthLabel(p.from)}` : "Ended"}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="text-subtle text-[10px]">
            Dates count from the Rules&apos; Gazette date, 13 November 2025. A January 2026 proposal
            to shorten the runway (dashed) had not been made law by October 2026.
          </p>
        </div>
      }
    >
      <p>
        The Act became law in 2023, but most of it doesn&apos;t apply yet. Its own commencement
        notice switches parts on in three steps. Drag the date and watch them start.
      </p>
      <p>
        Right now the definitions and the{" "}
        <Term id="data-protection-board">Data Protection Board</Term> exist in law, but the
        Board&apos;s chair and members were still being selected in late 2026. The duties you build
        for, such as notice, consent, security and breach reporting, start in{" "}
        <strong>May 2027</strong>.
      </p>
      <p>
        Until then the older rules still apply: section 43A of the IT Act and the{" "}
        <Term id="spdi-rules">SPDI Rules 2011</Term>. So the time to build is now, before the runway
        ends.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Old rules, new law --------------------------------------------------------------------------- */

const COMPARE: { aspect: string; old: string; now: string }[] = [
  {
    aspect: "Which data",
    old: "Mainly 'sensitive' data: passwords, financial, health, biometric and a few more",
    now: "All personal data in digital form, sensitive or not",
  },
  {
    aspect: "Who it binds",
    old: "Companies (a 'body corporate')",
    now: "Any person or body deciding the purpose, including government bodies",
  },
  {
    aspect: "What people can do",
    old: "Ask to review and correct sensitive data; sue for compensation if harmed",
    now: "Access, correction, erasure, nomination and a grievance route to a Board",
  },
  {
    aspect: "Breaches",
    old: "No duty in these rules to tell affected people",
    now: "Tell the Board and every affected person",
  },
  {
    aspect: "Enforcement",
    old: "Compensation claims before adjudicating officers and courts",
    now: "A Data Protection Board with penalties up to ₹250 crore per breach",
  },
];

export function OldAndNew() {
  const [s, set] = useSceneState<WhyState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Old rules, new law"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            value={s.regime}
            onChange={(v) => set({ regime: v })}
            options={[
              ["old", "Until May 2027: IT Act s.43A"],
              ["new", "From May 2027: DPDP Act"],
            ]}
            size="sm"
          />
          <div className="grid gap-1.5">
            {COMPARE.map((c, i) => (
              <motion.div
                key={c.aspect + s.regime}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i }}
                className={cn(
                  "grid grid-cols-[6.5rem_1fr] gap-3 rounded-lg border px-3 py-2 text-xs",
                  s.regime === "new" ? "border-accent/50 bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <span className="text-muted">{c.aspect}</span>
                <span>{s.regime === "old" ? c.old : c.now}</span>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        India did have data rules before: section 43A of the IT Act 2000 and the{" "}
        <Term id="spdi-rules">SPDI Rules</Term> of 2011. They focused on a short list of
        &ldquo;sensitive&rdquo; data held by companies, and on compensation after harm.
      </p>
      <p>
        The DPDP Act is broader. It covers all digital personal data, applies to government bodies
        too, and gives people rights they can use before anything goes wrong. When its main parts
        start in May 2027, section 43A is removed from the IT Act.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Three incidents ------------------------------------------------------------------------------ */

export function Incidents() {
  const [s, set] = useSceneState<WhyState>();
  const inc = INCIDENTS.find((x) => x.id === s.incident) ?? INCIDENTS[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Three incidents, three lessons"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5 sm:grid-cols-3">
            {INCIDENTS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={x.id === inc.id}
                onClick={() => set({ incident: x.id })}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-xs transition",
                  x.id === inc.id
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                <span className="text-accent font-mono">{x.year}</span>
                <span className="mt-0.5 block font-medium">{x.title}</span>
              </button>
            ))}
          </div>
          <motion.div
            key={inc.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-4 text-sm"
          >
            <p className="text-muted text-[10px] uppercase">What happened</p>
            <p className="mt-1">{inc.what}</p>
            <p className="text-muted mt-3 text-[10px] uppercase">The DPDP idea it shows</p>
            <p className="mt-1">
              {inc.idea}{" "}
              <span className="text-subtle text-xs">
                (<Term id={inc.ideaTerm as TermId}>see the term</Term>)
              </span>
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        These three Indian incidents happened before the Act applied, so none was judged under it.
        Each one shows an idea the Act is built on.
      </p>
      <p>
        A <Term id="personal-data-breach">personal data breach</Term> covers leaks, but also data
        being changed, destroyed or made unavailable. And responsibility doesn&apos;t move to the IT
        company you hired.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function WhenCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Now, soon or later?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="dpdp-when"
            prompt="As of October 2026, when does each part apply?"
            categories={[
              { id: "now", label: "Already" },
              { id: "nov26", label: "Nov 2026" },
              { id: "may27", label: "May 2027" },
            ]}
            items={[
              {
                id: "board",
                label: "The Data Protection Board exists in law",
                category: "now",
                why: "Set up by the notices of 13 November 2025.",
              },
              {
                id: "cm",
                label: "Consent managers can register with the Board",
                category: "nov26",
                why: "One year after the Rules.",
              },
              {
                id: "notice",
                label: "Apps must give a DPDP notice before asking for consent",
                category: "may27",
                why: "Notice and consent are core duties: 18 months after the Rules.",
              },
              {
                id: "breach",
                label: "Breaches must be reported to the Board and each affected person",
                category: "may27",
                why: "Breach reporting starts with the other core duties.",
              },
              {
                id: "spdi",
                label: "IT Act section 43A stops applying",
                category: "may27",
                why: "The DPDP section that removes it starts in May 2027; until then it still applies.",
              },
            ]}
            explanation="Only the Board's legal setup has started. Consent managers come in November 2026 and the duties you build for in May 2027, unless the government changes the timetable."
          />
        </div>
      }
    >
      <p>Sort each part of the law by when it starts.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ------------------------------------------------------------------------------------------ */

const POINTS: [string, string][] = [
  ["Privacy is a fundamental right", "Puttaswamy, 2017, started the road to the Act."],
  ["The Act is law; most of it isn't in force", "Core duties start in May 2027."],
  ["It covers all digital personal data", "Not just a list of sensitive types."],
  ["The old rules apply until then", "IT Act s.43A and the SPDI Rules."],
  ["Build now", "Data maps, consent and breach plans take time."],
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
        Next: the cast of characters. Who is a Data Principal, a Data Fiduciary and a Data
        Processor, and who answers when something goes wrong?
      </p>
    </StepLayout>
  );
}
