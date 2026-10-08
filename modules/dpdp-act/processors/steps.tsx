"use client";

import { motion } from "motion/react";
import { Bus, School, Users, Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CLAUSES, CLOUD_TERMS, EVENTS, TIER_LABEL, type ClauseId, type Tier } from "./model";
import type { ProcState } from "./state";

/* 1 ─ Story: the school trip ----------------------------------------------------------------------- */

export function SchoolTrip() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The school trip"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-3 text-xs">
            {[
              { Icon: Users, t: "Parents" },
              { Icon: School, t: "The school" },
              { Icon: Bus, t: "The bus company" },
            ].map(({ Icon, t }, i) => (
              <div key={t} className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex flex-col items-center rounded-xl border p-3",
                    i === 1 ? "border-accent bg-accent-soft" : "border-line bg-surface",
                  )}
                >
                  <Icon className="text-accent size-5" />
                  <span className="mt-1">{t}</span>
                </div>
                {i < 2 && <span className="text-subtle">→</span>}
              </div>
            ))}
          </div>
          <p className="text-subtle max-w-xs text-center text-[11px]">
            The bus company loses a folder of children&apos;s medical forms. Parents call the
            school.
          </p>
        </div>
      }
    >
      <p>
        A school hires a bus company for a trip and hands over the children&apos;s medical forms. If
        the bus company loses them, parents don&apos;t chase a firm they never chose; they hold the
        school responsible. The school, in turn, relies on what its agreement with the bus company
        says.
      </p>
      <p>
        The DPDP Act works the same way. A fiduciary may use a{" "}
        <Term id="data-processor">Data Processor</Term> only under a valid contract, and stays
        responsible for what the processor does, &ldquo;irrespective of any agreement to the
        contrary&rdquo;. The contract is how the fiduciary makes the processor do what the law asks
        of the fiduciary.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Build the contract ⭐ ------------------------------------------------------------------------ */

const TIERS: Tier[] = ["required", "needed", "good"];

export function BuildContract() {
  const [s, set] = useSceneState<ProcState>();
  const have = new Set(s.clauses);
  const toggle = (c: ClauseId) =>
    set({ clauses: have.has(c) ? s.clauses.filter((x) => x !== c) : [...s.clauses, c] });
  const ev = EVENTS.find((e) => e.id === s.event) ?? EVENTS[0];
  const covered = have.has(ev.needs);
  return (
    <StepLayout
      eyebrow="Build"
      title="Write the vendor contract, then test it"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-2">
          <div className="grid gap-2">
            {TIERS.map((t) => (
              <div key={t}>
                <p className="text-muted text-[10px] uppercase">{TIER_LABEL[t]}</p>
                <div className="mt-1 grid gap-1">
                  {CLAUSES.filter((c) => c.tier === t).map((c) => (
                    <label
                      key={c.id}
                      className={cn(
                        "flex cursor-pointer items-start gap-2 rounded-lg border px-2.5 py-1 text-[11px]",
                        have.has(c.id)
                          ? "border-accent/60 bg-accent-soft"
                          : "border-line bg-surface",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={have.has(c.id)}
                        onChange={() => toggle(c.id)}
                        className="accent-accent mt-0.5"
                      />
                      <span className="flex-1">{c.label}</span>
                      <span className="text-subtle font-mono text-[9px]">{c.basis}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-muted text-[10px] uppercase">
              SabziBox&apos;s vendors (made up) · pick an event
            </p>
            <div className="flex flex-wrap gap-1">
              {EVENTS.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  aria-pressed={e.id === s.event}
                  onClick={() => set({ event: e.id })}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[11px]",
                    e.id === s.event
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-line-strong text-muted",
                  )}
                >
                  {e.vendor}
                </button>
              ))}
            </div>
            <motion.div
              key={ev.id + covered}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-xl border p-3 text-xs",
                covered ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
              )}
            >
              <p className="font-semibold">{ev.happens}</p>
              <p className="mt-2 flex items-start gap-1.5">
                {covered ? (
                  <Check className="text-good mt-0.5 size-3.5 shrink-0" />
                ) : (
                  <X className="text-bad mt-0.5 size-3.5 shrink-0" />
                )}
                {covered ? ev.ifPresent : ev.ifMissing}
              </p>
              <p className="text-muted mt-2">
                Clause that matters: {CLAUSES.find((c) => c.id === ev.needs)?.label}
              </p>
            </motion.div>
          </div>
        </div>
      }
    >
      <p>
        The law demands only two things of the contract itself: that it exists before processing,
        and that it makes the vendor keep the data secure. Start there, then run each vendor event.
      </p>
      <p>
        You&apos;ll find that most useful clauses aren&apos;t named in the law but are needed
        anyway, because without them you can&apos;t meet your own duties: report breaches in time,
        stop on withdrawal, or erase everywhere.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Three tiers ----------------------------------------------------------------------------------- */

export function Tiers() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Required, needed, nice to have"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-3">
          {TIERS.map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className={cn(
                "rounded-xl border p-3 text-xs",
                t === "required" ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <p className="font-semibold">{TIER_LABEL[t]}</p>
              <ul className="text-muted mt-2 grid gap-1">
                {CLAUSES.filter((c) => c.tier === t).map((c) => (
                  <li key={c.id}>• {c.label}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The Act puts almost no duties directly on processors. Every duty is the fiduciary&apos;s,
        with the words &ldquo;cause its Data Processor to&rdquo; stop, erase or stay secure. The
        contract is the only lever.
      </p>
      <p>
        The Act is silent on sub-processors. An earlier 2022 draft allowed them expressly; the final
        Act dropped that. Contracts fill the gap. And because people can ask who their data was
        shared with, keep a list of every processor you use.
      </p>
    </StepLayout>
  );
}

/* 4 ─ The cloud giants' terms ---------------------------------------------------------------------- */

export function CloudTerms() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What the big clouds' terms say"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {CLOUD_TERMS.map(([name, body], i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{name}</p>
              <p className="text-muted mt-0.5">{body}</p>
            </motion.div>
          ))}
          <p className="text-subtle text-[10px]">
            As checked in October 2026. Terms change; read the current version.
          </p>
        </div>
      }
    >
      <p>
        You won&apos;t usually negotiate with AWS, Google Cloud or Microsoft; you accept their data
        processing terms. As of October 2026 none of them had a section specific to India&apos;s
        DPDP Act. They rely on general &ldquo;applicable law&rdquo; wording.
      </p>
      <p>
        So check the substance instead: is there a breach-notice promise, a deletion process, and
        notice of new sub-processors? Smaller vendors are where custom terms matter most.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function ProcCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which tier?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="dpdp-processors"
            prompt="How does the law treat each processor-contract clause?"
            categories={[
              { id: "required", label: "Required" },
              { id: "needed", label: "Needed" },
              { id: "good", label: "Good practice" },
            ]}
            items={[
              {
                id: "signed",
                label: "A valid contract before processing starts",
                category: "required",
                why: "s.8(2).",
              },
              {
                id: "sec",
                label: "Security safeguard terms",
                category: "required",
                why: "Rule 6(1)(f).",
              },
              {
                id: "breach",
                label: "Prompt breach notice to the fiduciary",
                category: "needed",
                why: "Without it you can't meet your own notice duty.",
              },
              {
                id: "erase",
                label: "Erase on instruction",
                category: "needed",
                why: "s.8(7)(b) makes you cause erasure.",
              },
              {
                id: "audit",
                label: "Annual audit rights",
                category: "good",
                why: "Helpful evidence, not demanded.",
              },
              {
                id: "subs",
                label: "Approval before using sub-processors",
                category: "good",
                why: "The Act is silent.",
              },
            ]}
            explanation="The law names two contract terms. Many more are needed because the fiduciary's own duties depend on the processor acting."
          />
        </div>
      }
    >
      <p>Sort each clause.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ------------------------------------------------------------------------------------------ */

const POINTS: [string, string][] = [
  ["Contract first", "No processing without a valid contract."],
  ["Responsibility stays with you", "Whatever the contract says."],
  ["Security terms are required", "Rule 6(1)(f)."],
  ["Write in your own duties", "Breach notice, stop, erase, help with rights."],
  ["Know your processors", "People can ask who has their data."],
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
      <p>Next: when something goes wrong anyway. Personal data breaches, hour by hour.</p>
    </StepLayout>
  );
}
