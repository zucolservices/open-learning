"use client";

import { motion } from "motion/react";
import { User } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { Diff, parseDiff } from "../_shared/diff";
import { COMMENTS, DIFF, FILES, REPLIES, VERDICTS, type Candidate } from "./model";
import type { CapState } from "./state";

function Options({
  options,
  value,
  onPick,
}: {
  options: Candidate[];
  value?: string;
  onPick(id: string): void;
}) {
  const chosen = options.find((o) => o.id === value);
  return (
    <div className="grid gap-1">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onPick(o.id)}
          className={cn(
            "rounded-md border px-2 py-1 text-left text-[11px]",
            value === o.id
              ? o.best
                ? "border-good bg-good/15"
                : "border-bad bg-bad/10"
              : "border-line bg-surface hover:border-line-strong",
          )}
        >
          {o.text}
        </button>
      ))}
      {chosen && (
        <p className={cn("text-[10px]", chosen.best ? "text-good" : "text-muted")}>{chosen.why}</p>
      )}
    </div>
  );
}

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Friday() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A pull request lands on your desk"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Gift card balance check at checkout</p>
            <p className="text-muted text-[10px]">
              made-up café app · 5 files changed · +2,041 −1,936
            </p>
            <p className="text-muted mt-1">
              Customers can now pay with gift cards. Checks the balance before charging. Also tidied
              some formatting.
            </p>
          </div>
          <p className="text-subtle text-[10px]">
            Everything from this track, in one review: reading order, severity, wording, replies and
            the merge decision.
          </p>
        </div>
      }
    >
      <p>
        A teammate asks you to review their gift-card change. It looks huge, it mixes in some
        unrelated formatting, and it touches money. In other words: a normal Tuesday.
      </p>
      <p>
        Over the next few steps you&apos;ll take it from first look to merge, leaving the code
        better and the author glad they asked. That&apos;s the point of{" "}
        <Term id="code-review">code review</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Read in order -------------------------------------------------------------------------------- */

export function ReadOrder() {
  const [s, set] = useSceneState<CapState>();
  const next = s.order.length;
  const click = (path: string) => !s.order.includes(path) && set({ order: [...s.order, path] });
  const inOrder = s.order.every((p, i) => FILES.find((f) => f.path === p)!.rank === i);
  const done = s.order.length === FILES.length;
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Choose what to read, and in what order"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {FILES.map((f) => {
            const at = s.order.indexOf(f.path);
            const right = at >= 0 && f.rank === at;
            return (
              <button
                key={f.path}
                type="button"
                onClick={() => click(f.path)}
                disabled={at >= 0}
                className={cn(
                  "flex flex-wrap items-center gap-x-2 rounded-lg border px-3 py-1.5 text-left text-xs disabled:cursor-default",
                  at < 0
                    ? "border-line bg-surface hover:border-line-strong"
                    : right
                      ? "border-good/50 bg-good/10"
                      : "border-bad/40 bg-bad/10",
                )}
              >
                <span className="text-muted w-4 font-mono">{at >= 0 ? at + 1 : ""}</span>
                <span className="font-mono text-[11px]">{f.path}</span>
                <span className="text-subtle ml-auto font-mono text-[10px]">{f.size}</span>
                {at >= 0 && (
                  <span
                    className={cn(
                      "basis-full pl-6 text-[10px]",
                      right ? "text-good" : "text-muted",
                    )}
                  >
                    {f.note}
                  </span>
                )}
              </button>
            );
          })}
          {done && (
            <div className="flex items-center gap-3 text-xs">
              <p className={inOrder ? "text-good" : "text-muted"}>
                {inOrder
                  ? "Core first, then its tests and caller; the noise last."
                  : "A different order works, but the core logic deserves your freshest attention."}
              </p>
              <button
                type="button"
                onClick={() => set({ order: [] })}
                className="text-muted shrink-0 text-[10px] underline"
              >
                Read again
              </button>
            </div>
          )}
          {!done && (
            <p className="text-muted text-[10px]">
              Click file {next + 1} of {FILES.length}.
            </p>
          )}
        </div>
      }
    >
      <p>
        The description says what and why, if briefly. Now pick the order to open the five files.
        Most of the 4,000 changed lines are noise.
      </p>
      <p>Remember the reading-diffs module: start where the real change is.</p>
    </StepLayout>
  );
}

/* 3 ─ Write comments ------------------------------------------------------------------------------- */

export function WriteComments() {
  const [s, set] = useSceneState<CapState>();
  const problems = Object.keys(COMMENTS).map(Number);
  const best = (l: number) => COMMENTS[l].find((c) => c.best)!.id === s.comments[l];
  const comments: Record<number, React.ReactNode> = {};
  for (const l of problems)
    if (s.comments[l])
      comments[l] = (
        <span className={best(l) ? "" : "text-muted"}>
          {COMMENTS[l].find((c) => c.id === s.comments[l])!.text}
        </span>
      );
  const found = problems.filter((l) => best(l)).length;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Write the comments"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <Diff
            path="src/giftcards/balance.ts"
            lines={parseDiff(DIFF)}
            comments={comments}
            onLine={(i) => set({ line: i })}
            selected={s.line !== null ? [s.line] : undefined}
          />
          {s.line !== null && (
            <motion.div
              key={s.line}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-line bg-surface-2 rounded-lg border px-3 py-2 text-xs"
            >
              {COMMENTS[s.line] ? (
                <>
                  <p className="text-muted mb-1 text-[10px] font-medium">
                    Choose the comment to post on line {s.line + 1}
                  </p>
                  <Options
                    options={COMMENTS[s.line]}
                    value={s.comments[s.line]}
                    onPick={(id) => set({ comments: { ...s.comments, [s.line as number]: id } })}
                  />
                </>
              ) : (
                <p className="text-muted">Nothing worth flagging on this line.</p>
              )}
            </motion.div>
          )}
          <p className={cn("text-xs", found === problems.length ? "text-good" : "text-muted")}>
            {found === problems.length
              ? "Four comments: three blocking issues, one optional nit, each specific and kind."
              : `${found} of ${problems.length} problems commented well. Click a line to comment.`}
          </p>
        </div>
      }
    >
      <p>
        Here&apos;s the core file. Four lines deserve a comment. Click each line, then choose the
        comment that gets the <strong>severity</strong> right and is specific and kind.
      </p>
      <p>Labels follow Conventional Comments: issue (blocking), suggestion, nitpick and so on.</p>
    </StepLayout>
  );
}

/* 4 ─ Replies -------------------------------------------------------------------------------------- */

export function Replies() {
  const [s, set] = useSceneState<CapState>();
  const done = REPLIES.every((r) => r.options.find((o) => o.id === s.replies[r.id])?.best);
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="The author replies"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {REPLIES.map((r) => (
            <div key={r.id} className="grid gap-1.5">
              <div className="border-line bg-surface flex items-start gap-1.5 rounded-lg border px-3 py-2 text-xs">
                <User className="text-muted mt-px size-3.5 shrink-0" />
                <span>
                  <span className="font-semibold">Author: </span>
                  {r.author}
                </span>
              </div>
              <div className="pl-4">
                <Options
                  options={r.options}
                  value={s.replies[r.id]}
                  onPick={(id) => set({ replies: { ...s.replies, [r.id]: id } })}
                />
              </div>
            </div>
          ))}
          {done && (
            <p className="text-good text-xs">
              Thanked, held firm with facts, and kept the change focused.
            </p>
          )}
        </div>
      }
    >
      <p>
        An hour later the author has responded to your review. Choose your reply to each message.
      </p>
      <p>One is a thank-you, one is pushback on a blocking issue, and one is a question.</p>
    </StepLayout>
  );
}

/* 5 ─ Decide --------------------------------------------------------------------------------------- */

export function Decide() {
  const [s, set] = useSceneState<CapState>();
  const v = VERDICTS.find((x) => x.id === s.verdict);
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Is it ready to merge?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Exact-balance bug", "fixed, with a test", true],
            ["Error handling", "added a “try again” message", true],
            ["Card code in logs", "now logs the card id", true],
            ["format.ts changes", "moved to their own pull request", true],
            ["Unused variable x", "still there (optional)", false],
          ].map(([t, b, ok]) => (
            <div
              key={t as string}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs",
                ok ? "border-good/40 bg-good/10" : "border-line bg-surface",
              )}
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </div>
          ))}
          <div className="mt-1 grid gap-1">
            {VERDICTS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.verdict === x.id}
                onClick={() => set({ verdict: x.id })}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-left text-xs",
                  s.verdict === x.id
                    ? x.best
                      ? "border-good bg-good/15"
                      : "border-bad bg-bad/10"
                    : "border-line-strong",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          {v && <p className={cn("text-xs", v.best ? "text-good" : "text-muted")}>{v.result}</p>}
        </div>
      }
    >
      <p>
        The author pushes a new version. Here&apos;s where things stand. Google&apos;s guide calls
        this its senior principle: approve once a change{" "}
        <em>definitely improves the overall code health</em>, even if it isn&apos;t perfect.
      </p>
      <p>What&apos;s your verdict?</p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function CapCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Must fix, or fine to merge?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="review-capstone"
            prompt="Which of these must be fixed before this kind of change merges?"
            categories={[
              { id: "must", label: "Must fix first" },
              { id: "fine", label: "Fine to merge with" },
            ]}
            items={[
              {
                id: "charge",
                label: "Customers can be charged twice on a retry",
                category: "must",
                why: "A correctness bug with money.",
              },
              {
                id: "name",
                label: "A variable name you'd have chosen differently",
                category: "fine",
                why: "Preference: a nit at most.",
              },
              {
                id: "authz",
                label: "Any user can view any other user's orders",
                category: "must",
                why: "A security problem.",
              },
              {
                id: "test",
                label: "No test for the new behaviour",
                category: "must",
                why: "Nothing protects it from being broken later.",
              },
              {
                id: "follow",
                label: "A small refactor that could come in a follow-up",
                category: "fine",
                why: "Better isn't required to be perfect; file it if needed.",
              },
            ]}
            explanation="Block on correctness, security and missing tests. Everything else can be a labelled suggestion, so good changes merge and improve the code today."
          />
        </div>
      }
    >
      <p>Sort each issue.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Read with a plan", "Description, core, tests, callers, noise last."],
        ["Label severity", "Block on what matters; mark the rest optional."],
        ["Specific and kind", "Problem, impact, a way forward."],
        ["Reply with facts", "Thank, explain, keep changes focused."],
        ["Better, not perfect", "Approve when it improves code health."],
      ]}
    >
      <p>
        That completes Code Review. You can now read a change with a plan, write comments people
        want to act on, and help your team review faster and more kindly.
      </p>
    </WrapStep>
  );
}
