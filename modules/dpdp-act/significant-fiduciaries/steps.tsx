"use client";

import { motion } from "motion/react";
import { Home, Building2, Lock, Unlock } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DUTIES, FACTORS, LEVEL_LABEL, PRESETS, outlook, type Level } from "./model";
import type { SdfState } from "./state";

/* 1 ─ Story: houses and stadiums ------------------------------------------------------------------- */

export function Stadiums() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Houses and stadiums"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border p-4 text-xs">
            <Home className="text-accent size-6" />
            <p className="mt-2 font-semibold">A house</p>
            <p className="text-muted mt-1">Basic building rules: safe wiring, sound structure.</p>
          </div>
          <div className="border-accent bg-accent-soft rounded-xl border p-4 text-xs">
            <Building2 className="text-accent size-6" />
            <p className="mt-2 font-semibold">A stadium</p>
            <p className="text-muted mt-1">
              The same rules, plus a fire officer, yearly inspections and crowd plans.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Every building follows basic safety rules. A stadium that holds fifty thousand people gets
        more: a named safety officer, regular inspections, evacuation plans. The risk is bigger, so
        the duties are too.
      </p>
      <p>
        The DPDP Act does the same. The government can name some organisations as{" "}
        <Term id="significant-data-fiduciary">Significant Data Fiduciaries</Term>, based on how much
        and how sensitive their data is and the risks involved. They carry extra duties on top of
        everyone else&apos;s. The power to name them starts in May 2027; none has been named yet.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Turn the dials ⭐ ---------------------------------------------------------------------------- */

const LEVELS: Level[] = [0, 1, 2];

export function Dials() {
  const [s, set] = useSceneState<SdfState>();
  const o = outlook(s.dials);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Would it be named significant?"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-1">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => set({ dials: p.dials })}
                  className="border-line-strong text-muted hover:text-fg rounded-full border px-2.5 py-0.5 text-[11px]"
                >
                  {p.label}
                </button>
              ))}
            </div>
            {FACTORS.map((f) => (
              <div key={f.id} className="border-line bg-surface rounded-lg border px-2.5 py-1.5">
                <div className="flex justify-between text-[11px]">
                  <span>{f.label}</span>
                  <span className="text-subtle font-mono">{f.clause}</span>
                </div>
                <div className="mt-1 flex gap-1">
                  {LEVELS.map((l) => (
                    <button
                      key={l}
                      type="button"
                      aria-pressed={s.dials[f.id] === l}
                      aria-label={`${f.label}: ${LEVEL_LABEL[l]}`}
                      onClick={() => set({ dials: { ...s.dials, [f.id]: l } })}
                      className={cn(
                        "flex-1 rounded-md border py-0.5 text-[10px]",
                        s.dials[f.id] === l
                          ? "border-accent bg-accent text-accent-fg"
                          : "border-line text-muted",
                      )}
                    >
                      {LEVEL_LABEL[l]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <div
              className={cn(
                "rounded-xl border p-3 text-center",
                o.level === 2 ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <p className="text-muted text-[10px] uppercase">Illustrative outlook</p>
              <p className="text-accent text-xl font-semibold">{o.label}</p>
              <p className="text-subtle text-[10px]">
                The law sets no score or threshold; the government decides.
              </p>
            </div>
            <button
              type="button"
              aria-pressed={s.notified}
              onClick={() => set({ notified: !s.notified })}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium",
                s.notified ? "border-accent bg-accent text-accent-fg" : "border-line-strong",
              )}
            >
              {s.notified ? <Unlock className="size-3.5" /> : <Lock className="size-3.5" />}
              {s.notified ? "Notified as significant" : "Suppose the government notifies it"}
            </button>
            <div className="grid gap-1">
              {DUTIES.map((d, i) => (
                <motion.div
                  key={d.title}
                  animate={{ opacity: s.notified ? 1 : 0.3 }}
                  transition={{ delay: s.notified ? 0.05 * i : 0 }}
                  className={cn(
                    "rounded-lg border px-2.5 py-1 text-[11px]",
                    s.notified ? "border-accent/50 bg-accent-soft" : "border-line",
                  )}
                >
                  <span className="font-semibold">{d.title}.</span>{" "}
                  {s.notified && <span className="text-muted">{d.body}</span>}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <p>
        Section 10 lists six factors the government weighs, and says it may consider others. Set the
        dials for a platform, or try a preset, then suppose it&apos;s notified and see what unlocks.
      </p>
      <p>
        The outlook meter is only an illustration. There are no user counts or scores in the law. A
        notification can name a single company or a whole class of them.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The DPO and the audit ------------------------------------------------------------------------ */

export function DpoAndAudit() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The DPO, the DPIA and the audit"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-3">
          {[
            [
              "Data Protection Officer",
              "Based in India. An individual who answers to the board of directors. Represents the company and is the contact for grievances.",
            ],
            [
              "Impact assessment (DPIA)",
              "Every 12 months: which rights are affected, why the data is processed, and how risks are assessed and managed.",
            ],
            [
              "Audit",
              "Every 12 months, by an independent data auditor. Significant findings go to the Data Protection Board, not just the company's own board.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-xl border p-3 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        In the Act, a <Term id="data-protection-officer">Data Protection Officer</Term> exists only
        at a Significant Data Fiduciary. Everyone else must publish the contact of someone who can
        answer questions about their processing, which in practice many companies also call a DPO.
      </p>
      <p>
        Breaching the extra duties can draw a penalty of up to ₹150 crore. For engineers, the yearly
        assessment and the algorithm checks mean documented designs, data flows and model reviews,
        not just a policy.
      </p>
    </StepLayout>
  );
}

/* 4 ─ The other direction --------------------------------------------------------------------------- */

export function OtherDirection() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="More duties for some, fewer for others"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <div className="border-accent bg-accent-soft rounded-xl border p-3 text-xs">
            <p className="font-semibold">Significant Data Fiduciaries (s.10)</p>
            <p className="mt-1">
              The government can add duties for those with the most or riskiest data.
            </p>
          </div>
          <div className="border-line bg-surface rounded-xl border p-3 text-xs">
            <p className="font-semibold">Notified exemptions (s.17(3))</p>
            <p className="mt-1">
              It can also lift some duties, such as notice, accuracy, erasure and access, for
              notified classes, &ldquo;including startups&rdquo;. Being a startup isn&apos;t
              automatic; nothing has been notified.
            </p>
          </div>
          <div className="border-line bg-surface-2/60 rounded-xl border p-3 text-xs sm:col-span-2">
            <p className="font-semibold">Timing</p>
            <p className="text-muted mt-1">
              Both powers start in May 2027. A January 2026 proposal to bring the
              significant-fiduciary rules forward hadn&apos;t been made law by October 2026.
            </p>
          </div>
        </div>
      }
    >
      <p>
        The Act scales in both directions. Big, risky processors can be given extra duties; small
        ones can be given lighter ones, but only by government notification.
      </p>
      <p>
        If you work at a startup, don&apos;t assume an exemption. Build for the full duties until a
        notification says otherwise.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function SdfCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Everyone, or only significant ones?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="dpdp-sdf"
            prompt="Which duties apply to every Data Fiduciary, and which only to Significant Data Fiduciaries?"
            categories={[
              { id: "all", label: "Every fiduciary" },
              { id: "sdf", label: "Only significant" },
            ]}
            items={[
              {
                id: "dpo",
                label: "Appoint a DPO based in India",
                category: "sdf",
                why: "s.10(2)(a).",
              },
              {
                id: "dpia",
                label: "Run an impact assessment every 12 months",
                category: "sdf",
                why: "s.10(2)(c), Rule 13.",
              },
              {
                id: "breach",
                label: "Tell the Board and people about breaches",
                category: "all",
                why: "s.8(6).",
              },
              {
                id: "algo",
                label: "Check algorithms don't put rights at risk",
                category: "sdf",
                why: "Rule 13(3).",
              },
              {
                id: "safe",
                label: "Take reasonable security safeguards",
                category: "all",
                why: "s.8(5).",
              },
              {
                id: "contact",
                label: "Publish a contact who can answer questions",
                category: "all",
                why: "s.8(9).",
              },
            ]}
            explanation="Every fiduciary has the core duties. Significant ones add a DPO, an independent auditor, yearly assessments and audits, algorithm checks and possible localisation."
          />
        </div>
      }
    >
      <p>Sort each duty.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ------------------------------------------------------------------------------------------ */

const POINTS: [string, string][] = [
  ["Named by the government", "Six factors, an open list, no numbers."],
  ["Extra duties", "DPO, auditor, yearly DPIA and audit, algorithm checks."],
  ["Some data may stay in India", "Only categories the government specifies."],
  ["Up to ₹150 crore", "For breaching the extra duties."],
  ["None yet", "The power starts in May 2027."],
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
      <p>Next: sending personal data abroad, and the rules that keep some of it at home.</p>
    </StepLayout>
  );
}
