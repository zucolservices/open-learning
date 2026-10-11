"use client";

import { motion } from "motion/react";
import { Check, CircleHelp, GitPullRequest } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FIXES, minutes } from "./model";
import type { PrState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Delivery() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A parcel with a note"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">An unlabelled box</p>
            <p className="text-muted">
              What is it? Who ordered it? Is anything fragile? You have to open everything to find
              out.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-good/40 bg-good/10 rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">A box with a packing note</p>
            <p className="text-muted">
              “Replacement grinder for order 482. Old one goes back in the same box.” You know what
              to check in a minute.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        A delivery with a packing note is quick to check. One without makes you unpack everything
        and guess what it&apos;s for.
      </p>
      <p>
        A <Term id="pull-request">pull request</Term> is a proposed change plus its packing note.
        The diff shows <em>what</em> changed; the title and description tell the reviewer why, and
        how to check it. A good one makes it easy to say yes, or to spot the problem fast.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Rebuild the PR ⭐ ---------------------------------------------------------------------------- */

export function Rebuild() {
  const [s, set] = useSceneState<PrState>();
  const has = (id: string) => s.fixes.includes(id);
  const toggle = (id: string) =>
    set({ fixes: has(id) ? s.fixes.filter((x) => x !== id) : [...s.fixes, id] });
  const f = (id: string) => FIXES.find((x) => x.id === id)!;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Turn a vague pull request into an easy review"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="flex items-center gap-1.5 text-sm font-semibold">
              <GitPullRequest className="text-accent size-4" />
              <motion.span
                key={String(has("title"))}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {has("title") ? f("title").after : f("title").before}
              </motion.span>
            </p>
            <p className={cn("mt-1", !has("why") && "text-muted italic")}>
              {has("why") ? f("why").after : f("why").before}
            </p>
            {has("test") && <p className="mt-1">{f("test").after}</p>}
            {has("shot") && (
              <p className="border-line bg-surface-2 mt-1 rounded border px-2 py-3 text-center text-[10px]">
                {f("shot").after}
              </p>
            )}
            <p
              className={cn(
                "mt-1.5 font-mono text-[10px]",
                has("scope") ? "text-good" : "text-bad",
              )}
            >
              {has("scope") ? f("scope").after : f("scope").before}
            </p>
          </div>
          <div className="grid gap-1">
            {FIXES.map((x) => (
              <label
                key={x.id}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs",
                  has(x.id) ? "border-good/50 bg-good/10" : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={has(x.id)}
                  onChange={() => toggle(x.id)}
                  className="accent-accent"
                />
                {x.label}
              </label>
            ))}
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="text-muted mb-1 text-[10px] font-medium">The reviewer&apos;s questions</p>
            {FIXES.map((x) => (
              <p
                key={x.id}
                className={cn("flex items-center gap-1.5", has(x.id) && "text-muted line-through")}
              >
                {has(x.id) ? (
                  <Check className="text-good size-3" />
                ) : (
                  <CircleHelp className="text-muted size-3" />
                )}
                {x.question}
              </p>
            ))}
            <p className="mt-1 font-mono">
              About {minutes(s.fixes.length)} minutes to review (illustrative)
            </p>
          </div>
        </div>
      }
    >
      <p>
        This made-up pull request fixes a real bug in a café&apos;s checkout, but a reviewer opening
        it has five questions before they can even start. Apply each improvement and watch the
        questions disappear.
      </p>
      <p>
        Moving the unrelated reformatting out is the biggest win: 40 files of noise hide the two
        that matter.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Templates ------------------------------------------------------------------------------------ */

export function Templates() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="A template does the remembering"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 font-mono text-[10.5px]">
            <p className="text-muted mb-1 font-sans text-[10px]">
              .github/pull_request_template.md
            </p>
            {[
              "## What and why",
              "",
              "## How to test",
              "",
              "## Screenshots (if the UI changed)",
              "",
              "## Risks and rollback",
              "",
              "Closes #",
            ].map((l, i) => (
              <pre key={i} className="whitespace-pre">
                {l || " "}
              </pre>
            ))}
          </div>
          <p className="text-muted text-[11px]">
            GitHub, GitLab, Bitbucket and Azure DevOps all support description templates that
            pre-fill every new pull request.
          </p>
        </div>
      }
    >
      <p>
        Nobody remembers every section when they&apos;re in a hurry. A template in the repository
        prompts authors for the essentials, and keeps descriptions consistent so reviewers know
        where to look.
      </p>
      <p>Keep it short. A template with fifteen headings gets deleted on sight.</p>
    </StepLayout>
  );
}

/* 4 ─ One purpose ---------------------------------------------------------------------------------- */

export function OnePurpose() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="One purpose per pull request"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Separate refactoring from behaviour changes",
              "A reviewer can skim “no behaviour change” quickly, and focus on the real change.",
            ],
            [
              "Separate mass reformatting",
              "Its own PR, ideally done by a tool, so it hides nothing.",
            ],
            [
              "Open as a draft while unfinished",
              "Most platforms let you mark a PR as a draft: visible for early feedback, not yet asking for approval.",
            ],
            [
              "Show evidence",
              "Tests for behaviour; screenshots or a short recording for anything visual.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
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
        A pull request that does one thing can be judged as a whole: is this the right change? One
        that mixes a bug fix, a rename and a reformat forces the reviewer to untangle it first, and
        problems slip through in the noise.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function PrCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Belongs in the PR, or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="review-anatomy"
            prompt="Does each item belong in this pull request?"
            categories={[
              { id: "yes", label: "Belongs here" },
              { id: "no", label: "Leave it out" },
            ]}
            items={[
              {
                id: "why",
                label: "Why the change is needed, with a link to the issue",
                category: "yes",
                why: "Context the diff can't show.",
              },
              {
                id: "test",
                label: "A test for the bug being fixed",
                category: "yes",
                why: "Evidence it works and stays fixed.",
              },
              {
                id: "reformat",
                label: "Reformatting 40 unrelated files",
                category: "no",
                why: "Its own PR, so it hides nothing.",
              },
              {
                id: "feature",
                label: "A half-finished new feature you started on the side",
                category: "no",
                why: "One purpose per PR.",
              },
              {
                id: "shot",
                label: "Before and after screenshots of the changed screen",
                category: "yes",
                why: "Lets the reviewer see the effect.",
              },
            ]}
            explanation="A good pull request has one purpose, explains why, and shows evidence. Unrelated changes go in their own PRs."
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
        ["A change plus its packing note", "Title, why, how to test."],
        ["One purpose", "Split refactors, reformats and features."],
        ["Show evidence", "Tests, screenshots."],
        ["Use a short template", "It remembers for you."],
        ["Drafts for early feedback", "Ask for approval when ready."],
      ]}
    >
      <p>Next: the stages a pull request goes through, and where it waits.</p>
    </WrapStep>
  );
}
