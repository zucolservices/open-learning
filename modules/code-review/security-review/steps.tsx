"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { Diff, parseDiff } from "../_shared/diff";
import { DIFF, QUESTIONS, VERDICTS } from "./model";
import type { SecState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Locksmith() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The builder and the burglar"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "The builder checks",
              "Do the doors open? Do the windows close? Is the light switch where the plan says?",
            ],
            [
              "The burglar checks",
              "Which window has a weak latch? Is there a key under the mat? Does anyone check who comes in?",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className={cn(
                "rounded-xl border p-3 text-xs",
                i ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A house can pass every builder&apos;s check and still be easy to break into. The builder
        asks &ldquo;does it work?&rdquo;; the burglar asks &ldquo;how could it be misused?&rdquo;
      </p>
      <p>
        Most reviews only ask the builder&apos;s question. A security pass adds the other one, and
        it focuses on <Term id="trust-boundary">trust boundaries</Term>: the places where data from
        outside, which could be anything, enters your code.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Review ⭐ ------------------------------------------------------------------------------------ */

export function Refund() {
  const [s, set] = useSceneState<SecState>();
  const lines = parseDiff(DIFF);
  const q = QUESTIONS.find((x) => !s.found.includes(x.id));
  const click = (i: number) => {
    if (!q) return;
    if (q.lines.includes(i)) set({ found: [...s.found, q.id], miss: null });
    else set({ miss: i });
  };
  const comments: Record<number, React.ReactNode> = {};
  for (const x of QUESTIONS.filter((x) => s.found.includes(x.id)))
    comments[x.lines[0]] = (
      <span>
        <span className="text-bad font-semibold">issue (blocking): </span>
        {x.comment}
      </span>
    );
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="A security pass on a refund endpoint"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {q ? (
            <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
              <p className="text-muted text-[10px] font-medium">
                Question {s.found.length + 1} of {QUESTIONS.length} · click the line
              </p>
              <p>{q.ask}</p>
              {s.miss !== null && (
                <p className="text-muted mt-1 text-[10px]">Not that line. {q.hint}</p>
              )}
            </div>
          ) : (
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="mb-1 font-medium">Four blocking issues found. Your verdict:</p>
              <div className="flex flex-wrap gap-1">
                {VERDICTS.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    aria-pressed={s.verdict === v.id}
                    onClick={() => set({ verdict: v.id })}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs",
                      s.verdict === v.id
                        ? v.best
                          ? "border-good bg-good/20"
                          : v.id === "approve"
                            ? "border-bad bg-bad/15"
                            : "border-line-strong bg-surface-2"
                        : "border-line-strong text-muted",
                    )}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
              {s.verdict && (
                <motion.p
                  key={s.verdict}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "mt-1.5",
                    VERDICTS.find((v) => v.id === s.verdict)!.best ? "text-good" : "text-muted",
                  )}
                >
                  {VERDICTS.find((v) => v.id === s.verdict)!.result}
                </motion.p>
              )}
            </div>
          )}
          <Diff
            path="src/refunds.ts"
            lines={lines}
            comments={comments}
            onLine={q ? click : undefined}
            selected={s.miss !== null && q ? [s.miss] : undefined}
          />
          {s.found.length > 0 && (
            <button
              type="button"
              onClick={() => set({ found: [], miss: null, verdict: null })}
              className="text-muted self-start text-[10px] underline"
            >
              Start the review again
            </button>
          )}
        </div>
      }
    >
      <p>
        This change adds refunds. It works: the happy-path tests pass. Now do a security pass by
        asking four questions, one at a time, and click the line each one points to.
      </p>
      <p>
        These four questions (input, permission, secrets, leaks) catch a large share of common
        problems without any special training. Then decide what to do.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Tools and people ----------------------------------------------------------------------------- */

export function ToolsPeople() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What tools catch, and what needs a person"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Tools are good at patterns</p>
            <ul className="text-muted mt-1 list-disc space-y-0.5 pl-4">
              <li>Keys and passwords in code</li>
              <li>Known-vulnerable dependency versions</li>
              <li>Unsafe ways of building database queries</li>
              <li>Risky functions and settings</li>
            </ul>
          </div>
          <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">People are needed for meaning</p>
            <ul className="text-muted mt-1 list-disc space-y-0.5 pl-4">
              <li>Can user A see user B&apos;s data?</li>
              <li>Can a refund exceed the payment?</li>
              <li>Does this new flow skip a step?</li>
              <li>What happens if it&apos;s called a thousand times?</li>
            </ul>
          </div>
        </div>
      }
    >
      <p>
        <Term id="sast">Static analysis</Term> and <Term id="secret-scanning">secret scanning</Term>{" "}
        run on every pull request: GitHub code scanning and secret protection, GitLab SAST and
        secret detection, Semgrep, SonarQube, Snyk Code, gitleaks and others. Some can block a
        secret before it&apos;s even pushed.
      </p>
      <p>
        They can&apos;t know your business rules. Missing{" "}
        <Term id="authorisation">authorisation</Term> checks and logic flaws, like the refund
        amount, still need a human who understands what the code is for.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Specialists ---------------------------------------------------------------------------------- */

export function Specialist() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="When to call in a specialist"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            "Sign-in, sessions and permissions",
            "Payments and money movement",
            "Cryptography",
            "Personal or sensitive data",
            "A new way for outside data to enter",
            "File uploads and parsing",
          ].map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
            >
              {t}
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Security review is hard even for professionals. In a 2013 Berkeley experiment, 30 paid
        developers reviewed the same small web app; not one found every known vulnerability, and
        more years of experience didn&apos;t predict better results.
      </p>
      <p>
        So every reviewer does the quick pass, and changes in these areas also get a specialist. The
        OWASP Secure Code Review Cheat Sheet is a practical, free checklist; the longer OWASP Code
        Review Guide (v2, 2017) is still its current edition.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function SecCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Tool or person?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="review-security"
            prompt="Which is each problem more reliably caught by?"
            categories={[
              { id: "tool", label: "An automated tool" },
              { id: "human", label: "A human reviewer" },
            ]}
            items={[
              {
                id: "key",
                label: "An API key committed in a config file",
                category: "tool",
                why: "Secret scanning matches key patterns.",
              },
              {
                id: "invoice",
                label: "Any user can open another user's invoice by changing the number",
                category: "human",
                why: "Needs to know who should see what.",
              },
              {
                id: "dep",
                label: "A library version with a published vulnerability",
                category: "tool",
                why: "Dependency scanners check versions.",
              },
              {
                id: "refund",
                label: "A refund can be larger than the original payment",
                category: "human",
                why: "A business rule.",
              },
              {
                id: "sql",
                label: "User input glued straight into a database query string",
                category: "tool",
                why: "A well-known pattern static analysis looks for.",
              },
            ]}
            explanation="Let tools catch the patterns on every change. Human reviewers bring what tools can't: who should be allowed to do what, and the rules of the business."
          />
        </div>
      }
    >
      <p>Sort each problem.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Think like a burglar", "How could this be misused?"],
        ["Four quick questions", "Input, permission, secrets, leaks."],
        ["Tools for patterns", "Scanners on every pull request."],
        ["People for meaning", "Authorisation and business logic."],
        ["Specialists for risky areas", "Money, sign-in, crypto, personal data."],
      ]}
    >
      <p>
        That ends the chapter on what to review. Next: why waiting for review is the hidden cost.
      </p>
    </WrapStep>
  );
}
