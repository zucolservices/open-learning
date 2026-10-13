"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BACKUPS, LOGS, RECOVERY, outcome } from "./model";
import type { ContState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Ledger() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The land records ledger"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <div className="border-line-strong bg-surface w-64 rounded-lg border p-3 font-mono text-[11px]">
            {[
              "1952 · plot 114 · sold",
              "1978 · plot 114 · divided",
              "2004 · plot 114/2 · inherited",
              "2026 · plot 114/2 · mutated",
            ].map((t, i) => (
              <motion.p
                key={t}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 * i }}
                className="border-line border-b py-1 last:border-0"
              >
                {t}
              </motion.p>
            ))}
          </div>
        </div>
      }
    >
      <p>
        A village land ledger can settle a dispute seventy years later, but only if every entry is
        still there, and it&apos;s clear who wrote each one. Lose the book, and families lose proof
        of what&apos;s theirs.
      </p>
      <p>
        Government decisions must stay traceable for years. Services keep records for set periods,
        keep an <Term id="audit-trail">audit trail</Term> of who did what, and plan{" "}
        <Term id="disaster-recovery">disaster recovery</Term> so one failure doesn&apos;t erase
        history.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Branching scenario ⭐ ------------------------------------------------------------------------ */

function Choice({
  title,
  options,
  value,
  onPick,
}: {
  title: string;
  options: [string, string][];
  value: string;
  onPick(v: string): void;
}) {
  return (
    <div className="border-line bg-surface rounded-lg border px-3 py-2">
      <p className="font-semibold">{title}</p>
      <div className="mt-1 grid gap-1">
        {options.map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={value === id}
            onClick={() => onPick(id)}
            className={cn(
              "rounded-md border px-2 py-1 text-left text-[11px]",
              value === id ? "border-accent bg-accent-soft" : "border-line hover:border-accent",
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Flood() {
  const [s, set] = useSceneState<ContState>();
  const o = outcome(s.backup, s.recovery, s.logs);
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="The data centre floods"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2 text-xs">
          <Choice
            title="1 · Backups"
            options={BACKUPS}
            value={s.backup}
            onPick={(v) => set({ backup: v })}
          />
          <Choice
            title="2 · Getting back online"
            options={RECOVERY}
            value={s.recovery}
            onPick={(v) => set({ recovery: v })}
          />
          <Choice
            title="3 · Logs of who changed what"
            options={LOGS}
            value={s.logs}
            onPick={(v) => set({ logs: v })}
          />
          <motion.div
            key={`${s.backup}-${s.recovery}-${s.logs}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "grid gap-1 rounded-lg border px-3 py-2",
              o.good ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/5",
            )}
          >
            <p className="font-semibold">2 p.m.: the primary data centre floods</p>
            <p>
              <span className="text-muted">Data lost: </span>
              {o.lost}
            </p>
            <p>
              <span className="text-muted">Service down for: </span>
              {o.down}
            </p>
            <p>
              <span className="text-muted">Audit trail: </span>
              {o.audit}
            </p>
          </motion.div>
          <p className="text-subtle text-[10px]">
            Illustrative: 600 applications an hour; times are rough.
          </p>
        </div>
      }
    >
      <p>
        Kalpanagar&apos;s scholarship system is in the middle of application season. Choose how it
        was prepared, then see what happens when its main data centre floods.
      </p>
      <p>
        Two numbers describe recovery: the <Term id="rpo">RPO</Term>, how much recent data you can
        lose, and the <Term id="rto">RTO</Term>, how long until you&apos;re back.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Records -------------------------------------------------------------------------------------- */

export function Records() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What must be kept, and for how long"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Public Records Act, 1993",
              "No public record may be destroyed except as the rules allow; breaking this can mean up to five years in prison.",
            ],
            [
              "Public Records Rules, 1997",
              "Records over 25 years old can't be destroyed without appraisal by the National Archives; destruction is witnessed, and the list of destroyed files is kept forever.",
            ],
            [
              "Retention schedules",
              "Category A: keep permanently. B: review at 25 years. C: keep for a set period, then review.",
            ],
            [
              "E-files too",
              "A 2025 DARPG memo restates that the same rules apply to electronic files; most central government files are now e-files.",
            ],
            [
              "Pending RTI",
              "The Information Commission has said a record shouldn't be destroyed while an RTI request about it is pending.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Digital systems need retention built in from the start: what each record is, how long it
        must be kept, and how it&apos;s reviewed and disposed of.
      </p>
      <p>
        Under the DPDP Act, the State is exempt from the duty to erase personal data once its
        purpose ends, so record rules, not privacy law, often decide how long data stays.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Audit ---------------------------------------------------------------------------------------- */

export function Audit() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Audits and recovery targets"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "The CAG audits IT too",
              "A 2021 report on UIDAI found it had no data archival policy, and recommended one.",
            ],
            [
              "Logs",
              "CERT-In requires logs of all systems for 180 days; keep them away from the systems they describe.",
            ],
            [
              "Second sites",
              "NIC runs national data centres in Delhi, Pune, Hyderabad and Bhubaneswar, which also provide disaster recovery for state data centres.",
            ],
            [
              "Set RPO and RTO per system",
              "There's no single government-wide number: agree them for each service, and put them in the contract.",
            ],
            ["Rehearse", "A recovery plan that has never been tested is a hope, not a plan."],
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
        Auditors ask years later what happened and why. An audit trail that records who did what,
        and when, is how a service answers.
      </p>
      <p>Keep the disaster recovery site in India, in a different region from the main one.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function ContCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which retention category?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="gov-records"
            prompt="Under central government retention schedules, which category fits each record?"
            categories={[
              { id: "a", label: "A: keep permanently" },
              { id: "c", label: "C: set period, then review" },
            ]}
            items={[
              {
                id: "guard",
                label: "A standing guard file of the scheme's orders",
                category: "a",
                why: "Standing guard files are kept permanently.",
              },
              {
                id: "register",
                label: "The register of all files opened",
                category: "a",
                why: "File registers are permanent.",
              },
              {
                id: "pq",
                label: "A reply to a Parliament question",
                category: "c",
                why: "Kept for a few years, then reviewed.",
              },
              {
                id: "dak",
                label: "The register of incoming mail",
                category: "c",
                why: "Kept for a set period.",
              },
              {
                id: "monthly",
                label: "A monthly progress report",
                category: "c",
                why: "Short retention.",
              },
            ]}
            explanation="Retention schedules put each type of record in a category: A records such as standing guard files and file registers are kept permanently; C records such as routine reports are kept for a set period and then reviewed. Category B, reviewed at 25 years with the National Archives, covers files of possible historical value."
          />
        </div>
      }
    >
      <p>Sort each record.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Nothing simply disappears", "Retention schedules and appraisal."],
        ["Who did what, when", "Audit trails kept apart."],
        ["Back up elsewhere", "Another site, another region."],
        ["Agree RPO and RTO", "For each service."],
        ["Rehearse recovery", "Untested plans fail."],
      ]}
    >
      <p>That ends the chapter on security and resilience. Next: open source and reuse.</p>
    </WrapStep>
  );
}
