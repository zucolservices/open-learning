"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CASES, FIXES } from "./model";
import type { ValState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Doorman() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The doorman and the cloakroom ticket"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "Check at the door",
              "Tickets are checked on the way in. A smudged ticket gets a polite “please fill in the date”.",
            ],
            [
              "Don't hand over the logbook",
              "When something goes wrong inside, guests get an apology and a reference number, not the staff's private notes.",
            ],
          ].map(([t, b]) => (
            <div key={t} className="border-line bg-surface rounded-xl border p-3 text-xs">
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </div>
          ))}
        </div>
      }
    >
      <p>
        A good venue checks tickets at the door, explains problems kindly, and never shows guests
        its internal logbook, even when something breaks.
      </p>
      <p>
        Services should do the same. Everything from outside is untrusted:{" "}
        <Term id="input-validation">validate</Term> it where it enters, explain problems clearly,
        and keep internal details in your logs. A standard format,{" "}
        <Term id="problem-details">problem details</Term>, makes errors consistent.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix ⭐ --------------------------------------------------------------------------------------- */

export function FixEndpoint() {
  const [s, set] = useSceneState<ValState>();
  const toggle = (id: string) =>
    set({ fixed: s.fixed.includes(id) ? s.fixed.filter((x) => x !== id) : [...s.fixed, id] });
  const results = CASES.map((c) => ({ ...c, r: c.outcome(s.fixed) }));
  const all = results.every((r) => r.r.ok);
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Harden POST /orders"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-[2fr_3fr]">
          <div className="grid content-start gap-1">
            {FIXES.map((f) => {
              const on = s.fixed.includes(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(f.id)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-left text-xs",
                    on ? "border-good/50 bg-good/10" : "border-line bg-surface",
                  )}
                >
                  <span className="font-medium">{f.label}</span>
                  {on && <span className="text-muted block text-[10px]">{f.note}</span>}
                </button>
              );
            })}
          </div>
          <div className="grid content-start gap-1">
            {results.map((c) => (
              <div
                key={c.id}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs",
                  c.r.ok ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/10",
                )}
              >
                <p className="flex items-center gap-1 font-mono text-[10.5px]">
                  {c.r.ok ? (
                    <Check className="text-good size-3.5 shrink-0" />
                  ) : (
                    <X className="text-bad size-3.5 shrink-0" />
                  )}
                  {c.input}
                </p>
                <p className="text-muted text-[10.5px]">{c.r.text}</p>
              </div>
            ))}
            {all && (
              <p className="text-good text-xs">
                Bad input is refused with a clear reason; surprises fail closed without leaking
                anything.
              </p>
            )}
          </div>
        </div>
      }
    >
      <p>
        Five bad requests hit a café&apos;s order endpoint. Right now some crash with stack traces
        and some quietly save nonsense. Switch on fixes and watch each response change.
      </p>
      <p>
        Note the difference: validation stops bad input; the error handler is a safety net for bugs
        you haven&apos;t found yet.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Problem details ------------------------------------------------------------------------------ */

export function Problem() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="One error format for every endpoint"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <pre className="border-line bg-surface overflow-x-auto rounded-lg border p-3 font-mono text-[10.5px]">
            {
              'HTTP/1.1 422 Unprocessable Content\nContent-Type: application/problem+json\n\n{\n  "type": "https://api.chaicorner.example/problems/invalid-order",\n  "title": "Your order has invalid fields",\n  "status": 422,\n  "detail": "qty must be at least 1",\n  "instance": "/orders/requests/7f3a",\n  "errors": [{ "field": "qty", "message": "must be at least 1" }]\n}'
            }
          </pre>
          <div className="grid gap-1 text-xs">
            {[
              [
                "Built in",
                "Spring (ProblemDetail) and ASP.NET Core (AddProblemDetails) speak it natively.",
              ],
              [
                "A small handler",
                "Express, FastAPI and Django need a few lines; FastAPI's default 422 is plain JSON.",
              ],
            ].map(([t, b]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-1.5">
                <span className="font-semibold">{t}</span>
                <span className="text-muted"> · {b}</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        RFC 9457 (2023) defines a standard JSON shape for API errors: a type, a short title, the
        status, a human-readable detail, and any extra fields such as per-field errors.
      </p>
      <p>
        Whether you use 400 or 422 for validation failures, be consistent across the whole API.
        Frameworks differ: FastAPI uses 422; ASP.NET Core and Spring use 400.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Libraries ------------------------------------------------------------------------------------ */

export function Libraries() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Parse, don't just check"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "TypeScript",
              "Zod 4 (stable July 2025): a schema turns unknown JSON into a typed object or a list of errors.",
            ],
            ["Python", "Pydantic 2, used by FastAPI: type hints become validation."],
            [
              "Java",
              "Jakarta Validation 3.1 annotations such as @NotNull and @Min, with Hibernate Validator.",
            ],
            [
              ".NET",
              "Built-in validation for minimal APIs since .NET 10; FluentValidation 12 for richer rules.",
            ],
            [
              "Fail closed",
              "OWASP's 2025 Top 10 added Mishandling of Exceptional Conditions: on an unexpected error, deny and roll back.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
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
        &ldquo;Parse, don&apos;t validate&rdquo;: instead of checking fields one by one all over the
        code, turn raw input into a typed object once, at the edge. Everything inside can then trust
        it.
      </p>
      <p>
        Validate on the server even if the app validates too; anyone can send a request without the
        app.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function ValCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Response or logs?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="backend-errors"
            prompt="Where should each piece of information go when a request fails?"
            categories={[
              { id: "response", label: "In the response" },
              { id: "logs", label: "Logs only" },
            ]}
            items={[
              {
                id: "field",
                label: "Which field is wrong and why",
                category: "response",
                why: "Helps the caller fix it.",
              },
              {
                id: "stack",
                label: "The stack trace",
                category: "logs",
                why: "Reveals internals to attackers.",
              },
              {
                id: "sql",
                label: "The SQL query that failed",
                category: "logs",
                why: "Exposes your schema.",
              },
              {
                id: "id",
                label: "A correlation ID for support",
                category: "response",
                why: "Lets support find the matching log entry.",
              },
              {
                id: "host",
                label: "Internal server hostnames",
                category: "logs",
                why: "Useful to attackers, useless to callers.",
              },
            ]}
            explanation="Tell callers what they can act on, plus an ID. Keep everything about your internals in the logs."
          />
        </div>
      }
    >
      <p>Sort each item.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Untrusted until checked", "Validate at the boundary."],
        ["Parse into types", "Then trust inside."],
        ["Rules in the service", "Shape at the edge, meaning inside."],
        ["Problem details", "One consistent error format."],
        ["Never leak internals", "Generic message plus an ID."],
      ]}
    >
      <p>Next: configuration and secrets.</p>
    </WrapStep>
  );
}
