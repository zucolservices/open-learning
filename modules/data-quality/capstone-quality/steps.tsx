"use client";

import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ACTIONS, DEFENCES, HYPOTHESES, REPAIR } from "./model";
import type { CapState } from "./state";

/* 1 ─ The number on slide 3 ----------------------------------------------------------------------- */

export function Slide() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The number on slide 3"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="border-line bg-surface w-full max-w-sm rounded-xl border px-5 py-4 shadow-sm">
            <p className="text-muted text-[10px]">BOARD PACK · SLIDE 3</p>
            <p className="mt-1 text-sm font-semibold">September revenue</p>
            <p className="font-mono text-3xl font-semibold">€4.72M</p>
            <p className="text-good text-xs">▲ 21% on August</p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="border-bad bg-bad/10 w-full max-w-sm rounded-xl border px-4 py-3 text-xs"
          >
            CFO: &ldquo;The bank says we took about €4.0M. Why is this 18% higher? The board meets
            Thursday.&rdquo;
          </motion.div>
        </div>
      }
    >
      <p>
        You look after data at a made-up online homeware shop. On Monday the CFO spots that
        September revenue in the board pack is about 18% higher than what actually reached the bank.
      </p>
      <p>
        Everything in this track now comes together: find the cause, contain and repair it, and
        choose the defences that would have caught it. The company and numbers are fictional; the
        pattern is very real.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Find the cause ⭐ --------------------------------------------------------------------------- */

export function Investigate() {
  const [s, set] = useSceneState<CapState>();
  const done = s.actions ?? [];
  const useful = done.filter((id) => ACTIONS.find((a) => a.id === id)?.useful).length;
  const h = HYPOTHESES.find((x) => x.id === s.hypothesis);
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Find the cause"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5">
            {ACTIONS.map((a) => {
              const seen = done.includes(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => !seen && set({ actions: [...done, a.id] })}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-left text-xs",
                    seen
                      ? a.useful
                        ? "border-accent bg-accent-soft"
                        : "border-line bg-surface-2"
                      : "border-line bg-surface hover:bg-surface-2",
                  )}
                >
                  <span className="font-semibold">{a.label}</span>
                  {seen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-muted mt-0.5 block"
                    >
                      {a.clue}
                    </motion.span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="border-line bg-surface rounded-xl border px-3 py-2">
            <p className="text-muted text-[10px]">
              YOUR DIAGNOSIS {useful < 2 && "· gather at least two useful clues first"}
            </p>
            <div className="mt-1 grid gap-1 sm:grid-cols-2">
              {HYPOTHESES.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  disabled={useful < 2}
                  aria-pressed={s.hypothesis === x.id}
                  onClick={() => set({ hypothesis: x.id })}
                  className={cn(
                    "rounded-md border px-2 py-1 text-left text-[11px] disabled:opacity-40",
                    s.hypothesis === x.id
                      ? x.correct
                        ? "border-good bg-good/10"
                        : "border-bad bg-bad/10"
                      : "border-line",
                  )}
                >
                  {x.label}
                </button>
              ))}
            </div>
            {h && (
              <motion.p
                key={h.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("mt-2 text-xs", h.correct ? "text-good" : "text-bad")}
              >
                {h.correct ? "Found it. " : "Not this one. "}
                {h.why}
              </motion.p>
            )}
          </div>
          <p className="text-muted text-[11px]">{done.length} checks run.</p>
        </div>
      }
    >
      <p>
        Run checks to gather clues, then name the cause. Good detectives start broad and cheap:
        reconcile against an independent source to find when the gap started, then look at what
        changed that day.
      </p>
      <p>
        Some checks rule things out rather than pointing at the answer. That&apos;s useful too, but
        notice which ones moved you forward.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Contain and repair -------------------------------------------------------------------------- */

export function Repair() {
  const [s, set] = useSceneState<CapState>();
  const picks = s.picks ?? [];
  const step = picks.length;
  const done = step >= REPAIR.length;
  const d = REPAIR[Math.min(step, REPAIR.length - 1)];
  const chosen = picks.map((id, i) => REPAIR[i].choices.find((c) => c.id === id)!).filter(Boolean);
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Contain and repair"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {chosen.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-xl border px-4 py-2 text-xs",
                c.good ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
              )}
            >
              <p className="text-muted text-[10px]">{REPAIR[i].prompt}</p>
              <p>{c.outcome}</p>
            </motion.div>
          ))}
          {!done ? (
            <div className="border-line bg-surface rounded-xl border px-4 py-3">
              <p className="text-sm font-semibold">{d.prompt}</p>
              <div className="mt-2 flex flex-col gap-1.5">
                {d.choices.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => set({ picks: [...picks, c.id] })}
                    className="border-line hover:bg-surface-2 rounded-lg border px-3 py-1.5 text-left text-xs"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <p className="text-muted text-sm">
                {chosen.every((c) => c.good)
                  ? "Contained before Thursday, repaired at the source, and every affected team told."
                  : "Try again: each choice changes how the week goes."}
              </p>
              <button
                type="button"
                onClick={() => set({ picks: [] })}
                className="text-muted flex shrink-0 items-center gap-1 text-xs"
              >
                <RotateCcw className="size-3" /> Replay
              </button>
            </div>
          )}
        </div>
      }
    >
      <p>
        You know the cause: checkout started using a new status, and nobody told the revenue model.
        Now run the <Term id="data-incident">incident</Term>: tell the people relying on the number,
        fix it properly, and find everyone else who used it.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Choose your defences ------------------------------------------------------------------------ */

export function Defences() {
  const [s, set] = useSceneState<CapState>();
  const chosen = s.defences ?? [];
  const toggle = (id: string) =>
    set({
      defences: chosen.includes(id)
        ? chosen.filter((x) => x !== id)
        : chosen.length < 3
          ? [...chosen, id]
          : chosen,
    });
  const picked = DEFENCES.filter((d) => chosen.includes(d.id));
  const firstDay = Math.min(
    ...picked.filter((d) => d.day !== null && d.day >= 0).map((d) => d.day as number),
  );
  const hasOwner = chosen.includes("owner");
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Choose your defences"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-[11px]">Pick up to three. ({chosen.length} of 3)</p>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {DEFENCES.map((d) => (
              <button
                key={d.id}
                type="button"
                aria-pressed={chosen.includes(d.id)}
                onClick={() => toggle(d.id)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-xs",
                  chosen.includes(d.id)
                    ? d.day === -1
                      ? "border-bad bg-bad/10"
                      : "border-good bg-good/10"
                    : "border-line bg-surface",
                )}
              >
                <span className="font-semibold">{d.label}</span>
                {chosen.includes(d.id) && <span className="text-muted mt-0.5 block">{d.when}</span>}
              </button>
            ))}
          </div>
          {picked.length > 0 && (
            <motion.div
              key={chosen.join()}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-xl border px-3 py-2 text-xs",
                Number.isFinite(firstDay) ? "border-good bg-good/10" : "border-bad bg-bad/10",
              )}
            >
              {Number.isFinite(firstDay)
                ? firstDay === 0
                  ? "Caught before the change ever shipped."
                  : `Caught ${firstDay} day${firstDay === 1 ? "" : "s"} after the change, instead of nearly three weeks later by the CFO.`
                : "None of these would have caught it: the CFO still finds it at the board meeting."}
              {Number.isFinite(firstDay) &&
                (hasOwner
                  ? " And the alert reaches an owner who acts."
                  : " Who gets the alert, though? Without an owner it may sit unread.")}
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        Without any defences, the CFO found the problem nearly three weeks in. Choose three defences
        and see when each would have caught it. Some sound sensible but would never have fired for
        this fault.
      </p>
      <p>
        <Term id="defence-in-depth">Layer them</Term>: a contract to prevent, a test to stop the
        build, a reconciliation or monitor as a safety net, and an owner to respond. No single check
        catches everything.
      </p>
    </StepLayout>
  );
}

/* 5 ─ It happens to everyone ---------------------------------------------------------------------- */

export function RealWorld() {
  const cases: [string, string][] = [
    [
      "Airbnb, 2019–2020",
      "Data scientists couldn't tell which tables to trust. A company-wide initiative gave every important dataset an owner, landing-time SLAs, built-in checks and a 'Midas Certified' badge after reviews.",
    ],
    [
      "LinkedIn, 2018",
      "A data problem cut job views by 40–60%. It took five engineers eight days to find the cause and eleven to fix it; LinkedIn then built Data Sentinel to validate data automatically.",
    ],
    [
      "Uber, 2020–2021",
      "Learned what normal looks like for each table from history and alerted per table to limit alert fatigue, later standardising checks for freshness, completeness and duplicates.",
    ],
    [
      "England, 2020",
      "Nearly 16,000 COVID cases were left out of reports because an old spreadsheet format silently cut off rows. A row-count check would have caught it.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="It happens to everyone"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {cases.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-0.5">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The capstone is fictional, but real organisations have lived versions of it. Their fixes
        look like this track&apos;s table of contents: owners, service levels, tests in pipelines,
        monitoring, reconciliation and trusted, certified datasets.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Which layer? -------------------------------------------------------------------------------- */

export function Layers() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which layer?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="defence-layer"
            prompt="What does each defence mainly do?"
            categories={[
              { id: "prevent", label: "Prevent" },
              { id: "detect", label: "Detect" },
              { id: "respond", label: "Respond" },
            ]}
            items={[
              {
                id: "contract",
                label: "A data contract checked in the producer's CI",
                category: "prevent",
                why: "Stops the breaking change shipping.",
              },
              {
                id: "registry",
                label: "A schema registry set to BACKWARD",
                category: "prevent",
                why: "Rejects incompatible schemas.",
              },
              {
                id: "recon",
                label: "A daily reconciliation against the bank",
                category: "detect",
                why: "Finds differences after they happen.",
              },
              {
                id: "monitor",
                label: "A volume anomaly monitor",
                category: "detect",
                why: "Flags unusual data.",
              },
              {
                id: "owner",
                label: "A named owner with an incident process",
                category: "respond",
                why: "Makes sure alerts become action.",
              },
              {
                id: "backfill",
                label: "An idempotent backfill job",
                category: "respond",
                why: "Repairs safely.",
              },
            ]}
            explanation="Prevent breaking changes at the source, detect what gets through with tests, reconciliation and monitors, and respond with owners, incident practice and safe repairs."
          />
        </div>
      }
    >
      <p>Sort the defences.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Fitness for use", "Quality means the data is fit for the decision."],
  ["Test, contract, monitor", "Prevent at the source; detect the rest."],
  ["Owners and service levels", "Someone answers for every important dataset."],
  ["Lineage and reconciliation", "Find causes, impact and proof."],
  ["Calm incidents", "Contain, tell, repair, learn without blame."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {POINTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        That&apos;s the Data Quality track. Trustworthy data isn&apos;t one tool; it&apos;s habits:
        clear owners, written promises, checks where data enters and changes, and a calm, blameless
        response when something still slips through.
      </p>
    </StepLayout>
  );
}
