"use client";

import { motion } from "motion/react";
import { Scissors } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { GROUND_LABEL, JOBS, USES, type Ground } from "./model";
import type { LegitState } from "./state";

/* 1 ─ Story: the tailor's call --------------------------------------------------------------------- */

export function TailorsCall() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The tailor's phone call"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="grid w-full max-w-md gap-2">
            <div className="border-good/50 bg-good/10 flex items-center gap-3 rounded-xl border p-3 text-sm">
              <Scissors className="text-good size-5" />
              <span>&ldquo;Your kurta is ready, come and collect it.&rdquo;</span>
            </div>
            <div className="border-bad/50 bg-bad/10 flex items-center gap-3 rounded-xl border p-3 text-sm">
              <Scissors className="text-bad size-5" />
              <span>&ldquo;Big Diwali sale! Also, my cousin sells insurance…&rdquo;</span>
            </div>
          </div>
        </div>
      }
    >
      <p>
        You leave your number with a tailor so they can call when your kurta is ready. Nobody needs
        a signed form for that call: you gave the number for exactly that reason. A sales call, or
        passing your number to a cousin, is a different matter.
      </p>
      <p>
        The DPDP Act works the same way. Most processing needs consent, but section 7 lists{" "}
        <Term id="legitimate-use">legitimate uses</Term> that don&apos;t: data someone gave you for
        a clear purpose, legal duties, court orders, medical emergencies, State benefits, employment
        and a few more. The list applies from May 2027.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Pick the ground ⭐ --------------------------------------------------------------------------- */

const GROUNDS: Ground[] = ["consent", "7a", "7b", "7d", "7e", "7f", "7i", "none"];

export function PickGround() {
  const [s, set] = useSceneState<LegitState>();
  const job = JOBS.find((j) => j.id === s.current) ?? JOBS[0];
  const pick = s.picks[job.id];
  const right = pick === job.ground;
  const arguable = !!job.grey && pick === "7a";
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Which ground applies?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {JOBS.map((j, i) => {
              const p = s.picks[j.id];
              return (
                <button
                  key={j.id}
                  type="button"
                  aria-label={`Job ${i + 1}`}
                  aria-pressed={j.id === job.id}
                  onClick={() => set({ current: j.id })}
                  className={cn(
                    "size-7 rounded-full border text-[11px] font-medium",
                    j.id === job.id && "ring-accent ring-2",
                    !p && "border-line-strong text-muted",
                    p && p === j.ground && "border-good bg-good/15",
                    p && p !== j.ground && "border-bad bg-bad/15",
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-sm font-medium">{job.text}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {GROUNDS.map((g) => (
                <button
                  key={g}
                  type="button"
                  aria-pressed={pick === g}
                  onClick={() => set({ picks: { ...s.picks, [job.id]: g } })}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[11px] transition",
                    pick === g
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-line-strong text-muted hover:text-fg",
                  )}
                >
                  {GROUND_LABEL[g]}
                </button>
              ))}
            </div>
          </div>
          {pick && (
            <motion.div
              key={job.id + pick}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs",
                right
                  ? "border-good/50 bg-good/10"
                  : arguable
                    ? "border-line-strong bg-surface-2"
                    : "border-bad/50 bg-bad/10",
              )}
            >
              <p className="font-semibold">
                {right ? "Right: " : arguable ? "Arguable. Safer answer: " : "Best answer: "}
                {GROUND_LABEL[job.ground]}
              </p>
              <p className="mt-0.5">{job.why}</p>
              {job.grey && <p className="text-muted mt-1">{job.grey}</p>}
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        Ten everyday jobs. For each, pick the ground the organisation can rely on: consent, one of
        the legitimate uses, or none at all.
      </p>
      <p>
        Watch for the trap in 7(a): it covers only the purpose the data was given for. The same
        phone number can be fine for a receipt and off-limits for marketing.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The nine uses ------------------------------------------------------------------------------- */

export function NineUses() {
  const [s, set] = useSceneState<LegitState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="The nine legitimate uses"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-3">
          {USES.map((u) => (
            <button
              key={u.id}
              type="button"
              aria-pressed={s.use === u.id}
              onClick={() => set({ use: u.id })}
              className={cn(
                "rounded-lg border px-2.5 py-2 text-left text-xs transition",
                s.use === u.id
                  ? "border-accent bg-accent-soft"
                  : "border-line bg-surface hover:bg-surface-2",
              )}
            >
              <p className="font-semibold">{u.title}</p>
              <p
                className={cn(
                  "text-[10px]",
                  u.who === "State only" ? "text-accent" : "text-subtle",
                )}
              >
                {u.who}
              </p>
              {s.use === u.id && <p className="mt-1">{u.body}</p>}
            </button>
          ))}
        </div>
      }
    >
      <p>
        Section 7 is a closed list. Three clauses are for the government only; the rest are open to
        anyone. Click each to read it in plain words.
      </p>
      <p>
        Legitimate uses don&apos;t need a notice under section 5, but every other duty still
        applies: accuracy, security, breach reporting and erasure once the purpose is served. And
        data given under 7(a) still carries the rights to access and erasure.
      </p>
    </StepLayout>
  );
}

/* 4 ─ No catch-all --------------------------------------------------------------------------------- */

const GDPR = [
  "Consent",
  "Contract",
  "Legal obligation",
  "Vital interests",
  "Public task",
  "Legitimate interests",
];

export function NoCatchAll() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="No catch-all"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted text-[10px] uppercase">EU GDPR: six lawful bases</p>
            <ul className="mt-2 grid gap-1 text-xs">
              {GDPR.map((g) => (
                <li
                  key={g}
                  className={cn(
                    "rounded-md border px-2 py-1",
                    g === "Legitimate interests" || g === "Contract"
                      ? "border-accent bg-accent-soft"
                      : "border-line",
                  )}
                >
                  {g}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted text-[10px] uppercase">DPDP: two grounds</p>
            <ul className="mt-2 grid gap-1 text-xs">
              <li className="border-line rounded-md border px-2 py-1">Consent (s.6)</li>
              <li className="border-line rounded-md border px-2 py-1">
                Legitimate uses: a closed list (s.7)
              </li>
            </ul>
            <p className="text-muted mt-3 text-xs">
              No general &ldquo;contract&rdquo; ground and no &ldquo;legitimate interests&rdquo;.
              7(a) partly covers what a contract ground would.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Teams used to Europe&apos;s GDPR often lean on &ldquo;legitimate interests&rdquo; for things
        like analytics or fraud checks. The DPDP Act has no such catch-all.
      </p>
      <p>
        So for each processing purpose, an Indian app needs either consent or a specific clause of
        section 7. If neither fits, that&apos;s a sign to ask for consent, or not to process.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function LegitCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Consent needed?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="dpdp-legit"
            prompt="Does each job need consent, or does a legitimate use cover it?"
            categories={[
              { id: "consent", label: "Needs consent" },
              { id: "legit", label: "Legitimate use" },
            ]}
            items={[
              {
                id: "delivery",
                label: "Using a delivery address the customer typed in to deliver their order",
                category: "legit",
                why: "Given for that purpose: 7(a).",
              },
              {
                id: "ads",
                label: "Using that address to target local ads",
                category: "consent",
                why: "A new purpose.",
              },
              {
                id: "leave",
                label: "Recording an employee's leave days",
                category: "legit",
                why: "Employment: 7(i).",
              },
              {
                id: "ambulance",
                label: "Calling an ambulance with a guest's details during a heart attack",
                category: "legit",
                why: "Medical emergency: 7(f).",
              },
              {
                id: "heatmap",
                label: "Recording session replays of users' screens",
                category: "consent",
                why: "No s.7 clause covers it.",
              },
              {
                id: "order",
                label: "Producing records demanded by a court order",
                category: "legit",
                why: "Judgments and orders: 7(e).",
              },
            ]}
            explanation="Legitimate uses are a closed list. Anything outside it, especially a new purpose for data you already have, needs consent."
          />
        </div>
      }
    >
      <p>Sort each job.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ------------------------------------------------------------------------------------------ */

const POINTS: [string, string][] = [
  ["Two grounds only", "Consent, or a legitimate use in s.7."],
  ["7(a) is purpose-bound", "Given for a receipt isn't given for marketing."],
  ["Some uses are State-only", "Benefits and State functions."],
  ["No legitimate interests", "Unlike GDPR, there's no catch-all."],
  ["Duties still apply", "Security, accuracy, breaches and erasure."],
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
        That completes lawful processing. Next chapter: the fiduciary&apos;s duties, starting with
        how long you may keep data.
      </p>
    </StepLayout>
  );
}
