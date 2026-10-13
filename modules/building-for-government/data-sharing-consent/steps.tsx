"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { LINKS, SHAPES } from "./model";
import type { ShareState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Relay() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Ask once"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-bad/40 bg-bad/5 rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">The citizen as courier</p>
            <p className="text-muted">
              Collect a certificate from one office, carry it to another, then a third, each wanting
              its own copy.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-good/50 bg-good/10 rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">The offices talk</p>
            <p className="text-muted">
              With the citizen&apos;s say-so, one office asks the other directly, and only what it
              needs.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        Too often the citizen is the government&apos;s courier, carrying certificates from one
        office to the next. Each office already trusts the others; they just aren&apos;t connected.
      </p>
      <p>
        The <Term id="once-only">once-only principle</Term> says government shouldn&apos;t ask for
        what it already knows. Departments share through APIs instead, with consent, a clear purpose
        and logs, asking for the least data that answers the question:{" "}
        <Term id="data-minimisation">data minimisation</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Build and connect ⭐ ------------------------------------------------------------------------- */

export function Connect() {
  const [s, set] = useSceneState<ShareState>();
  const exposed = LINKS.reduce(
    (t, l) => t + (SHAPES.find(([id]) => id === s.picks[l.id])?.[2] ?? 0),
    0,
  );
  const allPicked = LINKS.every((l) => s.picks[l.id]);
  const minimal = LINKS.every((l) => s.picks[l.id] === l.answer);
  return (
    <StepLayout
      eyebrow="Build and connect"
      title="Connect three departments"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2 text-xs">
          {LINKS.map((l) => {
            const pick = s.picks[l.id];
            const ok = pick === l.answer;
            return (
              <div key={l.id} className="border-line bg-surface rounded-lg border px-3 py-2">
                <p>
                  <span className="text-accent mr-1.5 text-[10px] font-medium">{l.from}</span>
                  {l.question}
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {SHAPES.map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={pick === id}
                      onClick={() => set({ picks: { ...s.picks, [l.id]: id } })}
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[11px]",
                        pick === id
                          ? ok
                            ? "border-good bg-good/15"
                            : "border-bad bg-bad/10"
                          : "border-line-strong text-muted",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {pick && (
                  <p className={cn("mt-1 text-[11px]", ok ? "text-good" : "text-bad")}>
                    {l.feedback[pick]}
                  </p>
                )}
              </div>
            );
          })}
          <div className="grid gap-1">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={s.consent}
                onChange={() => set({ consent: !s.consent })}
              />
              The student sees what will be fetched, from whom and why, and agrees
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={s.log} onChange={() => set({ log: !s.log })} />
              Every request is logged, and the student can see who looked
            </label>
          </div>
          <div className="border-line bg-surface-2 rounded-lg border px-3 py-2">
            <p className="flex items-center gap-2">
              Data exposed
              <span className="bg-surface h-1.5 w-28 rounded-full">
                <motion.span
                  animate={{ width: `${(exposed / 9) * 100}%` }}
                  className={cn("block h-1.5 rounded-full", exposed > 5 ? "bg-bad" : "bg-good")}
                />
              </span>
            </p>
            <p className="text-muted mt-1">
              {!allPicked
                ? "Choose a shape for each request."
                : minimal && s.consent && s.log
                  ? "The student submits nothing twice, each office learns only what it needs, and every look is on record."
                  : !minimal
                    ? "Some requests return more than the question needs."
                    : !s.consent
                      ? "The student doesn't know what's being fetched about them."
                      : "Without logs, misuse would go unnoticed."}
            </p>
          </div>
        </div>
      }
    >
      <p>
        Kalpanagar&apos;s scholarship department used to ask students for three certificates. Now it
        will ask the other departments directly. Decide what each request should return, then add
        consent and logging.
      </p>
      <p>
        Asking a yes or no question instead of fetching a whole file is one of the simplest privacy
        protections there is.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Consent -------------------------------------------------------------------------------------- */

export function Consent() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Consent as infrastructure"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "DEPA (2020)",
              "NITI Aayog's Data Empowerment and Protection Architecture: a consent manager sits between the data holder and the data user.",
            ],
            [
              "Account Aggregators",
              "DEPA's first use, in finance since 2021: the aggregator moves encrypted data with consent and can't read it. Over 50 crore consents fulfilled by September 2026.",
            ],
            [
              "Consent artefacts",
              "A machine-readable record of what data, for what purpose, for how long. People can revoke it.",
            ],
            [
              "Regulation",
              "The RBI consolidated its aggregator directions in November 2025 and recognised Sahamati as the sector's self-regulatory body in June 2026.",
            ],
            [
              "DPDP consent managers",
              "A separate role under the DPDP Rules; registration opens in November 2026.",
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
        India turned consent from a tick-box into infrastructure: a standard way to ask, record and
        revoke permission for data to flow between organisations.
      </p>
      <p>
        Government departments connect through API Setu, India&apos;s API exchange, under the 2015
        Open API policy.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Basis ---------------------------------------------------------------------------------------- */

export function Basis() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The legal basis, and other countries"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "DPDP Act, section 7",
              "The State may process personal data without fresh consent to provide benefits, certificates and licences in some cases, and to carry out functions under law. In force from May 2027.",
            ],
            [
              "DPDP Act, section 17",
              "Exemptions, for example for preventing crime and for agencies the Centre notifies.",
            ],
            [
              "Estonia",
              "X-Road connects agencies without a central database; asking citizens twice for the same data is avoided by design.",
            ],
            [
              "European Union",
              "The Once-Only Technical System went live in December 2023: people ask one country to fetch proof from another, and preview it first.",
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
        &ldquo;Once-only&rdquo; doesn&apos;t mean &ldquo;no rules&rdquo;. Even where the law allows
        sharing without fresh consent, purpose limits, minimisation and logs still apply.
      </p>
      <p>
        This is an overview, not legal advice; check the DPDP timetable, which may still change.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function ShareCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Is yes or no enough?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="gov-data-sharing"
            prompt="For each check, is a yes or no answer enough, or is the actual value needed?"
            categories={[
              { id: "yesno", label: "Yes or no is enough" },
              { id: "value", label: "Needs the value" },
            ]}
            items={[
              {
                id: "income",
                label: "Is income below the scheme limit?",
                category: "yesno",
                why: "Only the threshold matters.",
              },
              {
                id: "adult",
                label: "Is the applicant 18 or older?",
                category: "yesno",
                why: "No need for the birth date.",
              },
              {
                id: "merit",
                label: "Rank applicants by Class 12 percentage",
                category: "value",
                why: "Ranking needs the score.",
              },
              {
                id: "bank",
                label: "Pay the scholarship into the student's account",
                category: "value",
                why: "Payment needs account details.",
              },
              {
                id: "enrolled",
                label: "Is the student enrolled this year?",
                category: "yesno",
                why: "A yes or no answers it.",
              },
            ]}
            explanation="Ask the narrowest question that answers the need. Many checks only need a yes or no; fetch actual values only when the decision depends on them."
          />
        </div>
      }
    >
      <p>Sort each check.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Ask once", "Departments share, citizens don't carry."],
        ["Ask narrowly", "Yes or no beats the whole file."],
        ["Show and record", "Consent, purpose and logs."],
        ["Consent as infrastructure", "DEPA and Account Aggregators."],
        ["Rules still apply", "DPDP limits even lawful sharing."],
      ]}
    >
      <p>Next: publishing what can be public.</p>
    </WrapStep>
  );
}
