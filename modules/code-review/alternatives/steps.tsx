"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CHANGES, STYLES, type Style } from "./model";
import type { AltState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Kitchen() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Tasting the soup"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-3">
          {[
            ["Taste as you go", "Two cooks at one pot, adjusting together."],
            ["Taste before serving", "The head chef checks each plate at the pass."],
            ["Ask the diners", "Serve a simple dish, then listen to feedback."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface rounded-xl border p-3 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A kitchen checks food in different ways for different dishes. A tricky sauce gets tasted
        constantly; a plated main gets checked at the pass; a slice of bread just goes out.
      </p>
      <p>
        Waiting for a pull request review is only one way to get a second mind on code.{" "}
        <Term id="pair-programming">Pair programming</Term> reviews as you write; some teams merge
        small, safe changes first and review afterwards.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Choose ⭐ ------------------------------------------------------------------------------------ */

export function Choose() {
  const [s, set] = useSceneState<AltState>();
  const feedback = (cid: string, st: Style) => {
    const c = CHANGES.find((x) => x.id === cid)!;
    if (c.good.includes(st)) return { ok: true, text: c.why };
    const w = STYLES.find((x) => x.id === st)!;
    const min = Math.min(...c.good.map((g) => STYLES.find((x) => x.id === g)!.weight));
    return { ok: false, text: w.weight < min ? w.light : w.heavy };
  };
  const done = CHANGES.every((c) => s.picks[c.id] && c.good.includes(s.picks[c.id]));
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Pick a review style for each change"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="grid grid-cols-1 gap-1 text-[10px] sm:grid-cols-2">
            {STYLES.map((st) => (
              <div key={st.id} className="border-line bg-surface-2 rounded-md border px-2 py-1">
                <span className="font-semibold">{st.label}</span>
                <span className="text-muted"> · {st.desc}</span>
              </div>
            ))}
          </div>
          {CHANGES.map((c) => {
            const p = s.picks[c.id];
            const f = p && feedback(c.id, p);
            return (
              <div
                key={c.id}
                className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="min-w-0 basis-full sm:flex-1 sm:basis-auto">{c.text}</span>
                  <div className="flex gap-1">
                    {STYLES.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        aria-pressed={p === st.id}
                        onClick={() => set({ picks: { ...s.picks, [c.id]: st.id } })}
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[10px]",
                          p === st.id
                            ? f?.ok
                              ? "border-good bg-good/20"
                              : "border-bad bg-bad/15"
                            : "border-line text-muted",
                        )}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
                {f && (
                  <p className={cn("mt-0.5 text-[10px]", f.ok ? "text-good" : "text-muted")}>
                    {f.text}
                  </p>
                )}
              </div>
            );
          })}
          {done && (
            <p className="text-good text-xs">
              Five changes, five styles, the same goal: two minds on every change, matched to its
              risk.
            </p>
          )}
        </div>
      }
    >
      <p>
        Your team allows all five styles. Ship, Show and Ask come from Rouan Wilsenach&apos;s{" "}
        <Term id="ship-show-ask">Ship / Show / Ask</Term> (2021); pairing and mobbing review code as
        it&apos;s written.
      </p>
      <p>
        Choose the lightest style that&apos;s still safe for each change. Some changes have more
        than one sensible answer.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Pair and mob --------------------------------------------------------------------------------- */

export function PairMob() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Pairing and mobbing"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Pair programming</p>
            <p className="text-muted">
              Two people, one task. An original Extreme Programming practice (Kent Beck, 1999).
              Martin Fowler calls it continuous code review.
            </p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Mob programming</p>
            <p className="text-muted">
              The whole team, one task, one screen. Pioneered by Woody Zuill&apos;s team around
              2011; now often called ensemble programming or software teaming.
            </p>
          </div>
        </div>
      }
    >
      <p>
        In an early university experiment (Williams and colleagues, 2000), pairs spent about 15%
        more total effort and wrote code that passed about 15% more tests. Those were students on
        small tasks; a 2009 review of many studies found the benefit depends on the task and
        people&apos;s experience.
      </p>
      <p>Pairing costs time up front and saves review waiting later.</p>
    </StepLayout>
  );
}

/* 4 ─ Trunk-based ---------------------------------------------------------------------------------- */

export function Trunk() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Trunk-based teams and review"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Where PRs came from",
              "Open source, where contributors are strangers who can't be trusted with direct access. A full-time team may not need the same gate.",
            ],
            [
              "Short-lived branches",
              "Trunk-based teams keep branches to hours and review in minutes.",
            ],
            [
              "Review after merge",
              "Some leads read recent commits and follow up; Show makes this deliberate.",
            ],
            [
              "Check your rules",
              "Regulated teams may need a second person to review before merging; confirm what your auditors accept.",
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
        Teams practising <Term id="trunk-based-development">trunk-based development</Term> merge to
        main many times a day. Long review waits fight that, so they lean on pairing, small changes
        and fast reviews. Dave Farley, co-author of <em>Continuous Delivery</em>, prefers pairing to
        pull requests; that&apos;s one school of thought, not a consensus.
      </p>
      <p>Every option relies on a strong test suite and the ability to undo quickly.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function AltCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Ship, show or ask?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="review-alternatives"
            prompt="In Ship / Show / Ask, what does “Show” mean?"
            options={[
              {
                id: "a",
                label: "Merge to main with no pull request or review",
                feedback: "That's Ship.",
              },
              {
                id: "b",
                label:
                  "Open a pull request, merge it straight away, and let teammates review afterwards",
                correct: true,
                feedback: "Right: the team sees it and can comment, but nobody waits.",
              },
              {
                id: "c",
                label: "Open a pull request and wait for approval before merging",
                feedback: "That's Ask.",
              },
            ]}
            explanation="Ship skips review, Show reviews after merging, Ask reviews before. The author chooses the lane for each change, which depends on trust and good tests."
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
        ["PRs are one option", "Not the only way to review."],
        ["Pair and mob", "Review as you write."],
        ["Ship, Show, Ask", "Match the lane to the risk."],
        ["Needs safety nets", "Tests and quick undo."],
        ["Same goal", "Two minds on every change."],
      ]}
    >
      <p>Next: measuring review without making things worse.</p>
    </WrapStep>
  );
}
