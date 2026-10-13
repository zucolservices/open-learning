"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { MAX, METRICS, verdict } from "./model";
import type { MeasureState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Clinic() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The busy clinic"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">“Visits are up 40%!”</p>
            <p className="text-muted">
              Because patients keep coming back: the first visit never fixes anything.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">“How many got better?”</p>
            <p className="text-muted">
              The question that actually matters, and the one nobody was counting.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        A clinic boasting about rising visits might be failing its patients: they keep coming back
        because nothing gets fixed. What matters is how many get better.
      </p>
      <p>
        Government dashboards often count <Term id="outputs-outcomes">outputs</Term> such as visits
        and transactions. Good measures show outcomes: whether people completed the service, how
        long it took, what it cost them, and who is still left out.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Build and connect ⭐ ------------------------------------------------------------------------- */

export function Dashboard() {
  const [s, set] = useSceneState<MeasureState>();
  const picked = new Set(s.picked);
  const toggle = (id: string) =>
    set({
      picked: picked.has(id)
        ? s.picked.filter((x) => x !== id)
        : picked.size >= MAX
          ? s.picked
          : [...s.picked, id],
    });
  return (
    <StepLayout
      eyebrow="Build and connect"
      title="Rebuild the minister's dashboard"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <div className="border-line-strong bg-surface grid gap-1.5 rounded-xl border p-3 sm:grid-cols-2">
            {METRICS.filter((m) => picked.has(m.id)).map((m) => (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5",
                  m.kind === "output"
                    ? "border-line bg-surface-2"
                    : m.kind === "equity"
                      ? "border-viz-meta/50 bg-viz-meta/10"
                      : "border-good/50 bg-good/10",
                )}
              >
                <p className="text-muted text-[10px]">{m.label}</p>
                <p className="font-semibold">{m.value}</p>
              </motion.div>
            ))}
            {!picked.size && <p className="text-muted">Empty dashboard.</p>}
          </div>
          <p className="border-line bg-surface-2 rounded-lg border px-3 py-2">
            {verdict(s.picked)}
          </p>
          <div className="flex flex-wrap gap-1">
            {METRICS.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={picked.has(m.id)}
                disabled={!picked.has(m.id) && picked.size >= MAX}
                onClick={() => toggle(m.id)}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-left text-[11px] disabled:opacity-40",
                  picked.has(m.id)
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line-strong text-muted",
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            {picked.size} of {MAX} slots used. Values are illustrative.
          </p>
        </div>
      }
    >
      <p>
        The minister&apos;s dashboard for Kalpanagar&apos;s old-age pension shows visits, users and
        transactions, all rising. You have five slots. Rebuild it to show whether pensioners are
        actually better off.
      </p>
      <p>
        Green cards are outcomes; purple ones show who is left out. Try a dashboard of outputs only,
        then one without the purple cards.
      </p>
    </StepLayout>
  );
}

/* 3 ─ India measures ------------------------------------------------------------------------------- */

export function IndiaMeasures() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="How India measures e-services"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "eTaal",
              "NIC's dashboard of electronic transactions, since 2013. It counts what each service reports, so a case-status lookup counts like a delivered certificate: an output.",
            ],
            ["UMANG", "About 2,575 services and over 11 crore registered users (July 2026)."],
            [
              "NeSDA",
              "DARPG's assessment of state and central e-services, modelled on the UN's Online Service Index. Editions in 2019 and 2021; the 2025 cycle began in May 2026, with results pending.",
            ],
            [
              "What NeSDA checks",
              "Accessibility, content, ease of use, security and privacy, end-to-end delivery, integration and status tracking: the quality of the online offer.",
            ],
            [
              "What none of them shows",
              "Whether people actually got what they needed, how long it took, and who gave up.",
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
        Counting transactions and assessing portals are useful, but they measure the
        government&apos;s side. Outcomes measure the citizen&apos;s side.
      </p>
      <p>
        The UK made services publish four measures: cost per transaction, user satisfaction,
        completion rate and digital take-up.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Left out ------------------------------------------------------------------------------------- */

export function LeftOut() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Who is being left out?"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "Women and phones (GSMA, 2024 survey)",
              "In India, 71% of women owned a mobile against 84% of men; 36% a smartphone against 58%; 39% used mobile internet against 58%.",
            ],
            [
              "Still a gap in 2026",
              "GSMA's 2026 report put South Asia's mobile internet gender gap at 25%.",
            ],
            [
              "Shared phones",
              "Many women use someone else's phone, so OTPs and messages may go to a relative.",
            ],
            [
              "Averages hide groups",
              "A 62% completion rate can mean 80% for young urban men and 31% for rural women over 70.",
            ],
            [
              "Don't close the other doors",
              "Rising digital take-up can hide exclusion if offline channels shut. Track service-centre and phone volumes too.",
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
        Break every outcome down by group: gender, age, district, language, disability. The people a
        service fails are rarely visible in its averages.
      </p>
      <p>Pair the numbers with grievance data and research with people who didn&apos;t finish.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function MeasureCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Output or outcome?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="gov-outcomes"
            prompt="Is each measure an output (activity) or an outcome (a change in people's lives)?"
            categories={[
              { id: "output", label: "Output" },
              { id: "outcome", label: "Outcome" },
            ]}
            items={[
              {
                id: "visits",
                label: "Portal visits",
                category: "output",
                why: "Activity, not results.",
              },
              {
                id: "paid",
                label: "Pensions paid within 30 days of applying",
                category: "outcome",
                why: "People got what they needed, on time.",
              },
              {
                id: "services",
                label: "Number of services online",
                category: "output",
                why: "Supply, not use or benefit.",
              },
              {
                id: "unaided",
                label: "Share of applicants who finish without help",
                category: "outcome",
                why: "The service works for people.",
              },
              {
                id: "downloads",
                label: "App downloads",
                category: "output",
                why: "Installed isn't helped.",
              },
            ]}
            explanation="Outputs count activity: visits, services, downloads. Outcomes show whether people's lives got easier: completion, time, cost and who is still left out."
          />
        </div>
      }
    >
      <p>Sort each measure.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Outcomes over outputs", "Did life get easier?"],
        ["Completion, time, cost", "From the citizen's side."],
        ["Break it down", "By gender, age, district, language."],
        ["Count every channel", "Online, phone, service centres."],
        ["Publish it", "Measures that others can check."],
      ]}
    >
      <p>Next: the capstone, a state scholarship portal from tender to deadline day.</p>
    </WrapStep>
  );
}
