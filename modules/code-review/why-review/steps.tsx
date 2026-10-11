"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { cn } from "@/lib/cn";
import { COMMENTS, PURPOSES, type Purpose } from "./model";
import type { WhyState } from "./state";

/* 2 ─ Tag the comments ⭐ -------------------------------------------------------------------------- */

export function TagComments() {
  const [s, set] = useSceneState<WhyState>();
  const counts = PURPOSES.map((p) => ({
    p,
    n: COMMENTS.filter((c) => s.tags[c.id] === p.id && c.purpose === p.id).length,
    total: COMMENTS.filter((c) => c.purpose === p.id).length,
  }));
  const done = COMMENTS.every((c) => s.tags[c.id] === c.purpose);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="What did each comment achieve?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {COMMENTS.map((c) => {
            const t = s.tags[c.id];
            return (
              <div
                key={c.id}
                className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
              >
                <p>{c.text}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {PURPOSES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      aria-pressed={t === p.id}
                      onClick={() => set({ tags: { ...s.tags, [c.id]: p.id as Purpose } })}
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px]",
                        t === p.id
                          ? p.id === c.purpose
                            ? "border-good bg-good/20"
                            : "border-bad bg-bad/15"
                          : "border-line text-muted",
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                {t && (
                  <p
                    className={cn(
                      "mt-0.5 text-[10px]",
                      t === c.purpose ? "text-good" : "text-muted",
                    )}
                  >
                    {t === c.purpose ? c.why : "Look again: who benefits from this comment?"}
                  </p>
                )}
              </div>
            );
          })}
          {done && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-wrap gap-2 text-xs"
            >
              {counts.map(({ p, total }) => (
                <span
                  key={p.id}
                  className="border-line bg-surface-2 rounded-full border px-2.5 py-0.5"
                >
                  {p.label}: {total}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        Here is a whole review of the bill-splitting change. Tag each comment with what it mainly
        achieved.
      </p>
      <p>
        When you&apos;ve tagged them all, look at the totals. Two comments caught bugs. Six did
        something else: spreading knowledge, keeping code consistent, suggesting better designs.
      </p>
    </StepLayout>
  );
}

/* 3 ─ From inspection to review ------------------------------------------------------------------- */

export function History() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="From meeting rooms to pull requests"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">1976 · Formal inspections</p>
            <p className="text-muted">
              Michael Fagan at IBM: printed code, a moderator, a reader, a meeting, a written log of
              defects, follow-up. Thorough and slow.
            </p>
          </div>
          <div className="border-good/40 bg-good/10 rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Today · Modern code review</p>
            <p className="text-muted">
              Lightweight, tool-based and asynchronous, on every change. At Google in 2018 the
              median change was 24 lines, had one reviewer, and was reviewed in under four hours.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Code review used to be an event. Fagan&apos;s inspections gathered people in a room to read
        code line by line. They found many defects but cost a lot of time.
      </p>
      <p>
        Version control and pull requests made review continuous and small. GitHub, GitLab,
        Bitbucket, Azure DevOps and Gerrit all build their workflow around it.
      </p>
    </StepLayout>
  );
}

/* 4 ─ What review can't do ------------------------------------------------------------------------- */

export function Limits() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What review can't do"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "It doesn't replace tests",
              "Reviewers read; they rarely run every case. Tests check every time.",
            ],
            [
              "It misses things",
              "Even careful reviewers miss bugs, especially in large changes and in code they don't know.",
            ],
            [
              "It can't fix a bad process",
              "Huge, late pull requests get rubber-stamped, whatever the policy says.",
            ],
            [
              "It isn't a gate against people",
              "Used to show who's in charge, it stops the learning that makes it valuable.",
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
        You&apos;ll hear big numbers about how many defects inspections remove. They come from old
        consultancy data and vary from source to source, so treat them with care.
      </p>
      <p>
        The honest summary: review is one safety net among several (tests, automated checks,
        monitoring), and its most reliable payoff is people who understand each other&apos;s code.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function WhyCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Fact or myth?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="review-why"
            prompt="Sort each statement about code review."
            categories={[
              { id: "fact", label: "Fact" },
              { id: "myth", label: "Myth" },
            ]}
            items={[
              {
                id: "only",
                label: "The only point of review is finding bugs",
                category: "myth",
                why: "Knowledge sharing and consistency are big outcomes.",
              },
              {
                id: "two",
                label: "Review spreads understanding of the code across the team",
                category: "fact",
                why: "More than one person can maintain it.",
              },
              {
                id: "tests",
                label: "With review, you don't need tests",
                category: "myth",
                why: "Reviewers miss things; tests check every time.",
              },
              {
                id: "both",
                label: "Reviewers learn from authors too",
                category: "fact",
                why: "It's a conversation, not an exam.",
              },
              {
                id: "modern",
                label: "Modern review is usually small, tool-based and asynchronous",
                category: "fact",
                why: "Unlike 1970s inspection meetings.",
              },
            ]}
            explanation="Code review catches some bugs, but its biggest payoffs are shared knowledge, consistent code and better designs. It complements tests; it doesn't replace them."
          />
        </div>
      }
    >
      <p>Sort each statement.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["A second reader before merging", "That's code review."],
        ["More than bugs", "Knowledge, norms, better designs."],
        ["Knowledge flows both ways", "Authors and reviewers both learn."],
        ["Small and continuous", "Not a big meeting."],
        ["One safety net of several", "Alongside tests and automation."],
      ]}
    >
      <p>Next: what makes a pull request easy to review.</p>
    </WrapStep>
  );
}
