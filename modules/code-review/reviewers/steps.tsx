"use client";

import { motion } from "motion/react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { COUNTS, FILES, RULES, owner, type Count } from "./model";
import { initialState, type ReviewersState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Hospital() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Who reads the X-ray?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Sent to everyone on the ward",
              "Each doctor assumes another has looked. It sits unread.",
              "border-bad/40 bg-bad/10",
            ],
            [
              "Sent to a radiologist",
              "Read quickly, by someone who knows what to look for.",
              "border-good/40 bg-good/10",
            ],
            [
              "Radiologist plus a trainee",
              "Read well, and next year there are two people who can do it.",
              "border-good/40 bg-good/10",
            ],
          ].map(([t, b, c], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
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
        A hospital doesn&apos;t send every X-ray to the whole ward. It routes each one to someone
        who knows how to read it, and often a trainee looks too, so the skill spreads.
      </p>
      <p>
        Pull requests need the same routing. The right reviewer either knows the code or is learning
        it on purpose. A <Term id="codeowners">CODEOWNERS</Term> file does the routing
        automatically.
      </p>
    </StepLayout>
  );
}

/* 2 ─ CODEOWNERS ⭐ -------------------------------------------------------------------------------- */

export function Owners() {
  const [s, set] = useSceneState<ReviewersState>();
  const move = (i: number, d: -1 | 1) => {
    const o = [...s.order];
    [o[i], o[i + d]] = [o[i + d], o[i]];
    set({ order: o });
  };
  const results = FILES.map((f) => ({ ...f, got: owner(s.order, f.path) }));
  const solved = results.every((r) => r.got?.owner === r.want);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Route four files to the right owners"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface overflow-hidden rounded-lg border font-mono text-[11px]">
            <p className="border-line bg-surface-2 border-b px-3 py-1 font-sans text-[10px] font-medium">
              .github/CODEOWNERS
            </p>
            {s.order.map((id, i) => {
              const r = RULES.find((x) => x.id === id)!;
              return (
                <motion.div layout key={id} className="flex items-center gap-2 px-2 py-1">
                  <span className="text-subtle w-4 text-right">{i + 1}</span>
                  <span className="w-24">{r.pattern}</span>
                  <span className="text-muted flex-1">{r.owner}</span>
                  <button
                    type="button"
                    aria-label={`Move ${r.pattern} up`}
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                    className="border-line-strong rounded border p-0.5 disabled:opacity-30"
                  >
                    <ArrowUp className="size-3" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Move ${r.pattern} down`}
                    disabled={i === s.order.length - 1}
                    onClick={() => move(i, 1)}
                    className="border-line-strong rounded border p-0.5 disabled:opacity-30"
                  >
                    <ArrowDown className="size-3" />
                  </button>
                </motion.div>
              );
            })}
          </div>
          <div className="grid gap-1">
            {results.map((r) => {
              const ok = r.got?.owner === r.want;
              return (
                <div
                  key={r.path}
                  className={cn(
                    "flex flex-wrap items-center gap-x-2 rounded-lg border px-3 py-1.5 text-xs",
                    ok ? "border-good/40 bg-good/10" : "border-line bg-surface",
                  )}
                >
                  <span className="font-mono text-[11px]">{r.path}</span>
                  <span className="text-muted">→ {r.got?.owner ?? "nobody"}</span>
                  <span className="text-subtle ml-auto text-[10px]">
                    {ok ? "right owner" : `should be ${r.want}`}
                  </span>
                </div>
              );
            })}
          </div>
          {solved ? (
            <p className="text-good text-xs">
              Catch-all first, then specific rules, with the rule that should win an overlap last.
              Every file now goes to the people who know it.
            </p>
          ) : (
            <button
              type="button"
              onClick={() => set({ order: initialState.order })}
              className="text-muted self-start text-[10px] underline"
            >
              Reset the file
            </button>
          )}
        </div>
      }
    >
      <p>
        Each line says &ldquo;files matching this pattern are owned by these people&rdquo;. When a
        pull request touches a file, its owners are asked to review automatically.
      </p>
      <p>
        The catch: when several lines match, <strong>the last one wins</strong>. Reorder the lines
        so each file reaches the team it should. GitLab&apos;s Code Owners works the same way.
      </p>
    </StepLayout>
  );
}

/* 3 ─ How many ------------------------------------------------------------------------------------- */

export function HowMany() {
  const [s, set] = useSceneState<ReviewersState>();
  const c = COUNTS.find((x) => x.id === s.count)!;
  return (
    <StepLayout
      eyebrow="Explore"
      title="How many reviewers?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<Count>
            size="sm"
            value={s.count}
            onChange={(count) => set({ count })}
            options={COUNTS.map((x) => [x.id, x.label])}
          />
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              c.id === "five" ? "border-bad/40 bg-bad/10" : "border-line bg-surface",
            )}
          >
            {c.outcome}
          </motion.div>
        </div>
      }
    >
      <p>
        Peter Rigby and Christian Bird found many projects settle on about two reviewers, with
        little gain from more. At Google the median is one. What matters more is <em>who</em>: at
        Microsoft, reviewers who had worked on a file before left more useful comments.
      </p>
      <p>
        Whatever the number, name a person. A request to a whole team is easy for everyone to leave
        for someone else.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Spreading knowledge -------------------------------------------------------------------------- */

export function Spread() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Reviewing to spread knowledge"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Expert plus learner",
              "One owner checks correctness; a second reviewer is new to the area.",
            ],
            ["Round robin", "GitHub can assign team reviews in turn, or by fewest open reviews."],
            ["Watch the load", "If one expert reviews everything, they become the bottleneck."],
            ["Raise the bus factor", "Aim for at least two people who could maintain each area."],
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
        Review is one of the main ways knowledge moves around a team. Rigby and Bird estimated it
        increased the number of files a developer knew about by 66 to 150 percent.
      </p>
      <p>
        The <Term id="bus-factor">bus factor</Term> is how many people could leave before an area
        has nobody who understands it. Choosing reviewers deliberately keeps it above one.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function ReviewersCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Fix the routing"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="review-reviewers"
            prompt="A CODEOWNERS file has “/api/ @api-team” on line 1 and “* @everyone” on line 2. Who is asked to review a change to api/orders.ts?"
            options={[
              {
                id: "api",
                label: "@api-team",
                feedback: "It matches line 1, but line 2 matches too, and the last match wins.",
              },
              {
                id: "all",
                label: "@everyone",
                correct: true,
                feedback:
                  "Right: line 2 matches every file and comes last, so it wins. Move the catch-all to the top.",
              },
              {
                id: "both",
                label: "Both teams",
                feedback:
                  "Only one line applies: the last one that matches. List several owners on one line if you want both.",
              },
            ]}
            explanation="In CODEOWNERS the last matching pattern wins, so put the catch-all first and the most specific rules last."
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
        ["Route to people who know", "Or who are learning on purpose."],
        ["Last match wins", "Catch-all first in CODEOWNERS."],
        ["About one or two", "More reviewers adds little."],
        ["Name a person", "Team-wide requests wait."],
        ["Spread the knowledge", "Keep the bus factor above one."],
      ]}
    >
      <p>Next: letting machines check what they can before a person looks.</p>
    </WrapStep>
  );
}
