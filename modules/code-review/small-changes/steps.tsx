"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { PARTS, prs } from "./model";
import type { SmallState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Plates() {
  return (
    <StepLayout
      eyebrow="Story"
      title="One plate at a time"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-bad/40 bg-bad/10 rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">A twelve-course tasting at once</p>
            <p className="text-muted">
              The head chef can&apos;t taste everything properly. They glance, nod, and hope.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-good/40 bg-good/10 rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">One plate at a time</p>
            <p className="text-muted">
              Each gets a real taste and quick feedback. The next plate is already better.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        Put twelve dishes in front of a head chef at once and they&apos;ll skim. Bring them one at a
        time and each gets proper attention, and feedback arrives while the cook can still use it.
      </p>
      <p>
        Pull requests work the same way. Small ones get careful reviews and quick answers; huge ones
        wait for someone with a free afternoon, then get a glance and an approval. Splitting a big
        change into a <Term id="stacked-changes">stack</Term> of small ones is the single biggest
        thing an author can do.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Split it ⭐ ---------------------------------------------------------------------------------- */

export function SplitIt() {
  const [s, set] = useSceneState<SmallState>();
  const list = prs(s.split);
  const careful = list.filter((p) => p.careful).reduce((t, p) => t + p.lines, 0);
  const maxWait = Math.max(...list.map((p) => p.waitHours));
  const toggle = (id: string) =>
    set({ split: s.split.includes(id) ? s.split.filter((x) => x !== id) : [...s.split, id] });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Split a 1,200-line change into a stack"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1">
            {PARTS.map((p) => (
              <label
                key={p.id}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg border px-3 py-1 text-xs",
                  s.split.includes(p.id) ? "border-good/50 bg-good/10" : "border-line bg-surface",
                )}
              >
                <span className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={s.split.includes(p.id)}
                    onChange={() => toggle(p.id)}
                    className="accent-accent"
                  />
                  {p.label}
                </span>
                <span className="text-muted font-mono text-[10px]">{p.lines} lines</span>
              </label>
            ))}
          </div>
          <p className="text-muted text-[10px]">
            Ticked parts become their own pull requests, stacked in this order.
          </p>
          <div className="grid gap-1">
            {list.map((p, i) => (
              <motion.div
                key={p.parts.join()}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs",
                  p.careful ? "border-line bg-surface" : "border-bad/40 bg-bad/10",
                )}
              >
                <span className="font-mono text-[10px]">PR {i + 1}</span>
                <span
                  className="bg-accent/60 h-2 rounded"
                  style={{ width: `${Math.min(100, p.lines / 12)}%` }}
                />
                <span className="font-mono">{p.lines}</span>
                <span className="text-muted ml-auto text-[10px]">
                  {p.careful ? "read carefully" : "likely skimmed"} · first review in ~{p.waitHours}{" "}
                  h
                </span>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Lines that get a careful review</p>
              <p className="font-mono text-base">{careful} / 1,200</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Longest wait for a first review</p>
              <p className="font-mono text-base">~{maxWait} h</p>
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            Waiting times and the 400-line threshold are illustrative rules of thumb.
          </p>
        </div>
      }
    >
      <p>
        You&apos;ve built loyalty points for a café app: 1,200 lines in one pull request. Tick parts
        to send them as separate, stacked pull requests, and watch what happens to review depth and
        waiting time.
      </p>
      <p>
        The refactor goes first on its own: &ldquo;no behaviour change&rdquo; is quick to check. The
        tests can travel with the code they test.
      </p>
    </StepLayout>
  );
}

/* 3 ─ How small ------------------------------------------------------------------------------------ */

export function HowSmall() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="How small is small?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-good/40 bg-good/10 rounded-lg border px-3 py-2 text-xs">
            “100 lines is usually a reasonable size for a CL, and 1000 lines is usually too large,
            but it&apos;s up to the judgment of your reviewer.”
            <span className="text-muted block text-[10px]">
              Google engineering practices, “Small CLs”
            </span>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">At Google, the median change was 24 lines</p>
            <p className="text-muted">Sadowski and colleagues, 2018, from millions of reviews.</p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">“Under 200, not to exceed 400” lines per review</p>
            <p className="text-muted">
              A 2006 study of one Cisco team for the vendor SmartBear, also suggesting sessions
              under an hour. A single team and not peer-reviewed, but widely quoted and in line with
              the rest.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Different sources give different numbers, but they point the same way: changes of a few
        hundred lines or less get reviewed properly; changes of thousands mostly don&apos;t.
      </p>
      <p>
        Size isn&apos;t only lines: 200 lines in one file is easier than 200 lines spread across 30.
      </p>
    </StepLayout>
  );
}

/* 4 ─ How to split --------------------------------------------------------------------------------- */

export function HowSplit() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Ways to split a change"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            ["Refactor first", "Separate “no behaviour change” clean-ups from the feature."],
            [
              "Stack",
              "Send one small change; start the next on top of it while the first is reviewed.",
            ],
            ["By layer", "Database, then API, then user interface."],
            ["By slice", "A thin end-to-end slice of the feature first, then widen it."],
            [
              "Hide unfinished work",
              "Merge small pieces behind a feature flag before the feature is complete.",
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
        Stacking used to need extra tools such as Graphite, Sapling or git-branchless. In October
        2026 GitHub made stacked pull requests a built-in feature, and Gerrit has always reviewed
        chains of dependent changes.
      </p>
      <p>
        Small changes matter even more now that AI assistants can generate hundreds of lines in
        seconds: review capacity, not typing speed, is the limit.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function SmallCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Split it or keep it together?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="review-small"
            prompt="Should each pair go in separate pull requests or the same one?"
            categories={[
              { id: "split", label: "Separate PRs" },
              { id: "together", label: "Same PR" },
            ]}
            items={[
              {
                id: "refactor",
                label: "A big rename, and a new feature using the new names",
                category: "split",
                why: "Rename first; the feature PR then shows only the feature.",
              },
              {
                id: "test",
                label: "A bug fix and the test that reproduces it",
                category: "together",
                why: "The test is the evidence for the fix.",
              },
              {
                id: "format",
                label: "A one-line fix and reformatting the whole file",
                category: "split",
                why: "Reformatting hides the fix.",
              },
              {
                id: "layers",
                label: "A new database table and the screens that will use it next month",
                category: "split",
                why: "Different reviewers, different timing.",
              },
              {
                id: "doc",
                label: "A changed API and the documentation for that change",
                category: "together",
                why: "Docs belong with the change they describe.",
              },
            ]}
            explanation="Keep a change and its evidence (tests, docs) together; split unrelated work, refactors and large layers into their own small pull requests."
          />
        </div>
      }
    >
      <p>Sort each pair.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Small reviews are better reviews", "Read carefully, answered sooner."],
        ["Rules of thumb", "About 100–400 lines; thousands is too many."],
        ["Refactor separately", "No-behaviour-change PRs review fast."],
        ["Stack dependent work", "Built into many tools now."],
        ["Keep evidence together", "Tests and docs travel with the change."],
      ]}
    >
      <p>Next: writing the description that tells reviewers why.</p>
    </WrapStep>
  );
}
