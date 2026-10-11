"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CHANGES, CHECKS, type ChangeId } from "./model";
import type { UiState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Directions() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Directions that survive a repaint"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">“Third door on the left, the blue one”</p>
            <p className="text-muted">Breaks the day someone repaints or adds a door.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">“The door marked Pharmacy”</p>
            <p className="text-muted">
              Works whatever colour it is and wherever it moves, and a visitor can follow it too.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        Directions based on paint colour and position break with every refurbishment. Directions
        based on the sign on the door keep working, because the sign is what visitors use.
      </p>
      <p>
        UI tests are the same. Find elements the way a person does, by their label or their role and
        name (&ldquo;the button called Create account&rdquo;), not by CSS classes or position. As a
        bonus, those are the same things screen readers rely on, so the tests push you towards{" "}
        <Term id="accessibility">accessible</Term> markup.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Redesign the form ⭐ -------------------------------------------------------------------------- */

function SignUpForm({ changes }: { changes: ChangeId[] }) {
  const has = (c: ChangeId) => changes.includes(c);
  const cls = (oldC: string, newC: string) => (has("classes") ? newC : oldC);
  const field = (id: string, label: string, type: string) => (
    <div key={id} className="grid gap-0.5">
      {!has("placeholder") && (
        <label htmlFor={`ui-${id}`} className="text-[11px] font-medium">
          {label}
        </label>
      )}
      <input
        id={`ui-${id}`}
        type={type}
        placeholder={has("placeholder") ? label : undefined}
        readOnly
        className="border-line-strong bg-surface rounded border px-2 py-1 text-xs"
      />
    </div>
  );
  const fields = [
    field("name", "Name", "text"),
    field("email", "Email", "email"),
    field("phone", "Phone", "tel"),
  ];
  const ordered = has("reorder") ? [fields[0], fields[2], fields[1]] : fields;
  return (
    <form className="grid gap-2" onSubmit={(e) => e.preventDefault()}>
      {ordered}
      <button
        type="button"
        className={cn(
          cls("btn-primary-x7f", "ds-button ds-button--primary"),
          "bg-accent text-accent-fg rounded px-3 py-1.5 text-xs font-medium",
        )}
      >
        {has("text") ? "Sign up" : "Create account"}
      </button>
    </form>
  );
}

export function Redesign() {
  const [s, set] = useSceneState<UiState>();
  const ref = useRef<HTMLDivElement>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  useEffect(() => {
    if (!ref.current) return;
    const root = ref.current;
    setResults(Object.fromEntries(CHECKS.map((c) => [c.id, c.run(root)])));
  }, [s.changes]);
  const toggle = (id: ChangeId) =>
    set({
      changes: s.changes.includes(id) ? s.changes.filter((x) => x !== id) : [...s.changes, id],
    });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Redesign a form and see which tests break"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-3 sm:grid-cols-[1fr_1.3fr]">
            <div ref={ref} className="border-line bg-surface rounded-lg border p-3">
              <SignUpForm changes={s.changes} />
            </div>
            <div className="grid content-start gap-1">
              {CHANGES.map((c) => (
                <label
                  key={c.id}
                  className={cn(
                    "flex items-start gap-1.5 rounded-lg border px-2.5 py-1 text-xs",
                    s.changes.includes(c.id)
                      ? "border-accent bg-accent-soft"
                      : "border-line bg-surface",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={s.changes.includes(c.id)}
                    onChange={() => toggle(c.id)}
                    className="accent-accent mt-0.5"
                  />
                  <span>
                    {c.label}
                    <span className="text-muted block text-[10px]">
                      {c.userVisible ? "Users would notice" : "Users wouldn't notice"}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {(["selector", "user"] as const).map((style) => (
              <div key={style} className="border-line bg-surface rounded-lg border px-3 py-2">
                <p className="text-muted mb-1 text-[10px] font-medium">
                  {style === "selector" ? "Tests by CSS selector" : "Tests by role and label"}
                </p>
                {CHECKS.filter((c) => c.style === style).map((c) => (
                  <p key={c.id} className="flex items-start gap-1.5 font-mono text-[10px]">
                    {results[c.id] ? (
                      <Check className="text-good mt-0.5 size-3 shrink-0" />
                    ) : (
                      <X className="text-bad mt-0.5 size-3 shrink-0" />
                    )}
                    <span className="break-all">{c.code}</span>
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        The form on the left is real, and so are the four tests: they query it live. Apply redesign
        changes and watch which tests break.
      </p>
      <p>
        Selector tests break on changes users would never notice. Role-and-label tests survive
        those, and break only when something users <em>would</em> notice changes, such as the button
        text, or labels disappearing (which also hurts screen-reader users).
      </p>
    </StepLayout>
  );
}

/* 3 ─ Query priority -------------------------------------------------------------------------------- */

export function Priority() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Which query first?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            ["1", "getByRole", "Buttons, links, headings, checkboxes, by their accessible name."],
            ["2", "getByLabelText", "Form fields, by their visible label."],
            [
              "3",
              "getByPlaceholderText · getByText · getByDisplayValue",
              "When there's no role or label to use.",
            ],
            ["4", "getByAltText · getByTitle", "Images, and the rare title attribute."],
            ["5", "getByTestId", "A last resort when nothing a user sees will do."],
          ].map(([n, q, b], i) => (
            <motion.div
              key={q}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface flex items-start gap-3 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-mono font-bold">{n}</span>
              <span>
                <code className="font-mono text-[11px]">{q}</code>
                <span className="text-muted block">{b}</span>
              </span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Testing Library, created by Kent C. Dodds in 2018, made this style popular and now has
        versions for React, Vue, Angular, Svelte and plain DOM. Playwright&apos;s locators follow
        the same idea (<code>getByRole</code>, <code>getByLabel</code>).
      </p>
      <p>
        Older tools that poked at component internals are fading: Enzyme has had no release since
        2019, and React 19 deprecated its own test renderer. Component tests increasingly run in a
        real browser, for example with Vitest&apos;s browser mode or Playwright.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Visual snapshots ------------------------------------------------------------------------------ */

function MiniCard({ bug }: { bug: boolean }) {
  return (
    <div className="border-line bg-surface relative h-28 rounded-lg border p-2">
      <div className="bg-line-strong h-2 w-2/3 rounded" />
      <div className="bg-line mt-1.5 h-2 w-1/2 rounded" />
      <div className="bg-line absolute right-2 bottom-2 left-2 h-3 rounded" />
      <div
        className={cn(
          "bg-accent absolute h-5 w-16 rounded",
          bug ? "right-4 bottom-1" : "right-2 bottom-7",
        )}
      />
    </div>
  );
}

export function Visual() {
  const [s, set] = useSceneState<UiState>();
  const changed = s.visualBug && s.baseline === "old";
  return (
    <StepLayout
      eyebrow="Explore"
      title="Catching what the eye would catch"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-1.5 text-xs">
            <input
              type="checkbox"
              checked={s.visualBug}
              onChange={(e) => set({ visualBug: e.target.checked, baseline: "old" })}
              className="accent-accent"
            />
            Ship a CSS change that pushes the button down over the terms text
          </label>
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div>
              <p className="text-muted mb-1">Baseline (approved)</p>
              <MiniCard bug={s.baseline === "new" && s.visualBug} />
            </div>
            <div>
              <p className="text-muted mb-1">This build</p>
              <MiniCard bug={s.visualBug} />
            </div>
            <div>
              <p className="text-muted mb-1">Difference</p>
              <div
                className={cn(
                  "border-line relative h-28 rounded-lg border",
                  changed ? "bg-bad/10" : "bg-surface",
                )}
              >
                {changed && (
                  <div className="border-bad bg-bad/30 absolute right-1 bottom-0.5 h-12 w-24 rounded border" />
                )}
              </div>
            </div>
          </div>
          <p className={cn("text-xs", changed ? "text-bad" : "text-good")}>
            {changed ? "Screenshots differ: test fails until someone looks." : "Screenshots match."}
          </p>
          {changed && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => set({ visualBug: false })}
                className="border-line-strong rounded-full border px-3 py-1 text-xs"
              >
                It&apos;s a bug: fix the CSS
              </button>
              <button
                type="button"
                onClick={() => set({ baseline: "new" })}
                className="border-line-strong rounded-full border px-3 py-1 text-xs"
              >
                It&apos;s intended: accept new baseline
              </button>
            </div>
          )}
        </div>
      }
    >
      <p>
        Every query above would still pass: the button exists and has the right name. But it now
        covers other text. <Term id="visual-regression">Visual regression tests</Term> compare a
        screenshot with an approved one and flag the difference for a person to judge.
      </p>
      <p>
        Playwright&apos;s <code>toHaveScreenshot</code>, Vitest&apos;s browser mode, and services
        such as Percy, Chromatic and Applitools do this. Fonts and rendering differ between
        machines, so teams take screenshots in the same environment every time.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function UiCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Pick the sturdiest query"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="testing-ui"
            prompt="You need a test to click the “Add to basket” button on a product page. Which query should it use?"
            options={[
              {
                id: "css",
                label: ".product-card > div:nth-child(3) > button",
                feedback: "Breaks when the layout changes, even if users notice nothing.",
              },
              {
                id: "testid",
                label: 'getByTestId("add-btn")',
                feedback: "Sturdy, but a last resort: it ignores what users see.",
              },
              {
                id: "role",
                label: 'getByRole("button", { name: "Add to basket" })',
                correct: true,
                feedback: "Finds it the way a user or screen reader does.",
              },
              { id: "class", label: ".btn--green", feedback: "Breaks with a restyle." },
            ]}
            explanation="Query by role and accessible name first. It survives restyling and reordering, and fails only when something users rely on changes."
          />
        </div>
      }
    >
      <p>Choose one.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Test what users see", "Roles, names and labels, not classes or positions."],
        ["Sturdy and accessible", "The same cues screen readers use."],
        ["Fail for the right reasons", "Only user-visible changes should break a test."],
        ["Test IDs last", "When nothing visible will do."],
        ["Screenshots for looks", "Visual regression catches layout breaks; a person decides."],
      ]}
    >
      <p>Next: tests that drive the whole app, start to finish.</p>
    </WrapStep>
  );
}
