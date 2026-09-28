"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, MessageSquare, StickyNote } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { GWT, INVEST, OTP_STORY, WEAK } from "./stories";
import type { StoriesState } from "./state";

/* 1 ─ Card, conversation, confirmation ------------------------------------------------------------ */

const CS = [
  {
    title: "Card",
    caption:
      "A short note that names who needs what, and why. Kent Beck's XP stories were “written on index cards”: small on purpose, so they can't pretend to be the whole requirement.",
  },
  {
    title: "Conversation",
    caption:
      "The details come from talking. Alistair Cockburn called stories “promissory notes for future conversation”. Jeff Patton: “Shared documents aren't shared understanding.”",
  },
  {
    title: "Confirmation",
    caption:
      "How everyone will know it's done. Ron Jeffries: “This component is the acceptance test.” In practice, the story's acceptance criteria.",
  },
];

export function ThreeCs() {
  const [s, set] = useSceneState<StoriesState>();
  const f = Math.min(s.frame, CS.length - 1);
  return (
    <StepLayout
      eyebrow="Step through"
      title="Card, conversation, confirmation"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid gap-2 sm:grid-cols-3">
            <motion.div
              animate={{ opacity: f === 0 ? 1 : 0.45 }}
              className={cn(
                "rounded-xl border p-3",
                f === 0 ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <p className="text-muted flex items-center gap-1 text-[10px] uppercase">
                <StickyNote className="size-3" /> Card
              </p>
              <p className="mt-1 text-xs">
                As a <strong>senior citizen</strong>, I want to{" "}
                <strong>renew my pension certificate online</strong>, so that{" "}
                <strong>I don&apos;t travel to the taluk office every year</strong>.
              </p>
            </motion.div>
            <motion.div
              animate={{ opacity: f === 1 ? 1 : 0.45 }}
              className={cn(
                "grid gap-1 rounded-xl border p-3 text-[11px]",
                f === 1 ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <p className="text-muted flex items-center gap-1 text-[10px] uppercase">
                <MessageSquare className="size-3" /> Conversation
              </p>
              <p>
                <strong>Dev:</strong> Do they need to upload a life certificate?
              </p>
              <p>
                <strong>PO:</strong> Yes, or Jeevan Pramaan if linked.
              </p>
              <p>
                <strong>Tester:</strong> What if they&apos;re not comfortable with uploads?
              </p>
            </motion.div>
            <motion.div
              animate={{ opacity: f === 2 ? 1 : 0.45 }}
              className={cn(
                "rounded-xl border p-3 text-[11px]",
                f === 2 ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <p className="text-muted flex items-center gap-1 text-[10px] uppercase">
                <Check className="size-3" /> Confirmation
              </p>
              <p className="mt-1">
                <strong>Given</strong> my pension is due for renewal, <strong>when</strong> I submit
                a valid life certificate, <strong>then</strong> I see a confirmation and receive an
                SMS.
              </p>
            </motion.div>
          </div>
          <Stepper step={f} count={CS.length} onChange={(n) => set({ frame: n })} />
          <FrameCaption frameKey={f} title={CS[f].title}>
            {CS[f].caption}
          </FrameCaption>
        </div>
      }
    >
      <p>
        A note on the fridge says &ldquo;Plan Amma&apos;s birthday&rdquo;. It isn&apos;t the plan;
        it&apos;s a reminder to talk about it. You&apos;ll know you got it right when she smiles.
      </p>
      <p>
        A <Term id="user-story">user story</Term> works the same way. Ron Jeffries: &ldquo;User
        stories have three critical aspects. We can call these Card, Conversation, and
        Confirmation.&rdquo;
      </p>
      <p className="text-muted text-sm">
        Jeff Patton: &ldquo;Stories aren&apos;t a written form of requirements; telling stories
        through collaboration with words and pictures is a mechanism that builds shared
        understanding.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix the stories ⭐ ----------------------------------------------------------------------------- */

function Letters({ fails }: { fails: string[] }) {
  return (
    <div className="flex gap-1">
      {INVEST.map(([l, word]) => {
        const bad = fails.includes(l);
        return (
          <span
            key={l}
            title={word}
            className={cn(
              "grid size-6 place-items-center rounded font-mono text-[11px] font-semibold",
              bad ? "bg-bad/15 text-bad" : "bg-good/15 text-good",
            )}
          >
            {l}
          </span>
        );
      })}
    </div>
  );
}

export function FixStories() {
  const [s, set] = useSceneState<StoriesState>();
  const at = Math.min(s.at, WEAK.length - 1);
  const w = WEAK[at];
  const pick = w.rewrites.find((r) => r.id === s.rewrite[w.id]);
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Fix the stories"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface grid grid-cols-2 gap-x-3 gap-y-0.5 rounded-xl border px-3 py-2 text-[11px] sm:grid-cols-3">
            {INVEST.map(([l, word, gloss]) => (
              <p key={l}>
                <span className="text-accent font-mono font-semibold">{l}</span> {word}:{" "}
                <span className="text-muted">{gloss}</span>
              </p>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {WEAK.map((x, i) => (
              <button
                key={x.id}
                type="button"
                onClick={() => set({ at: i })}
                className={cn(
                  "grid size-7 place-items-center rounded-full border font-mono text-[11px]",
                  i === at ? "border-accent bg-accent-soft" : "border-line",
                  s.rewrite[x.id] === "good" && "text-good",
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={w.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="flex flex-col gap-2"
            >
              <div className="border-bad/30 bg-bad/5 rounded-xl border px-3 py-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm">{w.text}</p>
                  <Letters fails={w.fails} />
                </div>
                <p className="text-muted mt-1 text-xs">{w.why}</p>
              </div>
              <p className="text-xs font-semibold">Pick the better rewrite:</p>
              {w.rewrites.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  aria-pressed={pick?.id === r.id}
                  onClick={() => set({ rewrite: { ...s.rewrite, [w.id]: r.id } })}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-left text-xs",
                    pick?.id === r.id
                      ? r.fails.length === 0
                        ? "border-good bg-good/10"
                        : "border-bad bg-bad/10"
                      : "border-line bg-surface hover:bg-surface-2",
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span>{r.text}</span>
                    {pick?.id === r.id && <Letters fails={r.fails} />}
                  </div>
                  {pick?.id === r.id && <p className="text-muted mt-1">{r.note}</p>}
                </button>
              ))}
              {pick?.fails.length === 0 && at < WEAK.length - 1 && (
                <button
                  type="button"
                  onClick={() => set({ at: at + 1 })}
                  className="bg-accent text-accent-fg self-start rounded-full px-4 py-1.5 text-xs font-medium"
                >
                  Next story
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Bill Wake&apos;s <Term id="invest">INVEST</Term> checklist (2003) says what makes a story
        good. Each weak story below fails some letters. Pick the rewrite that passes all six.
      </p>
      <p className="text-muted text-sm">
        The template &ldquo;As a…, I want…, so that…&rdquo; came from a team at Connextra in 2001.
        It&apos;s a helpful habit, not a rule; the &ldquo;so that&rdquo; is the part that matters
        most.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Write the acceptance criteria ⭐ ------------------------------------------------------------- */

export function Criteria() {
  const [s, set] = useSceneState<StoriesState>();
  const chosen = GWT.map((g) => g.options.find((o) => o.id === s.gwt[g.part]));
  const complete = chosen.every(Boolean);
  const allOk = complete && chosen.every((o) => o!.ok);
  return (
    <StepLayout
      eyebrow="Build"
      title="Write the acceptance criteria"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <p className="border-line bg-surface rounded-xl border px-3 py-2 text-sm">{OTP_STORY}</p>
          {GWT.map((g, gi) => (
            <div key={g.part}>
              <p className="text-accent mb-1 font-mono text-xs font-semibold">{g.part}</p>
              <div className="grid gap-1.5 sm:grid-cols-3">
                {g.options.map((o) => {
                  const on = s.gwt[g.part] === o.id;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => set({ gwt: { ...s.gwt, [g.part]: o.id } })}
                      className={cn(
                        "rounded-xl border px-2.5 py-2 text-left text-[11px]",
                        on
                          ? o.ok
                            ? "border-good bg-good/10"
                            : "border-bad bg-bad/10"
                          : "border-line bg-surface hover:bg-surface-2",
                      )}
                    >
                      {o.text}
                      {on && <span className="text-muted mt-0.5 block">{o.why}</span>}
                    </button>
                  );
                })}
              </div>
              {gi < 2 && <div className="bg-line mx-auto mt-1.5 h-2 w-px" />}
            </div>
          ))}
          {complete && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3 font-mono text-xs",
                allOk ? "border-good/40 bg-good/5" : "border-bad/40 bg-bad/5",
              )}
            >
              {GWT.map((g, i) => (
                <p key={g.part}>
                  <strong>{g.part}</strong> {chosen[i]!.text}
                </p>
              ))}
              <p className={cn("mt-2 font-sans", allOk ? "text-good" : "text-bad")}>
                {allOk
                  ? "A testable scenario: anyone can set it up, trigger it and check the result."
                  : "Not testable yet: change the parts marked red."}
              </p>
            </motion.div>
          )}
          <p className="text-subtle text-[10px]">
            The need is real: India&apos;s Guidelines for Indian Government Websites (GIGW 3.0,
            2023) follow WCAG 2.1 level AA, which asks for time limits users can extend. Warned
            &ldquo;before time expires and given at least 20 seconds to extend the time limit with a
            simple action&rdquo;.
          </p>
        </div>
      }
    >
      <p>
        <Term id="acceptance-criteria">Acceptance criteria</Term> are the confirmation: what must be
        true for this story to be accepted.
      </p>
      <p>
        A popular way to write them is Given/When/Then, from Dan North and Chris Matts&apos;
        Behaviour-Driven Development (2006): &ldquo;Given some initial context (the givens), When an
        event occurs, Then ensure some outcomes.&rdquo; Tools like Cucumber (2008) can even run them
        as tests.
      </p>
      <p className="text-muted text-sm">Build one scenario for this story.</p>
    </StepLayout>
  );
}

/* 4 ─ This story, or every story? ------------------------------------------------------------------ */

export function AcOrDod() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="This story, or every story?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="ac-dod"
            prompt="Is each one an acceptance criterion for the OTP story, or part of the Definition of Done that every item must meet?"
            categories={[
              { id: "ac", label: "Acceptance criteria (this story)" },
              { id: "dod", label: "Definition of Done (every item)" },
            ]}
            items={[
              {
                id: "warn",
                label: "A warning appears 20 seconds before the session times out",
                category: "ac",
                why: "Specific to this story's behaviour.",
              },
              {
                id: "review",
                label: "Code has been reviewed by another developer",
                category: "dod",
                why: "Applies to every piece of work, so it belongs in the Definition of Done.",
              },
              {
                id: "keep",
                label: "Pressing “More time” keeps the answers already entered",
                category: "ac",
                why: "What this story must do.",
              },
              {
                id: "tests",
                label: "All automated tests pass on the staging environment",
                category: "dod",
                why: "A quality bar for everything the team ships.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        Both must be met before an item is finished. Mike Cohn&apos;s distinction: acceptance
        criteria are specific to one item; the Definition of Done applies to every item.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "A story is a reminder to talk",
    "Card, conversation, confirmation. The card is the smallest part.",
  ],
  ["INVEST", "Independent, Negotiable, Valuable, Estimable, Small, Testable."],
  ["Say why", "“So that…” is what makes a story valuable, and negotiable."],
  ["Confirm with scenarios", "Given/When/Then makes acceptance criteria concrete and testable."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        User stories aren&apos;t part of Scrum: the Scrum Guide just says &ldquo;Product Backlog
        items&rdquo;. Many teams use stories; some use &ldquo;job stories&rdquo; (&ldquo;When…, I
        want to…, so I can…&rdquo;, from Intercom); any clear format works.
      </p>
      <p>Next: splitting big stories into thin slices that still deliver value.</p>
    </StepLayout>
  );
}
