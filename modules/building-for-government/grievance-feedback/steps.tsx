"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CATS, simulate } from "./model";
import type { GrievState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Book() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The complaints book"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <div className="border-line-strong bg-surface w-64 rounded-lg border p-3 text-xs">
            <p className="font-semibold">Complaints register</p>
            {[
              "Bus didn't stop at Hirapur",
              "Bus didn't stop at Hirapur",
              "Late bus, route 4",
              "Bus didn't stop at Hirapur",
            ].map((t, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 * i }}
                className={cn("border-line border-t py-1", t.includes("Hirapur") && "text-accent")}
              >
                {t}
              </motion.p>
            ))}
          </div>
        </div>
      }
    >
      <p>
        A bus depot&apos;s complaints book can be read two ways: as a pile of individual complaints
        to answer, or as a record that the same stop keeps getting skipped. The second reading fixes
        the route.
      </p>
      <p>
        Every public service gets complaints. A{" "}
        <Term id="grievance-redressal">grievance system</Term> resolves each one, with a tracking
        number, deadlines and escalation, and the patterns show where the service itself must
        change.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Simulation ⭐ -------------------------------------------------------------------------------- */

export function Month() {
  const [s, set] = useSceneState<GrievState>();
  const r = simulate(s);
  const toggles: [keyof GrievState, string, boolean][] = [
    ["quick", "Close every case quickly with a standard reply", false],
    ["escalate", "Escalate to a senior officer before the 21-day limit", false],
    ["feedback", "Ask citizens after closure whether it was solved", false],
    ["analyse", "Group complaints by cause each week", false],
    ["fix", "Fix the cause: check bank accounts before paying pensions", !s.analyse],
  ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="A month of grievances"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              ["Closed within 21 days", `${r.within} of ${r.total}`],
              ["Average days to close", `${r.avg}`],
              ["Actually solved", s.feedback ? `${r.solved} of ${r.total}` : "Unknown"],
            ].map(([t, v]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-2 py-2">
                <p className="font-mono text-base font-semibold">{v}</p>
                <p className="text-muted text-[10px]">{t}</p>
              </div>
            ))}
          </div>
          {s.analyse && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="font-semibold">Complaints by cause</p>
              {r.byCat.map((c) => (
                <div key={c.cat} className="mt-1 flex items-center gap-2">
                  <span className="w-36 shrink-0">{CATS[c.cat].label}</span>
                  <motion.span
                    animate={{ width: `${(c.n / 40) * 100}%` }}
                    className={cn(
                      "h-2 rounded-full",
                      c.cat === "pension" ? "bg-bad/70" : "bg-viz-data/60",
                    )}
                  />
                  <span className="font-mono">{c.n}</span>
                </div>
              ))}
              <p className="text-muted mt-1 text-[11px]">
                Most “pension not credited” cases trace to payments sent to an old, Aadhaar-linked
                bank account.
              </p>
            </motion.div>
          )}
          {s.quick && s.feedback && (
            <p className="border-bad/40 bg-bad/5 rounded-lg border px-3 py-2">
              The dashboard looks perfect, but most citizens say their problem wasn&apos;t solved,
              and many appeal.
            </p>
          )}
          <div className="grid gap-1">
            {toggles.map(([k, label, disabled]) => (
              <label key={k} className={cn("flex items-center gap-2", disabled && "opacity-40")}>
                <input
                  type="checkbox"
                  disabled={disabled}
                  checked={s[k] as boolean}
                  onChange={() => set({ [k]: !s[k] })}
                />
                {label}
              </label>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Forty made-up grievances over a month. Illustrative numbers.
          </p>
        </div>
      }
    >
      <p>
        Kalpanagar&apos;s pension department receives forty grievances this month. Try the policies,
        alone and together, and watch what the numbers say.
      </p>
      <p>
        Try quick closure with and without feedback. Then group complaints by cause, and fix the
        biggest one at its source.
      </p>
    </StepLayout>
  );
}

/* 3 ─ CPGRAMS -------------------------------------------------------------------------------------- */

export function Cpgrams() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="How India handles grievances"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "CPGRAMS",
              "The central grievance portal, run by DARPG. In 2024 about 26.5 lakh grievances were redressed, 90.5% of those to be handled.",
            ],
            [
              "21 days",
              "Since August 2024, the maximum time to redress, down from 30; longer cases need an interim reply with a reason and date.",
            ],
            [
              "Faster on average",
              "Central ministries averaged 13 days in August 2026, down from 28 in 2019.",
            ],
            [
              "Appeal and feedback",
              "Citizens are asked about the outcome and can appeal to a senior officer.",
            ],
            [
              "Many ways in",
              "Web, the UMANG app, service centres, and a voice chatbot in the 22 scheduled languages.",
            ],
            [
              "States too",
              "Most states run their own portals and helplines; 15 are fully linked to CPGRAMS.",
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
        Every grievance gets a registration number, an officer and a clock. Senior reviews now also
        look for repeated issues to fix at their source.
      </p>
      <p>
        Build your service so its reference numbers and status feed straight into these systems.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Learn ---------------------------------------------------------------------------------------- */

export function Learn() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Closed isn't the same as solved"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Disposed means replied",
              "A case can be closed with a reply that fixes nothing. That's why feedback and appeals were added.",
            ],
            [
              "Averages hide the tail",
              "A 13-day average can sit alongside cases open for months. Look at the slowest ones too.",
            ],
            [
              "Sevottam",
              "India's service-excellence model (2006): a citizen's charter, grievance redress and service capability, certified against IS 15700:2018.",
            ],
            [
              "UK",
              "Central Government Complaint Standards (2022) from the Parliamentary and Health Service Ombudsman stress early resolution and learning.",
            ],
            [
              "Grievance or RTI?",
              "A grievance asks for a remedy; an RTI request asks for information. Different laws, different clocks.",
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
        Targets on closure speed alone encourage quick, empty replies. Measure whether problems were
        solved, and whether they stop recurring.
      </p>
      <p>The cheapest grievance is the one the service never causes.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function GrievCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Grievance or RTI?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="gov-grievance"
            prompt="Is each a grievance (asking for a remedy) or an RTI request (asking for information)?"
            categories={[
              { id: "grievance", label: "Grievance" },
              { id: "rti", label: "RTI request" },
            ]}
            items={[
              {
                id: "pension",
                label: "“My pension hasn't arrived for three months.”",
                category: "grievance",
                why: "Asks for the problem to be fixed.",
              },
              {
                id: "count",
                label: "“How many pensions were delayed last year?”",
                category: "rti",
                why: "Asks for information.",
              },
              {
                id: "file",
                label: "“Give me a copy of the notes on my application file.”",
                category: "rti",
                why: "Asks for records.",
              },
              {
                id: "cert",
                label: "“My certificate hasn't been issued after 40 days.”",
                category: "grievance",
                why: "Asks for a remedy.",
              },
              {
                id: "upload",
                label: "“The portal keeps rejecting my upload.”",
                category: "grievance",
                why: "A service failure to fix.",
              },
            ]}
            explanation="Grievances seek a remedy for a service failure and go to grievance systems such as CPGRAMS; RTI requests seek information under the RTI Act, with their own deadlines and appeals."
          />
        </div>
      }
    >
      <p>Sort each request.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Number, owner, clock", "Every grievance tracked."],
        ["Escalate before the deadline", "21 days centrally."],
        ["Ask if it was solved", "Closed isn't solved."],
        ["Read the patterns", "Fix causes, not just cases."],
        ["Grievance isn't RTI", "Remedy versus information."],
      ]}
    >
      <p>That ends the chapter on services. Next: security for government systems.</p>
    </WrapStep>
  );
}
