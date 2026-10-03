"use client";

import { motion } from "motion/react";
import { Check, RotateCcw, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { AFTER, BEFORE, CASES, MEMBERS } from "./model";
import type { ErrState } from "./state";

/* 1 ─ A helpful no -------------------------------------------------------------------------------- */

export function HelpfulNo() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A helpful no"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-bad/40 bg-bad/5 rounded-xl border px-4 py-3">
            <p className="text-bad text-xs font-semibold">Shop A</p>
            <p className="mt-2 text-sm">&ldquo;Can&apos;t help you.&rdquo;</p>
            <p className="text-muted mt-2 text-xs">
              Is it out of stock? The wrong size? Closed? You have to guess, or ask again.
            </p>
          </div>
          <div className="border-good/40 bg-good/5 rounded-xl border px-4 py-3">
            <p className="text-good text-xs font-semibold">Shop B</p>
            <p className="mt-2 text-sm">
              &ldquo;We&apos;re out of size 9. Size 9 arrives Tuesday; size 9.5 is here now.&rdquo;
            </p>
            <p className="text-muted mt-2 text-xs">What happened, why, and what you can do next.</p>
          </div>
        </div>
      }
    >
      <p>
        Every shop says no sometimes. The good ones say it in a way you can act on. An API&apos;s
        answers are read by programs first and people second, so they need both: a number a program
        can branch on, and words a developer can understand.
      </p>
      <p>
        The number is the <Term id="status-code">status code</Term>. The words go in a structured
        error body. Get both right and clients know whether to fix their request, sign in again,
        wait and retry, or give up.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Answer the requests ⭐ ---------------------------------------------------------------------- */

export function PickCode() {
  const [s, set] = useSceneState<ErrState>();
  const answers = s.answers ?? {};
  const done = Object.keys(answers).length;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Answer the requests"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="flex items-center justify-between">
            <p className="text-muted font-mono text-[10px]">
              {done}/{CASES.length} answered
            </p>
            {done > 0 && (
              <button
                type="button"
                onClick={() => set({ answers: {} })}
                className="text-muted flex items-center gap-1 text-xs"
              >
                <RotateCcw className="size-3" /> Start again
              </button>
            )}
          </div>
          {CASES.map((c) => {
            const a = answers[c.id];
            const ok = a !== undefined && c.right.includes(a);
            return (
              <div
                key={c.id}
                className={cn(
                  "rounded-lg border px-3 py-2",
                  a === undefined
                    ? "border-line bg-surface"
                    : ok
                      ? "border-good/50 bg-good/5"
                      : "border-bad/50 bg-bad/5",
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs">
                    <span className="font-mono text-[11px] font-semibold">{c.req}</span>{" "}
                    <span className="text-muted">{c.what}</span>
                  </p>
                  <div className="flex gap-1">
                    {c.options.map((o) => (
                      <button
                        key={o}
                        type="button"
                        onClick={() => set({ answers: { ...answers, [c.id]: o } })}
                        className={cn(
                          "rounded-md border px-2 py-0.5 font-mono text-[11px]",
                          a === o
                            ? ok
                              ? "border-good bg-good/20"
                              : "border-bad bg-bad/20"
                            : "border-line hover:bg-surface-2",
                        )}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
                {a !== undefined && (
                  <p className="mt-1 flex gap-1 text-[11px]">
                    {ok ? (
                      <Check className="text-good mt-0.5 size-3 shrink-0" />
                    ) : (
                      <X className="text-bad mt-0.5 size-3 shrink-0" />
                    )}
                    <span className="text-muted">{c.why}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      }
    >
      <p>
        You run an orders API. Eight things happen; pick the status code each response should carry.
        Change your answer as often as you like.
      </p>
      <p>
        The rough guide from earlier still holds: 2xx it worked, 4xx the client should change
        something, 5xx the server failed. The exact code tells clients <em>what</em> to change, or
        whether waiting will help.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Fix the error ------------------------------------------------------------------------------- */

export function FixError() {
  const [s, set] = useSceneState<ErrState>();
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Fix the error"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div>
            <Segmented<"before" | "after">
              size="sm"
              value={s.after ? "after" : "before"}
              onChange={(v) => set({ after: v === "after" })}
              options={[
                ["before", "Before"],
                ["after", "Problem Details"],
              ]}
            />
          </div>
          <Code>{s.after ? AFTER : BEFORE}</Code>
          {s.after ? (
            <div className="grid gap-1 sm:grid-cols-2">
              {MEMBERS.map(([k, d]) => (
                <p key={k} className="text-[11px]">
                  <span className="font-mono font-semibold">{k}</span>{" "}
                  <span className="text-muted">{d}</span>
                </p>
              ))}
            </div>
          ) : (
            <p className="text-bad text-xs">
              200 OK says it worked; the body says it didn&apos;t. Monitoring counts a success,
              caches may store it, and the client has nothing to act on.
            </p>
          )}
        </div>
      }
    >
      <p>
        A transfer fails because the account doesn&apos;t have enough money. Compare a common bad
        answer with one that follows <Term id="problem-details">Problem Details</Term>, RFC 9457
        (2023), the standard format for HTTP API errors.
      </p>
      <p>
        Its <code>type</code> is &ldquo;a URI reference that identifies the problem type&rdquo;.
        Clients act on that and the status; the human-readable fields are for people. Stripe&apos;s
        errors follow the same idea: a category, a machine-readable code, a message, the parameter
        at fault and a link to the docs.
      </p>
    </StepLayout>
  );
}

/* 4 ─ PUT, PATCH and redirects -------------------------------------------------------------------- */

const ITEMS: [string, string, string][] = [
  [
    "PUT /members/9",
    "Replace the whole member with this body",
    "Idempotent: sending it twice leaves the same result.",
  ],
  [
    "PATCH /members/9",
    "Change only the fields I send",
    "Not idempotent in general (RFC 5789). With JSON Merge Patch, a null value removes a field.",
  ],
  [
    "POST /members",
    "Create one; the server picks the ID",
    "Neither safe nor idempotent: a retry may create a second member.",
  ],
  [
    "301 vs 308",
    "Both mean 'moved permanently'",
    "With 301, clients may turn a POST into a GET on the new URL; 308 keeps the method.",
  ],
];

export function MethodMeaning() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="PUT, PATCH and redirects"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {ITEMS.map(([t, d, n], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="font-mono text-xs font-semibold">{t}</p>
              <p className="text-sm">{d}</p>
              <p className="text-muted text-xs">{n}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Methods are promises too. RFC 9110 calls a method idempotent &ldquo;if the intended effect
        on the server of multiple identical requests with that method is the same as the effect for
        a single such request.&rdquo;
      </p>
      <p>
        Choosing the right one tells clients, proxies and retry logic what is safe to repeat. Module
        8 shows how to make even a POST safe to retry.
      </p>
    </StepLayout>
  );
}

/* 5 ─ The best response --------------------------------------------------------------------------- */

export function BestResponse() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The best response"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="best-response"
            prompt="A client asks to register a member with an email address that's already taken. Which response is best?"
            options={[
              {
                id: "ok",
                label: '200 OK with { "success": false }',
                feedback:
                  "Says success and failure at once; monitoring and clients will believe the 200.",
              },
              {
                id: "server",
                label: "500 Internal Server Error",
                feedback:
                  "Blames the server, and invites pointless retries. Nothing failed on the server side.",
              },
              {
                id: "problem",
                label:
                  "409 Conflict with a Problem Details body: type, title and a detail naming the email field",
                correct: true,
                feedback:
                  "The code says it clashes with existing data; the body says exactly what to change.",
              },
              {
                id: "text",
                label: "400 with a plain-text body: “error”",
                feedback: "Right family, but the client can't tell what to fix.",
              },
            ]}
            explanation="Use a code that matches what happened, and a structured body that says what to do next."
          />
        </div>
      }
    >
      <p>Programs read the code; people read the body.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["The code must be true", "Never 200 for a failure."],
  ["4xx vs 5xx", "Client should change the request, or the server failed."],
  ["Precise codes help", "401 sign in, 403 not allowed, 409 conflict, 503 try later."],
  ["Problem Details", "type, title, status, detail, instance."],
  ["Methods are promises", "PUT and DELETE idempotent; POST and PATCH not."],
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
      <p>Next: the shape of the data itself, and the traps hidden in money, dates and IDs.</p>
    </StepLayout>
  );
}
