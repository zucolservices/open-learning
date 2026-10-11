"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FIXES } from "./model";
import type { FormState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Counter() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The helpful clerk"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "Unhelpful clerk",
              "Takes your form, glances, hands it back torn up: “Wrong. Do it again.”",
              "border-bad/40 bg-bad/10",
            ],
            [
              "Helpful clerk",
              "Circles the one box you missed: “Your date of birth needs the year too.” Keeps the rest.",
              "border-good/50 bg-good/10",
            ],
          ].map(([t, b, c]) => (
            <div key={t} className={cn("rounded-xl border p-3 text-xs", c)}>
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </div>
          ))}
        </div>
      }
    >
      <p>
        Two clerks at a bank counter check the same form. One rejects it without explaining; the
        other points at exactly what to fix and keeps everything else.
      </p>
      <p>
        Online forms are where people do real work: sign up, pay, apply. Good{" "}
        <Term id="form-validation">validation</Term> behaves like the helpful clerk, for everyone,
        including people using keyboards and screen readers.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix the form ⭐ ------------------------------------------------------------------------------ */

export function FixForm() {
  const [s, set] = useSceneState<FormState>();
  const on = (id: string) => s.fixed.includes(id);
  const toggle = (id: string) =>
    set({ fixed: on(id) ? s.fixed.filter((x) => x !== id) : [...s.fixed, id], submitted: false });
  const sr = on("labels")
    ? `“Email address, edit text${s.submitted ? ", Error: Enter an email address in the correct format, like name@example.com" : ""}”`
    : "“Edit text, blank”";
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Rescue a sign-up form"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-2">
          <div className="grid gap-1">
            {FIXES.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={on(f.id)}
                onClick={() => toggle(f.id)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-left text-xs",
                  on(f.id) ? "border-good/50 bg-good/10" : "border-line bg-surface",
                )}
              >
                <span className={on(f.id) ? "text-subtle line-through" : ""}>{f.problem}</span>
                {on(f.id) && (
                  <span className="text-good block text-[11px]">
                    → {f.fix}. {f.why}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="border-line bg-surface flex flex-col gap-2 rounded-lg border p-3 text-xs">
            {s.submitted && on("timing") && (
              <div className="border-bad/50 bg-bad/10 rounded border px-2 py-1 text-[11px]">
                <p className="font-semibold">There is a problem</p>
                <p className="underline">Enter an email address in the correct format</p>
              </div>
            )}
            {(["Full name", "Email address", "Phone"] as const).map((f, i) => (
              <div key={f}>
                {on("labels") && <p className="mb-0.5 font-medium">{f}</p>}
                <div
                  className={cn(
                    "border-line-strong rounded border px-2 py-1 font-mono text-[11px]",
                    s.submitted && i === 1 && "border-bad",
                  )}
                >
                  {s.submitted && !on("keep") ? (
                    <span className="text-subtle">{on("labels") ? "" : f}</span>
                  ) : (
                    ["Asha Rao", "asha.rao.example.com", "98765 43210"][i]
                  )}
                </div>
                {i === 1 && (s.submitted || !on("timing")) && (
                  <p className="text-bad mt-0.5 text-[10px]">
                    {on("messages")
                      ? "Enter an email address in the correct format, like name@example.com"
                      : "Invalid input"}
                  </p>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => set({ submitted: true })}
              className="border-line-strong self-start rounded-full border px-3 py-1"
            >
              Create account
            </button>
            <p className="text-muted text-[10px]">Screen reader on the email field: {sr}</p>
            <p className="text-muted text-[10px]">
              Phone keyboard:{" "}
              {on("types")
                ? "@ key for email, number pad for phone"
                : "full letter keyboard everywhere"}
            </p>
            {s.submitted && (
              <p className={cn("text-[10px]", on("server") ? "text-good" : "text-bad")}>
                {on("server")
                  ? "The server checks too, so a modified request can't sneak in bad data."
                  : "Only the browser checked. A modified request would skip every rule."}
              </p>
            )}
          </div>
        </div>
      }
    >
      <p>
        Asha (made up) is signing up and has mistyped her email. This form has six problems. Fix
        them one at a time, pressing Create account after each to see what she experiences.
      </p>
      <p>
        Watch the screen reader line too: that&apos;s what a blind user hears on the email field.
      </p>
    </StepLayout>
  );
}

/* 3 ─ When to validate ----------------------------------------------------------------------------- */

export function When() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="When and how to show errors"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Validate on submit",
              "GOV.UK's guidance: don't check as people leave each field; wait until they try to continue.",
            ],
            [
              "Summary at the top",
              "Heading “There is a problem”, each error linked to its field, focus moved there.",
            ],
            [
              "Message by each field",
              "Same wording, linked with aria-describedby so screen readers read it.",
            ],
            [
              ":user-invalid",
              "CSS that only marks a field after someone has interacted with it; safe to use widely since May 2026.",
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
        Browsers can check required fields, email formats and patterns on their own. That&apos;s a
        good baseline, but their pop-up bubbles are hard to style and word well.
      </p>
      <p>
        So the UK government design system turns the bubbles off (with novalidate) and shows its own
        tested error summary and messages. Either way, always validate again on the server.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Controlled ----------------------------------------------------------------------------------- */

export function Controlled() {
  const [s, set] = useSceneState<FormState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Who holds the value: you or the browser?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<string>
            size="sm"
            value={s.controlled ? "c" : "u"}
            onChange={(v) => set({ controlled: v === "c" })}
            options={[
              ["u", "Uncontrolled"],
              ["c", "Controlled"],
            ]}
          />
          <pre className="border-line bg-surface overflow-x-auto rounded-lg border p-3 font-mono text-[10.5px]">
            {s.controlled
              ? 'const [email, setEmail] = useState("");\n<input value={email}\n       onChange={(e) => setEmail(e.target.value)} />\n// your state is the source of truth on every keystroke'
              : '<form action={signUp}>\n  <input name="email" type="email" defaultValue="" />\n</form>\n// the browser holds the value; read it on submit as FormData'}
          </pre>
          <p className="text-muted text-xs">
            {s.controlled
              ? "Use when you need the value as it changes: live formatting, or fields that depend on each other."
              : "Simpler and often enough. React 19's form actions are built around this."}
          </p>
        </div>
      }
    >
      <p>
        A <Term id="controlled-input">controlled input</Term> gets its value from your state; an
        uncontrolled one lets the browser keep it until you read it. Vue&apos;s v-model and
        Svelte&apos;s bind:value are controlled-style shortcuts.
      </p>
      <p>Angular made signal-based forms stable in version 22 (June 2026).</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function FormCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Helpful or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="frontend-forms"
            prompt="Does each practice help or hurt people filling in a form?"
            categories={[
              { id: "help", label: "Helps" },
              { id: "hurt", label: "Hurts" },
            ]}
            items={[
              {
                id: "label",
                label: "A visible label above every field",
                category: "help",
                why: "Stays visible and names the field for screen readers.",
              },
              {
                id: "ph",
                label: "Using placeholder text as the only label",
                category: "hurt",
                why: "Disappears on typing.",
              },
              {
                id: "msg",
                label: "“Enter a date of birth in the past”",
                category: "help",
                why: "Says what to fix.",
              },
              {
                id: "clear",
                label: "Clearing the form when there's an error",
                category: "hurt",
                why: "Forces retyping.",
              },
              {
                id: "client",
                label: "Skipping server checks because the browser already validates",
                category: "hurt",
                why: "Browser checks can be bypassed.",
              },
            ]}
            explanation="Clear labels, specific messages and kept input help everyone. Server validation is a must, not a duplicate."
          />
        </div>
      }
    >
      <p>Sort each practice.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Real labels", "Not placeholders."],
        ["Right input types", "Better keyboards and checks."],
        ["Errors on submit", "Summary plus message by the field."],
        ["Say how to fix it", "And keep what they typed."],
        ["Server checks always", "Browser checks are a convenience."],
      ]}
    >
      <p>That ends the chapter on interfaces. Next: fetching data without glitches.</p>
    </WrapStep>
  );
}
