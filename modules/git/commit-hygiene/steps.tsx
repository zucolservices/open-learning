"use client";

import { motion } from "motion/react";
import { NotebookText, Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { MESSY, TYPES } from "./model";
import type { HygieneState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function LabBook() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A lab notebook someone else can read"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <div className="border-bad/40 bg-bad/10 rounded-xl border p-3 font-mono text-[11px]">
            <NotebookText className="text-bad mb-1 size-4" />
            <p>tue: stuff</p>
            <p>wed: fixed it</p>
            <p>thu: more</p>
          </div>
          <div className="border-good/40 bg-good/10 rounded-xl border p-3 font-mono text-[11px]">
            <NotebookText className="text-good mb-1 size-4" />
            <p>tue: Raise oven to 200°C so crust browns</p>
            <p>wed: Cut sugar 10%: too sweet in tasting</p>
            <p>thu: Add cardamom, per customer requests</p>
          </div>
        </div>
      }
    >
      <p>
        A good lab notebook lets someone else, months later, understand not just what was done but
        why. &ldquo;Stuff&rdquo; and &ldquo;fixed it&rdquo; are useless the day after they&apos;re
        written.
      </p>
      <p>
        History is a project&apos;s notebook. <Term id="atomic-commit">Atomic commits</Term>, one
        change each, with messages that say what and why, make it searchable, reviewable and safe to
        revert. Tidy your own commits before you share them.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Clean up the branch ⭐ ------------------------------------------------------------------------ */

export function CleanUp() {
  const [s, set] = useSceneState<HygieneState>();
  const done = MESSY.filter(
    (m) => s.picks[m.id] !== undefined && m.options[s.picks[m.id]].ok,
  ).length;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Clean up a messy branch"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <p className="text-muted text-[10px] uppercase">
            Imran&apos;s branch, before opening a pull request · {done}/{MESSY.length} tidied
          </p>
          {MESSY.map((m) => {
            const pick = s.picks[m.id];
            const o = pick !== undefined ? m.options[pick] : undefined;
            return (
              <div
                key={m.id}
                className={cn(
                  "rounded-lg border p-2",
                  o
                    ? o.ok
                      ? "border-good/50 bg-good/10"
                      : "border-bad/50 bg-bad/10"
                    : "border-line bg-surface",
                )}
              >
                <p className="font-mono text-xs">
                  <span className="text-subtle">commit:</span> &ldquo;{m.msg}&rdquo;
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {m.options.map((op, i) => (
                    <button
                      key={op.text}
                      type="button"
                      aria-pressed={pick === i}
                      onClick={() => set({ picks: { ...s.picks, [m.id]: i } })}
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-left text-[11px]",
                        pick === i
                          ? "border-accent bg-accent text-accent-fg"
                          : "border-line-strong text-muted hover:text-fg",
                      )}
                    >
                      {op.text}
                    </button>
                  ))}
                </div>
                {o && (
                  <p className="mt-1 flex items-start gap-1 text-[11px]">
                    {o.ok ? (
                      <Check className="text-good mt-0.5 size-3 shrink-0" />
                    ) : (
                      <X className="text-bad mt-0.5 size-3 shrink-0" />
                    )}
                    {o.why}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      }
    >
      <p>
        Imran&apos;s branch works, but its history is a diary of a messy afternoon. Fix each commit
        before it goes up for review.
      </p>
      <p>
        You already have the tools: <code>git add -p</code> to split,{" "}
        <code>git commit --fixup</code> and an interactive rebase to fold and reword. Only do this
        to your own unshared commits.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Anatomy of a message -------------------------------------------------------------------------- */

const PARTS: [string, string, string][] = [
  [
    "Subject",
    "Fix GST rounding on bills over ₹1,000",
    "About 50 characters, imperative mood ('Fix', not 'Fixed'), no full stop. Git's own guidelines.",
  ],
  ["Blank line", "", "Separates subject from body; many tools rely on it."],
  [
    "Body",
    "Bills above ₹1,000 rounded each line item before\nadding GST, so totals were off by up to ₹2. Round\nonce, on the final total, as the GST rules expect.",
    "Why the change was needed and what it does. Wrapping at about 72 columns is a common convention.",
  ],
  [
    "Trailers",
    "Signed-off-by: Imran <imran@cafe.example>\nCo-authored-by: Kavya <kavya@cafe.example>",
    "Machine-readable lines: a Developer Certificate of Origin sign-off (git commit -s), co-authors, issue links.",
  ],
];

export function Anatomy() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Anatomy of a good message"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {PARTS.map(([k, v, why], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface grid gap-1 rounded-lg border px-3 py-2 sm:grid-cols-[6rem_1fr]"
            >
              <span className="text-accent text-xs font-semibold">{k}</span>
              <span>
                {v && <pre className="font-mono text-[11px] whitespace-pre-wrap">{v}</pre>}
                <span className="text-muted block text-[11px]">{why}</span>
              </span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The subject line is what you see in <code>git log --oneline</code>, in pull requests and in
        blame, so make it count. The body is for the reasoning that the code itself can&apos;t show.
      </p>
      <p>A good test: will this message help someone running git blame on this line next year?</p>
    </StepLayout>
  );
}

/* 4 ─ Conventional Commits -------------------------------------------------------------------------- */

export function Conventional() {
  const [s, set] = useSceneState<HygieneState>();
  const header = `${s.type}${s.scope ? `(${s.scope})` : ""}${s.breaking ? "!" : ""}: add seasonal specials`;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Messages tools can read"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={s.type === t}
                onClick={() => set({ type: t })}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 font-mono text-[11px]",
                  s.type === t
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line-strong text-muted",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <label className="flex items-center gap-1.5">
              scope
              <input
                value={s.scope}
                onChange={(e) =>
                  set({ scope: e.target.value.replace(/[^a-z-]/g, "").slice(0, 12) })
                }
                className="border-line-strong bg-surface w-24 rounded border px-1.5 py-0.5 font-mono"
                aria-label="Scope"
              />
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={s.breaking}
                onChange={(e) => set({ breaking: e.target.checked })}
                className="accent-accent"
              />
              breaking change
            </label>
          </div>
          <pre className="bg-surface-2/60 border-line rounded-lg border px-3 py-2 font-mono text-xs whitespace-pre-wrap">
            {header}
            {s.breaking ? "\n\nBREAKING CHANGE: the /menu API now returns prices in paise." : ""}
          </pre>
          <p className="text-muted text-xs">
            {s.type === "feat"
              ? "A feature: a release tool would bump the minor version."
              : s.type === "fix"
                ? "A fix: a patch version bump."
                : "Allowed by convention, but the spec only requires feat and fix."}
            {s.breaking ? " Breaking: a major version bump." : ""}
          </p>
        </div>
      }
    >
      <p>
        <Term id="conventional-commits">Conventional Commits</Term> is a widely used format:{" "}
        <code>type(scope): description</code>. The spec defines only <code>feat</code> and{" "}
        <code>fix</code>; teams add others like <code>docs</code> and <code>chore</code>.
      </p>
      <p>
        Because the format is regular, tools can generate changelogs and choose the next version
        number automatically. It&apos;s optional: plenty of good projects simply write clear plain
        messages.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function HygieneCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Good message or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="git-hygiene"
            prompt="Would each make a good commit subject?"
            categories={[
              { id: "good", label: "Good" },
              { id: "bad", label: "Weak" },
            ]}
            items={[
              {
                id: "a",
                label: "Add loyalty points to the checkout page",
                category: "good",
                why: "Specific and imperative.",
              },
              { id: "b", label: "changes", category: "bad", why: "Says nothing." },
              {
                id: "c",
                label: "fix(bills): round GST once on the total",
                category: "good",
                why: "Conventional Commits style, specific.",
              },
              {
                id: "d",
                label: "Updated some files and also fixed the login bug and the footer",
                category: "bad",
                why: "Several changes in one; split it.",
              },
              {
                id: "e",
                label: 'Revert "Add loyalty points"',
                category: "good",
                why: "Git's own revert message: clear.",
              },
              { id: "f", label: "asdfgh", category: "bad", why: "Keyboard mash." },
            ]}
            explanation="Good subjects say what the commit does, specifically, in the imperative; one change per commit."
          />
        </div>
      }
    >
      <p>Sort each message.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["One change per commit", "Easy to review, revert and cherry-pick."],
        ["Subject: what, imperative, ~50 chars", '"Fix GST rounding", not "fixed stuff".'],
        ["Body: why", "The reasoning the code can't show."],
        ["Tidy before sharing", "fixup, squash and reword your own commits."],
        ["Conventional Commits", "Optional, machine-readable: feat, fix, breaking."],
      ]}
    >
      <p>
        That completes collaboration. Next chapter: undo and recovery, starting with the many ways
        to undo a mistake.
      </p>
    </WrapStep>
  );
}
