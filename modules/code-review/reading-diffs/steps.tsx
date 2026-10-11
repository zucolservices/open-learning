"use client";

import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ALPHABETICAL, DESCRIPTION, FILES, SMART, attentionAt, spotted } from "./model";
import type { ReadState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function TownMap() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Look at the map before the streets"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-bad/40 bg-bad/10 rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Street by street, alphabetically</p>
            <p className="text-muted">
              By the time you reach the street that matters, you&apos;re tired and lost.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-good/40 bg-good/10 rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Map first</p>
            <p className="text-muted">
              See where you&apos;re going, walk the main road while fresh, then explore side
              streets.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        Nobody explores a new town by walking every street in alphabetical order. You look at the
        map, then walk the main road while you&apos;re fresh.
      </p>
      <p>
        Review tools list a pull request&apos;s files alphabetically, so the most important file can
        land anywhere. A <Term id="diff">diff</Term> is much easier to understand, and bugs much
        easier to spot, if you choose the order: purpose first, then tests, then the core change.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Choose the order ⭐ -------------------------------------------------------------------------- */

export function ReadOrder() {
  const [s, set] = useSceneState<ReadState>();
  const read = (id: string) => !s.order.includes(id) && set({ order: [...s.order, id] });
  const testsFirst =
    s.order.indexOf("tests") > -1 && s.order.indexOf("tests") < s.order.indexOf("api");
  const found = spotted(s.order, s.description, testsFirst);
  const coreRead = s.order.includes("api");
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Choose the order you read the files"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label
            className={cn(
              "flex items-start gap-1.5 rounded-lg border px-3 py-1.5 text-xs",
              s.description ? "border-good/50 bg-good/10" : "border-line bg-surface",
            )}
          >
            <input
              type="checkbox"
              checked={s.description}
              onChange={(e) => set({ description: e.target.checked })}
              className="accent-accent mt-0.5"
            />
            <span>
              Read the description first: <span className="text-muted">{DESCRIPTION}</span>
            </span>
          </label>
          <div className="grid gap-1">
            {FILES.map((f) => {
              const pos = s.order.indexOf(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  disabled={pos > -1}
                  onClick={() => read(f.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-left text-xs disabled:cursor-default",
                    pos > -1
                      ? "border-line-strong bg-surface-2"
                      : "border-line bg-surface hover:border-line-strong",
                  )}
                >
                  <span className="text-muted w-5 font-mono text-[10px]">
                    {pos > -1 ? pos + 1 : ""}
                  </span>
                  <span className="font-mono text-[11px]">{f.path}</span>
                  <span className="text-muted ml-auto font-mono text-[10px]">+{f.lines}</span>
                  {pos > -1 && (
                    <span className="text-muted text-[10px]">
                      attention {attentionAt(pos, s.description)}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() => set({ order: ALPHABETICAL, description: false })}
              className="border-line-strong rounded-full border px-3 py-1"
            >
              Read alphabetically
            </button>
            <button
              type="button"
              onClick={() => set({ order: SMART, description: true })}
              className="border-line-strong rounded-full border px-3 py-1"
            >
              Description, tests, then core
            </button>
            {s.order.length > 0 && (
              <button
                type="button"
                onClick={() => set({ order: [], description: false })}
                className="border-line-strong flex items-center gap-1 rounded-full border px-3 py-1"
              >
                <RotateCcw className="size-3" /> Start again
              </button>
            )}
          </div>
          {coreRead && (
            <motion.p
              key={`${s.order.join()}-${s.description}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn("text-xs", found ? "text-good" : "text-bad")}
            >
              {found
                ? "Spotted: points are added before the payment is confirmed. The tests said “only for paid orders”, so the mismatch stood out."
                : "You skimmed src/loyalty.ts and approved. Points get awarded for orders that later fail to pay."}
            </motion.p>
          )}
          <p className="text-subtle text-[10px]">The attention model is illustrative.</p>
        </div>
      }
    >
      <p>
        Click the files in the order you&apos;d read them, or try the two preset orders. Your
        attention drains a little with each file. The bug is in <code>src/loyalty.ts</code>.
      </p>
      <p>
        Reading the description and the tests first tells you what the code is <em>meant</em> to do,
        so a mismatch in the core file jumps out.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Evidence ------------------------------------------------------------------------------------- */

export function Position() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="File order changes what gets found"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">219,476 pull requests on GitHub</p>
            <p className="text-muted">
              Files shown earlier in the alphabetical list received more review comments (Fregnan
              and colleagues, 2022).
            </p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">An experiment with 106 developers</p>
            <p className="text-muted">
              One of two planted bugs had 64% lower odds of being found when its file came last. The
              other bug showed no such effect, so position matters sometimes, not always.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Reviewers are people, and attention runs out. Research suggests the order files are shown in
        can change what gets noticed.
      </p>
      <p>
        You can&apos;t change your tool&apos;s ordering, but you can choose your own path through
        the files.
      </p>
    </StepLayout>
  );
}

/* 4 ─ A strategy ----------------------------------------------------------------------------------- */

export function Strategy() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="A reading strategy"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Take a broad view",
              "Read the description. Does this change make sense at all? If not, say so before anything else.",
            ],
            [
              "Find the main part",
              "The file with the core logic. Review it first, while you're fresh.",
            ],
            [
              "Read the tests",
              "They show intended behaviour; some reviewers read them before the code.",
            ],
            ["Then the rest, in a sensible order", "Configuration, migrations, UI, docs."],
            ["Run it if in doubt", "Check out the branch or open the preview build and try it."],
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
        Google&apos;s guide &ldquo;Navigating a CL in review&rdquo; gives the same three steps: take
        a broad view, examine the main parts first, then look through the rest in a sensible order.
      </p>
      <p>
        If the main part has a serious design problem, say so straight away; there&apos;s no point
        polishing the rest.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function ReadCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Plan your reading"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="review-reading"
            prompt="Drag these into a good order for reviewing a pull request."
            items={[
              { id: "desc", label: "Read the description: what and why" },
              { id: "sense", label: "Decide whether the change makes sense at all" },
              { id: "core", label: "Review the main file with the core logic" },
              { id: "rest", label: "Look through the remaining files" },
              { id: "comment", label: "Write up your comments, most important first" },
            ]}
            explanation="Broad view first, then the core while you're fresh, then the rest. Lead your review with the most important points."
          />
        </div>
      }
    >
      <p>Drag the steps into order.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Map before streets", "Description and purpose first."],
        ["Core while fresh", "Don't let the alphabet decide."],
        ["Tests show intent", "Mismatches stand out."],
        ["Attention runs out", "Small PRs help; so does order."],
        ["Run it when unsure", "Reading isn't the only way to review."],
      ]}
    >
      <p>Next: turning what you notice into comments people can use.</p>
    </WrapStep>
  );
}
