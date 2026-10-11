"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { COMMENTS, LABELS, VERDICTS, type Label } from "./model";
import type { SevState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Inspection() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The health inspector's report"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Must fix before reopening",
              "Fridge at 9°C; raw chicken above salads.",
              "border-bad/40 bg-bad/10",
            ],
            ["Should fix soon", "A cracked tile near the sink.", "border-line bg-surface"],
            ["Suggestion", "Label shelves by date.", "border-line bg-surface"],
            [
              "Good practice noted",
              "Hand-washing station well stocked.",
              "border-good/40 bg-good/10",
            ],
          ].map(([t, b, c], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className={cn("rounded-lg border px-3 py-2 text-xs", c)}
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A health inspector doesn&apos;t hand over a flat list of thirty notes. They separate what
        must be fixed before the café reopens from what&apos;s merely a good idea.
      </p>
      <p>
        Review comments need the same. When every comment looks equally urgent, authors either fix
        everything (slow) or guess (risky). Labelling <Term id="blocking-comment">blocking</Term>{" "}
        comments, suggestions, questions and <Term id="nit">nits</Term> tells them exactly
        what&apos;s needed to merge.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Label ⭐ ------------------------------------------------------------------------------------- */

export function LabelIt() {
  const [s, set] = useSceneState<SevState>();
  const set1 = (id: string, l: Label) => set({ labels: { ...s.labels, [id]: l } });
  const all = COMMENTS.every((c) => s.labels[c.id]);
  const blocking = COMMENTS.filter(
    (c) => LABELS.find((l) => l.id === s.labels[c.id])?.blocking,
  ).length;
  const correctVerdict = blocking > 0 ? "changes" : "approve";
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Label your review, then give a verdict"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {COMMENTS.map((c) => {
            const l = s.labels[c.id];
            return (
              <div
                key={c.id}
                className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
              >
                <p>
                  {l && (
                    <span
                      className={cn(
                        "mr-1.5 font-mono text-[10px] font-semibold",
                        l === c.answer ? "text-good" : "text-bad",
                      )}
                    >
                      {l}:
                    </span>
                  )}
                  {c.text}
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {LABELS.map((x) => (
                    <button
                      key={x.id}
                      type="button"
                      aria-pressed={l === x.id}
                      onClick={() => set1(c.id, x.id)}
                      className={cn(
                        "rounded-full border px-2 py-0.5 font-mono text-[10px]",
                        l === x.id
                          ? x.id === c.answer
                            ? "border-good bg-good/20"
                            : "border-bad bg-bad/15"
                          : "border-line text-muted",
                      )}
                    >
                      {x.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          {all && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-2">
              <div className="border-line bg-surface-2 rounded-lg border px-3 py-2 text-xs">
                The author now sees: <span className="font-mono">{blocking}</span> to fix before
                merging, <span className="font-mono">{COMMENTS.length - blocking}</span> optional or
                informational.
              </div>
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
                        ? v.id === correctVerdict
                          ? "border-good bg-good/20"
                          : "border-bad bg-bad/15"
                        : "border-line-strong",
                    )}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
              {s.verdict && (
                <p
                  className={cn(
                    "text-xs",
                    s.verdict === correctVerdict ? "text-good" : "text-muted",
                  )}
                >
                  {s.verdict === correctVerdict
                    ? "Two blocking issues, so request changes. The labels show the rest can wait or be skipped."
                    : "With blocking issues open, approving risks shipping them; a plain comment leaves the author unsure."}
                </p>
              )}
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        Your review of a payments pull request has six comments. Label each one, using the format
        from Conventional Comments, then choose a verdict.
      </p>
      <p>
        Without labels the author faces six equal-looking demands. With them, they know two things
        must change and the rest is up to them.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Label systems -------------------------------------------------------------------------------- */

export function Systems() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Two common labelling systems"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Google&apos;s prefixes</p>
            <p className="text-muted mt-0.5">
              <span className="text-fg font-mono">Nit:</span> minor; technically you should, but it
              won&apos;t hugely matter.
            </p>
            <p className="text-muted">
              <span className="text-fg font-mono">Optional / Consider:</span> may be a good idea,
              not required.
            </p>
            <p className="text-muted">
              <span className="text-fg font-mono">FYI:</span> not for this change, but interesting
              for the future.
            </p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Conventional Comments</p>
            <p className="text-muted mt-0.5 font-mono text-[11px]">label [decorations]: subject</p>
            <p className="text-muted">
              Labels such as praise, nitpick, suggestion, issue, todo, question, thought, chore and
              note; decorations such as blocking, non-blocking and if-minor. By Paul Slaughter.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Pick one system as a team and use it consistently. Even a single convention, like prefixing
        minor points with &ldquo;Nit:&rdquo;, removes a lot of guessing.
      </p>
      <p>
        Many AI review tools now attach their own severity labels too; map them to your team&apos;s.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Verdicts ------------------------------------------------------------------------------------- */

export function Verdicts() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Verdicts on each platform"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "GitHub and Bitbucket",
              "Approve, Request changes, or Comment. Request changes blocks merging only when branch rules require reviews.",
            ],
            [
              "GitLab",
              "Approve; GitLab has also added a request-changes state. Required approvals depend on tier and rules.",
            ],
            ["Gerrit", "Code-Review −2 to +2: +2 approves, −2 blocks, ±1 is advice."],
            [
              "Approve with comments",
              "A common practice: approve, and trust the author to handle the remaining optional points.",
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
        The verdict should match the labels. Blocking issues open: request changes. Only optional
        points: approve, so the author isn&apos;t left waiting for a second round about a blank
        line.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function SevCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Blocking or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="review-severity"
            prompt="Should each comment block the merge?"
            categories={[
              { id: "block", label: "Blocking" },
              { id: "no", label: "Non-blocking" },
            ]}
            items={[
              {
                id: "leak",
                label: "The log line prints the customer's full card number",
                category: "block",
                why: "A security and privacy problem.",
              },
              {
                id: "name",
                label: "I'd call this totalPaise rather than amount",
                category: "no",
                why: "A naming nit.",
              },
              {
                id: "wrong",
                label: "Discounts are applied twice for members",
                category: "block",
                why: "Wrong behaviour.",
              },
              {
                id: "idea",
                label: "We could cache this later if it gets slow",
                category: "no",
                why: "An FYI for the future.",
              },
              {
                id: "q",
                label: "Curious: why a set rather than a list here?",
                category: "no",
                why: "A question; may lead to a change, but doesn't block by itself.",
              },
            ]}
            explanation="Block on correctness, security and serious design problems. Everything else is a suggestion, question or nit, labelled so the author can choose."
          />
        </div>
      }
    >
      <p>Sort each comment.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Say how much it matters", "Blocking, suggestion, question, nit."],
        ["Block on what's serious", "Correctness, security, real design flaws."],
        ["Pick a convention", "Nit/Optional/FYI or Conventional Comments."],
        ["Verdict matches labels", "Approve when only optional points remain."],
        ["Fewer rounds", "Clear labels shorten reviews."],
      ]}
    >
      <p>Next: reviewing the tests in a pull request.</p>
    </WrapStep>
  );
}
