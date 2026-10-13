"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { AUDIT, DESIGN, LAUNCH, type Choice } from "./model";
import type { CapState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Well() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The village well"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Dug once", "Paid for by everyone, built to the rules, inspected."],
            ["Used by all", "Every household, every caste, every season."],
            ["Kept for decades", "Cleaned, repaired, recorded, handed on."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
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
        A village well is public infrastructure in miniature: paid for together, open to everyone,
        and looked after for generations. Get any part wrong and someone goes without water.
      </p>
      <p>
        Kalpanagar is launching a state scholarship portal. You&apos;ll buy it, design it, audit it
        and run it through deadline season, using everything in this track, from{" "}
        <Term id="public-procurement">procurement</Term> to{" "}
        <Term id="outputs-outcomes">outcomes</Term>.
      </p>
    </StepLayout>
  );
}

/* Shared choice list ------------------------------------------------------------------------------ */

function Choices({
  items,
  picks,
  onPick,
}: {
  items: Choice[];
  picks: Record<string, string>;
  onPick(id: string, opt: string): void;
}) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-2 text-xs">
      {items.map((c) => {
        const pick = c.options.find((o) => o.id === picks[c.id]);
        return (
          <div key={c.id} className="border-line bg-surface rounded-lg border px-3 py-2">
            <p className="font-semibold">{c.title}</p>
            <div className="mt-1 grid gap-1 sm:grid-cols-2">
              {c.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={pick?.id === o.id}
                  onClick={() => onPick(c.id, o.id)}
                  className={cn(
                    "rounded-md border px-2 py-1 text-left text-[11px]",
                    pick?.id === o.id
                      ? o.ok
                        ? "border-good bg-good/10"
                        : "border-bad bg-bad/5"
                      : "border-line hover:border-accent",
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
            {pick && (
              <p className={cn("mt-1 text-[11px]", pick.ok ? "text-good" : "text-bad")}>
                {pick.outcome}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* 2 ─ Design (branching) --------------------------------------------------------------------------- */

export function Design() {
  const [s, set] = useSceneState<CapState>();
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Buying and designing"
      stage={
        <Choices
          items={DESIGN}
          picks={s.design}
          onPick={(id, o) => set({ design: { ...s.design, [id]: o } })}
        />
      }
    >
      <p>
        Four early decisions shape the portal for years. Choose for each and read what follows. You
        can change your mind as often as you like.
      </p>
      <p>Modules 3, 7, 8, 9 and 20 cover these choices in depth.</p>
    </StepLayout>
  );
}

/* 3 ─ Audit (fix the problem) ---------------------------------------------------------------------- */

export function Audit() {
  const [s, set] = useSceneState<CapState>();
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="The pre-launch audit"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5 text-xs">
          {AUDIT.map((a) => {
            const on = s.fixed.includes(a.id);
            return (
              <div
                key={a.id}
                className={cn(
                  "flex flex-col items-start gap-1 rounded-lg border px-3 py-1.5 sm:flex-row sm:items-center sm:gap-2",
                  on ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/5",
                )}
              >
                <span className="w-full sm:flex-1">{a.problem}</span>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() =>
                    set({ fixed: on ? s.fixed.filter((x) => x !== a.id) : [...s.fixed, a.id] })
                  }
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-left text-[11px]",
                    on ? "border-good text-good" : "border-line-strong",
                  )}
                >
                  {on ? "Fixed · undo" : a.fix}
                </button>
              </div>
            );
          })}
          <p className="text-muted">
            {s.fixed.length === AUDIT.length
              ? "Ready for the security audit and certification."
              : `${s.fixed.length} of ${AUDIT.length} findings fixed.`}
          </p>
        </div>
      }
    >
      <p>
        Before go-live, a pre-audit against GIGW, accessibility law, CERT-In&apos;s rules and good
        practice found six problems. Fix them all.
      </p>
      <p>
        Each one comes from a different chapter: standards, languages, low bandwidth, forms, data
        sharing and security.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Launch (branching) --------------------------------------------------------------------------- */

export function Launch() {
  const [s, set] = useSceneState<CapState>();
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Deadline season"
      stage={
        <Choices
          items={LAUNCH}
          picks={s.launch}
          onPick={(id, o) => set({ launch: { ...s.launch, [id]: o } })}
        />
      }
    >
      <p>
        The portal is live. Three moments from its first application season, each drawn from what
        real scholarship systems face.
      </p>
      <p>
        No launch goes perfectly. What matters is how small the damage stays and how fast you learn.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Journey -------------------------------------------------------------------------------------- */

export function Journey() {
  const hops: [string, string][] = [
    [
      "A student hears about it",
      "By SMS and at school, in their own language (languages, channels)",
    ],
    [
      "Signs in",
      "With their scholarship registration; a service centre helps if needed (identity, assisted access)",
    ],
    [
      "Applies",
      "A short, accessible form that saves progress and works on 2G (accessibility, forms)",
    ],
    [
      "Proves eligibility",
      "Marks from DigiLocker; income as a yes/no from the revenue department (documents, data sharing)",
    ],
    ["Gets paid", "By DBT, to the account they confirmed (payments)"],
    ["Has a problem", "A grievance with a number and a 21-day clock (grievances)"],
    ["Is counted", "Completion, time to payment and who was left out (outcomes)"],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="One application, end to end"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1">
          {hops.map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="flex items-stretch gap-2 text-xs"
            >
              <span className="flex w-5 shrink-0 flex-col items-center">
                <span className="bg-accent text-accent-fg grid size-5 place-items-center rounded-full text-[10px]">
                  {i + 1}
                </span>
                {i < hops.length - 1 && <span className="bg-line-strong w-px flex-1" />}
              </span>
              <span className="border-line bg-surface mb-1 flex-1 rounded-lg border px-3 py-1.5">
                <span className="font-semibold">{t}</span>
                <span className="text-muted"> · {b}</span>
              </span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Follow one student&apos;s application through the portal. Almost every module in the track
        shows up somewhere along the way.
      </p>
      <p>
        Behind each step sit rules, records and audits: the parts citizens never see, and the parts
        that keep the service trustworthy.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function CapCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="From tender to results"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="gov-capstone"
            prompt="Put the stages of a public service project in order."
            items={[
              { id: "research", label: "Research with the people who'll use it" },
              { id: "procure", label: "Buy the build through a fair, open process" },
              { id: "build", label: "Build in stages, to GIGW and accessibility standards" },
              { id: "audit", label: "Security audit before going live" },
              { id: "launch", label: "Launch with a plan for the peak" },
              { id: "measure", label: "Measure outcomes and keep improving" },
            ]}
            explanation="Understand needs first so the tender asks for the right thing; build in stages to the standards; audit before go-live; plan for the peak; then measure whether people are better off and keep improving."
          />
        </div>
      }
    >
      <p>Put them in order.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Everyone is the user", "Every language, device and ability."],
        ["Buy and own wisely", "Fair tenders, your code, an exit plan."],
        ["Reuse the rails", "Identity, documents, payments, consent."],
        ["Secure and recoverable", "Logs, audits, backups, records."],
        ["Measure outcomes", "And who is still left out."],
      ]}
    >
      <p>
        That completes Building for Government, and the Security &amp; government category. The DPDP
        Act and Application Security tracks go deeper on privacy law and secure code.
      </p>
    </WrapStep>
  );
}
