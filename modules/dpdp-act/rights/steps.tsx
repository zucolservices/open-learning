"use client";

import { motion } from "motion/react";
import { BookCopy, Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ACTION_LABEL, SYSTEMS, VERIFY, type Action } from "./model";
import type { RightsState } from "./state";

/* 1 ─ Story: the passbook -------------------------------------------------------------------------- */

export function Passbook() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Update my passbook"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <BookCopy className="text-accent size-10" />
          <div className="grid w-full max-w-sm gap-1.5 text-xs">
            {[
              "What do you have on me?",
              "Who did you share it with?",
              "That address is wrong, fix it.",
              "I've closed the account, delete what you don't need.",
            ].map((t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 * i }}
                className="border-line bg-surface rounded-lg border px-3 py-1.5"
              >
                &ldquo;{t}&rdquo;
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        At a bank you can ask to see your passbook, ask who your details were shared with, get a
        wrong address fixed, and, when you leave, expect them to stop holding what they no longer
        need. Each of those is a request someone at the bank has to act on.
      </p>
      <p>
        From May 2027 the DPDP Act gives people the{" "}
        <Term id="right-to-access">right to access</Term> information about their data, and the
        right to <Term id="right-to-erasure">correction and erasure</Term>. Answering honestly means
        finding every copy, which is where your data map pays off.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Answer the request ⭐ ------------------------------------------------------------------------ */

const ACTIONS: Action[] = ["erase", "keep", "rotate"];

export function AnswerRequest() {
  const [s, set] = useSceneState<RightsState>();
  const v = VERIFY.find((x) => x.id === s.verify);
  const verified = v?.ok ?? false;
  const inc = new Set(s.included);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Answer Asha's request"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            value={s.kind}
            onChange={(k) => set({ kind: k })}
            options={[
              ["access", "“What do you hold?”"],
              ["erase", "“Delete my data”"],
            ]}
            size="sm"
          />
          <div>
            <p className="text-muted text-[10px] uppercase">1 · Check it&apos;s really Asha</p>
            <div className="mt-1 grid gap-1">
              {VERIFY.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  aria-pressed={s.verify === x.id}
                  onClick={() => set({ verify: x.id })}
                  className={cn(
                    "rounded-lg border px-3 py-1 text-left text-xs",
                    s.verify !== x.id && "border-line hover:bg-surface-2",
                    s.verify === x.id && x.ok && "border-good/60 bg-good/10",
                    s.verify === x.id && !x.ok && "border-bad/60 bg-bad/10",
                  )}
                >
                  {x.label}
                  {s.verify === x.id && (
                    <span className="text-muted block text-[10px]">{x.why}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className={cn(!verified && "pointer-events-none opacity-40")}>
            <p className="text-muted text-[10px] uppercase">
              2 ·{" "}
              {s.kind === "access"
                ? "Include each system in the summary"
                : "Decide for each system"}
            </p>
            <div className="mt-1 grid gap-1">
              {SYSTEMS.map((sy) => {
                const a = s.actions[sy.id];
                return (
                  <div
                    key={sy.id}
                    className="border-line bg-surface rounded-lg border px-2.5 py-1.5 text-[11px]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span>
                        <span className="font-medium">{sy.name}</span>{" "}
                        <span className="text-subtle">· {sy.holds}</span>
                      </span>
                      {s.kind === "access" ? (
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={inc.has(sy.id)}
                            onChange={() =>
                              set({
                                included: inc.has(sy.id)
                                  ? s.included.filter((x) => x !== sy.id)
                                  : [...s.included, sy.id],
                              })
                            }
                            className="accent-accent"
                          />
                          include
                        </label>
                      ) : (
                        <span className="flex gap-1">
                          {ACTIONS.map((ac) => (
                            <button
                              key={ac}
                              type="button"
                              aria-pressed={a === ac}
                              onClick={() => set({ actions: { ...s.actions, [sy.id]: ac } })}
                              className={cn(
                                "rounded-full border px-2 py-0.5 text-[10px]",
                                a === ac
                                  ? ac === sy.best
                                    ? "border-good bg-good/15"
                                    : "border-bad bg-bad/15"
                                  : "border-line-strong text-muted",
                              )}
                            >
                              {ACTION_LABEL[ac]}
                            </button>
                          ))}
                        </span>
                      )}
                    </div>
                    {s.kind === "erase" && a && (
                      <p className="mt-0.5 flex items-start gap-1">
                        {a === sy.best ? (
                          <Check className="text-good size-3 shrink-0" />
                        ) : (
                          <X className="text-bad size-3 shrink-0" />
                        )}
                        {a === sy.best ? sy.why : `Better: ${ACTION_LABEL[sy.best]}. ${sy.why}`}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {s.kind === "access" && verified && (
            <div className="border-line bg-surface-2/60 rounded-lg border px-3 py-2 text-[11px]">
              <p className="font-semibold">Shared with (must be named):</p>
              {SYSTEMS.filter((x) => x.shared).map((x) => (
                <p key={x.id} className={cn(!inc.has(x.id) && "text-bad")}>
                  {x.shared} {inc.has(x.id) ? "" : "· missing from your summary"}
                </p>
              ))}
            </div>
          )}
        </div>
      }
    >
      <p>
        Asha, a SabziBox customer, sends a request. Verify it, then work through every system that
        holds Asha&apos;s data. Switch between an access request and an erasure request.
      </p>
      <p>
        An access answer is a summary of the data and the processing, plus the identities of every
        fiduciary and processor it was shared with and what was shared. An erasure answer often
        mixes &ldquo;done&rdquo; with &ldquo;kept, and here&apos;s why&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Who can ask, and how ------------------------------------------------------------------------- */

const HOW: [string, string][] = [
  [
    "Publish the route",
    "Your website or app must say how to make a request and which identifier you need, such as a registered mobile number.",
  ],
  [
    "Who can ask",
    "The person, a parent or guardian for a child, a guardian for a person with a disability, or a nominee after death or incapacity.",
  ],
  [
    "Deadlines",
    "Grievances must be answered within the period you publish, at most 90 days. The law sets no fixed deadline for access, correction or erasure; answer promptly.",
  ],
  ["Fees", "The Act and Rules mention none."],
  [
    "False requests",
    "Impersonating someone or filing false grievances breaches a person's own duties, with a penalty of up to ₹10,000.",
  ],
];

export function WhoCanAsk() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Who can ask, and how"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {HOW.map(([k, v], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface grid grid-cols-[6.5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-medium">{k}</span>
              <span>{v}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Rights only work if people can find the door. Rule 14 makes you publish how to make a
        request and what identifier you&apos;ll check. Build it into the app, not just a policy
        page.
      </p>
      <p>
        Verify against something you already hold. Asking for more personal data just to answer a
        privacy request defeats the purpose.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Rights the Act doesn't give ------------------------------------------------------------------ */

const NOT: [string, string][] = [
  ["Data portability", "No right to get your data in a reusable format to move it elsewhere."],
  ["Objection and restriction", "No right to object to, or restrict, processing."],
  ["Automated decisions", "No specific rule on decisions made by algorithms alone."],
];

export function NotInTheAct() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Rights the Act doesn't give"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {NOT.map(([k, v]) => (
            <div
              key={k}
              className="border-line bg-surface flex items-start gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <X className="text-subtle mt-0.5 size-4 shrink-0" />
              <span>
                <span className="font-semibold">{k}.</span> {v}
              </span>
            </div>
          ))}
          <p className="text-muted mt-1 text-xs">
            Also: the access and erasure rights cover data processed on consent or volunteered under
            7(a), not data held under the other legitimate uses.
          </p>
        </div>
      }
    >
      <p>
        If you&apos;ve built for Europe&apos;s GDPR, you&apos;ll notice gaps. The DPDP Act&apos;s
        rights are access, correction and erasure, grievance redressal and nomination. There&apos;s
        no portability, objection, restriction or automated-decision right.
      </p>
      <p>
        That doesn&apos;t stop you offering more. A data export many users ask for is good product
        design, even where the law doesn&apos;t demand it.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function RightsCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Erase, keep or rotate?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="dpdp-rights"
            prompt="A customer who closed their account asks you to erase their data. What do you do with each?"
            categories={[
              { id: "erase", label: "Erase now" },
              { id: "keep", label: "Keep, say why" },
              { id: "rotate", label: "As backups rotate" },
            ]}
            items={[
              {
                id: "wishlist",
                label: "Their wishlist and saved addresses",
                category: "erase",
                why: "No remaining purpose.",
              },
              {
                id: "kyc",
                label: "KYC records a law says to keep for five years",
                category: "keep",
                why: "Retention required by law.",
              },
              {
                id: "vendor",
                label: "The copy at your email-marketing vendor",
                category: "erase",
                why: "Cause your processor to erase.",
              },
              {
                id: "logs",
                label: "Last week's request logs",
                category: "keep",
                why: "Rule 8(3): at least a year.",
              },
              {
                id: "snap",
                label: "Nightly snapshots kept for 30 days",
                category: "rotate",
                why: "Suppress now; they age out.",
              },
              {
                id: "refund",
                label: "A refund still being processed",
                category: "keep",
                why: "Still needed for the purpose.",
              },
            ]}
            explanation="Erase what no longer serves a purpose, at your processors too; keep only what the purpose or a law still needs, and tell the person what and why."
          />
        </div>
      }
    >
      <p>Sort each item.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ------------------------------------------------------------------------------------------ */

const POINTS: [string, string][] = [
  ["Access: data, processing, recipients", "Name every fiduciary and processor it went to."],
  ["Correct, complete, update, erase", "Erasure can be refused only for purpose or law."],
  ["Verify with what you hold", "Don't collect more to check identity."],
  ["Find every copy", "Vendors and backups included."],
  ["No portability or objection", "Unlike GDPR."],
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
        Next: when someone isn&apos;t happy with your answer. Grievances, nomination and duties.
      </p>
    </StepLayout>
  );
}
