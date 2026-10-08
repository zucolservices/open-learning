"use client";

import { motion } from "motion/react";
import { Mail, Check, X, ArrowRight } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CHECKLIST, DRILL, FINDINGS, TODAY } from "./model";
import type { CapState } from "./state";

/* 1 ─ Story: the memo ------------------------------------------------------------------------------ */

export function Memo() {
  return (
    <StepLayout
      eyebrow="Story"
      title="“Ready by May 2027”"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="border-line bg-surface w-full max-w-sm rounded-xl border p-4 text-xs">
            <p className="text-muted flex items-center gap-1.5">
              <Mail className="size-3.5" /> From: the founder · To: engineering
            </p>
            <p className="mt-2 font-semibold">DPDP: we have until May 2027</p>
            <p className="mt-2">
              About 4 lakh students use PadhaiPal, many of them under 18. Parents and schools are
              asking about the new data law. Please audit the app and fix what isn&apos;t ready. I
              want a breach drill before the deadline too.
            </p>
            <p className="text-subtle mt-2">PadhaiPal and this memo are made up.</p>
          </div>
        </div>
      }
    >
      <p>
        It&apos;s October 2026. PadhaiPal, a made-up learning app for school students, has grown
        fast. The DPDP Act&apos;s core duties start in May 2027, and most of PadhaiPal&apos;s users
        are children.
      </p>
      <p>
        Over the next steps you&apos;ll audit it, fix what isn&apos;t ready, and run a breach drill,
        using everything in this track. Remember: this explains the law for engineers, and a real
        programme should also involve legal advice.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The audit ⭐ --------------------------------------------------------------------------------- */

export function Audit() {
  const [s, set] = useSceneState<CapState>();
  const f = FINDINGS.find((x) => x.id === s.open) ?? FINDINGS[0];
  const pick = s.fixes[f.id];
  const fixed = FINDINGS.filter((x) => s.fixes[x.id] === "good").length;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Audit PadhaiPal"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex items-center justify-between">
            <p className="text-muted text-[10px] uppercase">Twelve findings</p>
            <p className="text-xs font-medium">
              {fixed}/{FINDINGS.length} ready
            </p>
          </div>
          <div className="grid grid-cols-3 gap-1 sm:grid-cols-4">
            {FINDINGS.map((x) => {
              const p = s.fixes[x.id];
              return (
                <button
                  key={x.id}
                  type="button"
                  aria-pressed={x.id === f.id}
                  onClick={() => set({ open: x.id })}
                  className={cn(
                    "rounded-md border px-2 py-1 text-left text-[10px] transition",
                    x.id === f.id && "ring-accent ring-2",
                    !p && "border-line bg-surface",
                    p === "good" && "border-good/60 bg-good/10",
                    p === "bad" && "border-bad/60 bg-bad/10",
                  )}
                >
                  {x.area}
                </button>
              );
            })}
          </div>
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3"
          >
            <p className="text-sm font-medium">{f.problem}</p>
            <div className="mt-2 grid gap-1.5">
              {(f.id.length % 2 === 0
                ? (["good", "bad"] as const)
                : (["bad", "good"] as const)
              ).map((k) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={pick === k}
                  onClick={() => set({ fixes: { ...s.fixes, [f.id]: k } })}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-left text-xs",
                    pick !== k && "border-line hover:bg-surface-2",
                    pick === k && k === "good" && "border-good/60 bg-good/10",
                    pick === k && k === "bad" && "border-bad/60 bg-bad/10",
                  )}
                >
                  {k === "good" ? f.good : f.bad}
                </button>
              ))}
            </div>
            {pick && (
              <p className="mt-2 flex items-start gap-1.5 text-xs">
                {pick === "good" ? (
                  <Check className="text-good mt-0.5 size-3.5 shrink-0" />
                ) : (
                  <X className="text-bad mt-0.5 size-3.5 shrink-0" />
                )}
                <span>
                  {f.why} <span className="text-subtle font-mono">{f.law}</span>
                </span>
              </p>
            )}
          </motion.div>
        </div>
      }
    >
      <p>
        Your audit found twelve gaps. Open each and choose the fix. Wrong choices explain why; you
        can always change your answer.
      </p>
      <p>
        Notice how the fixes chain together. The data map makes retention, rights and breach notices
        possible; the age check makes every children&apos;s rule possible.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The drill ------------------------------------------------------------------------------------- */

export function Drill() {
  const [s, set] = useSceneState<CapState>();
  const idx = Math.min(s.at, DRILL.length - 1);
  const d = DRILL[idx];
  const pick = s.drill[d.id];
  const opt = d.options.find((o) => o.id === pick);
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="The breach drill"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-[10px] uppercase">
            Drill · decision {idx + 1} of {DRILL.length}
          </p>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-sm font-medium">{d.q}</p>
            <div className="mt-2 grid gap-1.5">
              {d.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={pick === o.id}
                  onClick={() => set({ drill: { ...s.drill, [d.id]: o.id } })}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-left text-xs",
                    pick !== o.id && "border-line hover:bg-surface-2",
                    pick === o.id && o.good && "border-good/60 bg-good/10",
                    pick === o.id && !o.good && "border-bad/60 bg-bad/10",
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          {opt && (
            <motion.p
              key={d.id + opt.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-1.5 text-xs"
            >
              {opt.good ? (
                <Check className="text-good mt-0.5 size-3.5 shrink-0" />
              ) : (
                <X className="text-bad mt-0.5 size-3.5 shrink-0" />
              )}
              {opt.result}
            </motion.p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!opt || idx >= DRILL.length - 1}
              onClick={() => set({ at: idx + 1 })}
              className="bg-accent text-accent-fg inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-medium disabled:opacity-40"
            >
              Carry on <ArrowRight className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => set({ at: 0, drill: {} })}
              className="border-line text-muted rounded-full border px-4 py-1.5 text-xs"
            >
              Start over
            </button>
          </div>
        </div>
      }
    >
      <p>
        Before the deadline, PadhaiPal runs a drill: what if the AI tutor vendor leaked
        students&apos; chat transcripts? Make three decisions.
      </p>
      <p>
        This is a <Term id="personal-data-breach">personal data breach</Term> at a processor,
        involving children: the case where the Act&apos;s rules on processors, children and breach
        notices all meet.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Already today -------------------------------------------------------------------------------- */

export function AlreadyToday() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What already applies today"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {TODAY.map(([k, v], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface grid grid-cols-[8rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{k}</span>
              <span>{v}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        May 2027 isn&apos;t the start of all obligations. CERT-In&apos;s rules, the old IT Act
        security rules and consumer law already apply, and consumer regulators have already fined an
        ed-tech company over dark patterns.
      </p>
      <p>
        So the readiness work isn&apos;t only about a future deadline. Much of it reduces risk
        today.
      </p>
    </StepLayout>
  );
}

/* 5 ─ The checklist --------------------------------------------------------------------------------- */

export function Checklist() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The whole track as a checklist"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {CHECKLIST.map(([ch, items], i) => (
            <motion.div
              key={ch}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="text-accent font-semibold">{ch}</p>
              <ul className="mt-1 grid gap-0.5">
                {items.map((it) => (
                  <li key={it} className="flex items-start gap-1.5">
                    <Check className="text-good mt-0.5 size-3 shrink-0" />
                    {it}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Here is the track on one page. Each line maps back to a module you can revisit when you
        build that part.
      </p>
      <p>Keep it next to your backlog. Most items are engineering tickets, not legal documents.</p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function CapCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which chapter fixes it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="dpdp-capstone"
            prompt="Which chapter of the track deals with each PadhaiPal problem?"
            categories={[
              { id: "lawful", label: "Lawful processing" },
              { id: "duties", label: "Fiduciary duties" },
              { id: "rights", label: "Rights" },
              { id: "special", label: "Special cases" },
            ]}
            items={[
              {
                id: "preticked",
                label: "A pre-ticked marketing box",
                category: "lawful",
                why: "Consent.",
              },
              {
                id: "unenc",
                label: "Unencrypted class recordings",
                category: "duties",
                why: "Security safeguards.",
              },
              {
                id: "grievance",
                label: "No grievance response period",
                category: "rights",
                why: "Grievance redressal.",
              },
              {
                id: "recs",
                label: "Behavioural recommendations for 12-year-olds",
                category: "special",
                why: "Children's data.",
              },
              {
                id: "vendor",
                label: "An AI vendor with no contract",
                category: "duties",
                why: "Processors.",
              },
              {
                id: "notice",
                label: "A notice buried in the privacy policy",
                category: "lawful",
                why: "Notice.",
              },
            ]}
            explanation="Every finding traces back to a chapter: lawful processing, the fiduciary's duties, people's rights, or the special cases such as children."
          />
        </div>
      }
    >
      <p>Sort each problem.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ------------------------------------------------------------------------------------------ */

const POINTS: [string, string][] = [
  ["Map first", "Everything else depends on it."],
  ["Children change everything", "Verify parents, no tracking, no shaming."],
  ["Write it into contracts", "Vendors are your responsibility."],
  ["Drill the breach", "Two clocks, every family told."],
  ["Start now", "Much already applies; the rest arrives in May 2027."],
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
        You&apos;ve finished the DPDP Act track. You can now read a system and see where the law
        touches it, and turn each duty into something you can build. Revisit any module as you work.
      </p>
    </StepLayout>
  );
}
