"use client";

import { motion } from "motion/react";
import { Ambulance, Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ACTIVITIES, DUTIES, DUTY_LABEL, EX_LABEL, remains, type Ex } from "./model";
import type { ExState } from "./state";

/* 1 ─ Story: the ambulance ------------------------------------------------------------------------- */

export function AmbulanceStory() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The ambulance at the red light"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <Ambulance className="text-accent size-12" />
          <div className="grid w-full max-w-sm gap-1.5 text-xs">
            <div className="border-good/50 bg-good/10 rounded-lg border px-3 py-1.5">
              May go through a red light
            </div>
            <div className="border-good/50 bg-good/10 rounded-lg border px-3 py-1.5">
              May exceed the speed limit
            </div>
            <div className="border-bad/50 bg-bad/10 rounded-lg border px-3 py-1.5">
              Must still not run anyone over
            </div>
          </div>
        </div>
      }
    >
      <p>
        An ambulance with its siren on can jump a red light. That exemption exists for a good
        reason, but it&apos;s narrow: it covers getting a patient to hospital, and the driver still
        has to avoid hurting anyone.
      </p>
      <p>
        Section 17 of the DPDP Act works similarly. It sets out{" "}
        <Term id="dpdp-exemption">exemptions</Term> for legal claims, courts, crime prevention,
        outsourcing for foreign clients, approved mergers, loan defaulters, research and some State
        bodies. Most of them still leave security safeguards in place. These apply from May 2027.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Match the exemption ⭐ ----------------------------------------------------------------------- */

const OPTIONS: Ex[] = ["a", "c", "d", "e", "f", "research", "none"];

export function MatchExemption() {
  const [s, set] = useSceneState<ExState>();
  const act = ACTIVITIES.find((x) => x.id === s.current) ?? ACTIVITIES[0];
  const pick = s.picks[act.id];
  const left = pick ? remains(act.ex) : null;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Which exemption, if any?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {ACTIVITIES.map((x, i) => {
              const p = s.picks[x.id];
              return (
                <button
                  key={x.id}
                  type="button"
                  aria-label={`Activity ${i + 1}`}
                  aria-pressed={x.id === act.id}
                  onClick={() => set({ current: x.id })}
                  className={cn(
                    "size-7 rounded-full border text-[11px] font-medium",
                    x.id === act.id && "ring-accent ring-2",
                    !p && "border-line-strong text-muted",
                    p && p === x.ex && "border-good bg-good/15",
                    p && p !== x.ex && "border-bad bg-bad/15",
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-sm font-medium">{act.text}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {OPTIONS.map((o) => (
                <button
                  key={o}
                  type="button"
                  aria-pressed={pick === o}
                  onClick={() => set({ picks: { ...s.picks, [act.id]: o } })}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[11px]",
                    pick === o
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-line-strong text-muted hover:text-fg",
                  )}
                >
                  {EX_LABEL[o]}
                </button>
              ))}
            </div>
          </div>
          {pick && left && (
            <motion.div
              key={act.id + pick}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-2"
            >
              <p
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs",
                  pick === act.ex ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
                )}
              >
                <strong>{pick === act.ex ? "Right: " : "Best answer: "}</strong>
                {EX_LABEL[act.ex]}. {act.why}
              </p>
              <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
                {DUTIES.map((d) => (
                  <span
                    key={d}
                    className={cn(
                      "flex items-center gap-1 rounded-md border px-2 py-1 text-[10px]",
                      left.has(d)
                        ? "border-accent/50 bg-accent-soft"
                        : "border-line text-subtle line-through",
                    )}
                  >
                    {left.has(d) ? (
                      <Check className="text-accent size-3" />
                    ) : (
                      <X className="size-3" />
                    )}
                    {DUTY_LABEL[d]}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        Eight activities. For each, pick the exemption that applies, or none, then see which duties
        are switched off and which still apply.
      </p>
      <p>
        The pattern to notice: under the section 17(1) exemptions, security safeguards and
        responsibility for processors survive. Exemptions decide what you don&apos;t have to ask or
        tell; they rarely excuse careless handling.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Duty grid ------------------------------------------------------------------------------------- */

const GRID: Ex[] = ["none", "c", "d", "research", "state"];

export function DutyGrid() {
  const [s, set] = useSceneState<ExState>();
  const left = remains(s.grid);
  return (
    <StepLayout
      eyebrow="Explore"
      title="What each kind of exemption switches off"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {GRID.map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={s.grid === g}
                onClick={() => set({ grid: g })}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px]",
                  s.grid === g
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line-strong text-muted",
                )}
              >
                {EX_LABEL[g]}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {DUTIES.map((d) => (
              <motion.div
                key={d + s.grid}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs",
                  left.has(d) ? "border-accent/60 bg-accent-soft" : "border-line text-subtle",
                )}
              >
                {DUTY_LABEL[d]}: <strong>{left.has(d) ? "applies" : "off"}</strong>
              </motion.div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Research is outside the Act only if it meets the Second Schedule standards, which
            include security. A notified State body is outside the Act entirely.
          </p>
        </div>
      }
    >
      <p>
        There are three shapes of exemption. Section 17(1) lifts most duties but keeps security and
        accountability. Research under 17(2)(b) is outside the Act only if it meets set standards. A
        State body the government notifies under 17(2)(a) is outside the Act altogether.
      </p>
      <p>
        Separately, the government can notify startups or other classes for lighter duties under
        17(3), but nothing has been notified.
      </p>
    </StepLayout>
  );
}

/* 4 ─ The State and the debate ---------------------------------------------------------------------- */

const STATE: [string, string][] = [
  [
    "Notified State bodies",
    "The government can exempt its own agencies from the whole Act, for sovereignty, security, public order and similar reasons.",
  ],
  ["Keeping data", "The State need not erase data when a purpose ends."],
  [
    "Five-year power",
    "The government can switch off any provision for any fiduciary for up to five years after commencement.",
  ],
  [
    "Calling for data",
    "It can call for information from a fiduciary, and can direct the fiduciary not to tell the person.",
  ],
  [
    "Right to information",
    "The Act amended the RTI Act's personal-information exception; that change is already in force.",
  ],
];

export function StateAndDebate() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The State's powers, and the debate"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {STATE.map(([k, v], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{k}</p>
              <p className="text-muted">{v}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Some of the Act&apos;s widest exemptions are for the government itself. Supporters say they
        are needed for security and public order; critics say they are too broad.
      </p>
      <p>
        As of October 2026 the Supreme Court is hearing challenges to the RTI amendment, which it
        referred to a larger bench in February 2026, and to several State exemptions, on which it
        issued notice in May 2026. Neither has been decided, and nothing has been stayed.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function ExCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Exempt or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="dpdp-exemptions"
            prompt="Does a section 17 exemption apply?"
            categories={[
              { id: "yes", label: "Exempt" },
              { id: "no", label: "Not exempt" },
            ]}
            items={[
              {
                id: "court",
                label: "Producing records a court has ordered",
                category: "yes",
                why: "Courts and legal claims.",
              },
              {
                id: "churn",
                label: "Scoring each user's risk using 'research' data",
                category: "no",
                why: "A decision about individuals.",
              },
              {
                id: "bpo",
                label: "An Indian firm processing UK customers' data for a UK client",
                category: "yes",
                why: "17(1)(d), with security still applying.",
              },
              {
                id: "small",
                label: "A small startup skipping notices because it's small",
                category: "no",
                why: "No startup exemption has been notified.",
              },
              {
                id: "dd",
                label: "Sharing customer data for a merger that hasn't been approved yet",
                category: "no",
                why: "Only an approved merger is covered.",
              },
              {
                id: "defaulter",
                label: "Checking a loan defaulter's assets with credit bureaus",
                category: "yes",
                why: "17(1)(f).",
              },
            ]}
            explanation="Exemptions are narrow and specific. When one applies, security safeguards usually still do; when in doubt, assume the Act applies."
          />
        </div>
      }
    >
      <p>Sort each case.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ------------------------------------------------------------------------------------------ */

const POINTS: [string, string][] = [
  ["Narrow and specific", "Legal claims, courts, crime, foreign outsourcing, mergers, defaulters."],
  ["Security usually stays", "Under 17(1), safeguards and accountability remain."],
  ["Research has conditions", "No decisions about individuals; standards met."],
  ["Broad State powers", "Debated, and partly before the Supreme Court."],
  ["No automatic startup pass", "Only by notification."],
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
        That completes the special cases. Next chapter: enforcement and engineering, starting with
        the Data Protection Board and its penalties.
      </p>
    </StepLayout>
  );
}
