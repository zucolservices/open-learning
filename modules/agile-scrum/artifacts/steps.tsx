"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ScrumGuideCredit } from "../_shared/scrum-guide-credit";
import { CANDIDATES, DOD, PAIRS } from "./content";
import type { ArtifactsState } from "./state";

/* 1 ─ Three artifacts, three promises (build & connect) ------------------------------------------ */

const RIGHT_ORDER = [2, 0, 1]; // commitments shown shuffled

export function Connect() {
  const [s, set] = useSceneState<ArtifactsState>();
  const linked = (i: number) => s.links[String(i)] === i;
  const allDone = PAIRS.every((_, i) => linked(i));
  const tryLink = (c: number) => {
    if (s.sel < 0) return;
    set({ links: { ...s.links, [String(s.sel)]: c }, sel: -1 });
  };
  return (
    <StepLayout
      eyebrow="Build & connect"
      title="Three artifacts, three promises"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <p className="text-muted text-xs">
            Click an artifact on the left, then the commitment it goes with.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid content-start gap-2">
              {PAIRS.map((p, i) => {
                const l = s.links[String(i)];
                const wrong = l !== undefined && l !== i;
                return (
                  <button
                    key={p.artifact}
                    type="button"
                    disabled={linked(i)}
                    aria-pressed={s.sel === i}
                    onClick={() => set({ sel: i })}
                    className={cn(
                      "rounded-xl border px-3 py-3 text-left text-sm font-semibold",
                      linked(i)
                        ? "border-good bg-good/10"
                        : s.sel === i
                          ? "border-accent bg-accent-soft"
                          : wrong
                            ? "border-bad bg-bad/5"
                            : "border-line bg-surface hover:bg-surface-2",
                    )}
                  >
                    <span className="bg-viz-data/20 mr-2 rounded px-1.5 py-0.5 text-[10px] font-normal">
                      artifact
                    </span>
                    {p.artifact}
                    {linked(i) && <span className="text-good ml-1 text-xs">→ {p.commitment}</span>}
                  </button>
                );
              })}
            </div>
            <div className="grid content-start gap-2">
              {RIGHT_ORDER.map((c) => {
                const used = linked(c);
                return (
                  <button
                    key={PAIRS[c].commitment}
                    type="button"
                    disabled={used || s.sel < 0}
                    onClick={() => tryLink(c)}
                    className={cn(
                      "rounded-xl border px-3 py-3 text-left text-sm font-semibold disabled:cursor-default",
                      used
                        ? "border-good bg-good/10 opacity-60"
                        : s.sel >= 0
                          ? "border-accent/60 bg-surface hover:bg-accent-soft"
                          : "border-line bg-surface",
                    )}
                  >
                    <span className="bg-accent-soft mr-2 rounded px-1.5 py-0.5 text-[10px] font-normal">
                      commitment
                    </span>
                    {PAIRS[c].commitment}
                  </button>
                );
              })}
            </div>
          </div>
          {Object.entries(s.links).some(([a, c]) => Number(a) !== c) && !allDone && (
            <p className="text-bad flex items-center gap-1.5 text-xs">
              <X className="size-3.5" /> Not that one. Each artifact has exactly one commitment. Try
              again.
            </p>
          )}
          <AnimatePresence>
            {allDone && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-2"
              >
                {PAIRS.map((p) => (
                  <div
                    key={p.artifact}
                    className="border-line bg-surface rounded-xl border px-3 py-2 text-xs"
                  >
                    <p className="font-semibold">
                      {p.artifact} → {p.commitment}
                    </p>
                    <p className="text-muted mt-0.5">&ldquo;{p.commitmentQuote}&rdquo;</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <ScrumGuideCredit />
        </div>
      }
    >
      <p>
        A wedding caterer keeps three things: the master menu for the whole wedding, today&apos;s
        prep list, and each finished dish. Each comes with a promise: a memorable wedding; lunch for
        300 by one o&apos;clock; every dish passes the head chef&apos;s check.
      </p>
      <p>
        Scrum&apos;s three <Term id="scrum-artifact">artifacts</Term> work the same way. &ldquo;Each
        artifact contains a commitment to ensure it provides information that enhances transparency
        and focus against which progress can be measured.&rdquo;
      </p>
      <p className="text-muted text-sm">
        The Product Goal and the idea of a commitment per artifact arrived in the 2020 Scrum Guide.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Is it an Increment yet? ⭐ ------------------------------------------------------------------ */

export function IsItDone() {
  const [s, set] = useSceneState<ArtifactsState>();
  return (
    <StepLayout
      eyebrow="Test it"
      title="Is it an Increment yet?"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="text-muted text-[11px]">
              The team&apos;s Definition of Done (an example)
            </p>
            <ol className="mt-1 grid gap-0.5 text-xs">
              {DOD.map((d, i) => (
                <li key={d}>
                  <span className="text-muted font-mono">{i + 1}.</span> {d}
                </li>
              ))}
            </ol>
          </div>
          {CANDIDATES.map((c) => {
            const done = c.meets.length === DOD.length;
            const call = s.calls[c.id];
            const missing = DOD.filter((_, i) => !c.meets.includes(i));
            return (
              <div key={c.id} className="border-line bg-surface rounded-xl border px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{c.label}</p>
                  <div className="flex gap-1">
                    {[
                      ["done", "Done: it's an Increment"],
                      ["not", "Not Done"],
                    ].map(([id, l]) => (
                      <button
                        key={id}
                        type="button"
                        aria-pressed={call === id}
                        onClick={() => set({ calls: { ...s.calls, [c.id]: id } })}
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-[11px]",
                          call === id
                            ? "border-accent bg-accent-soft"
                            : "border-line hover:bg-surface-2",
                        )}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {DOD.map((d, i) => (
                    <span
                      key={d}
                      title={d}
                      className={cn(
                        "grid size-6 place-items-center rounded font-mono text-[10px]",
                        c.meets.includes(i) ? "bg-good/20 text-good" : "bg-bad/15 text-bad",
                      )}
                    >
                      {c.meets.includes(i) ? <Check className="size-3" /> : i + 1}
                    </span>
                  ))}
                </div>
                {call && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "mt-2 text-xs",
                      (call === "done") === done ? "text-good" : "text-bad",
                    )}
                  >
                    {done
                      ? call === "done"
                        ? "Right: every item met. “The moment a Product Backlog item meets the Definition of Done, an Increment is born.” It can even be released before the Sprint ends."
                        : "It meets every item on the list, so it's Done: an Increment is born."
                      : call === "not"
                        ? `Right. Missing: ${missing.join(", ")}. It “returns to the Product Backlog for future consideration”, and can't be shown at the Sprint Review as if it were done.`
                        : `Not yet: missing ${missing.join(", ")}. “Work cannot be considered part of an Increment unless it meets the Definition of Done.” Nearly done counts as not done.`}
                  </motion.p>
                )}
              </div>
            );
          })}
          <ScrumGuideCredit />
        </div>
      }
    >
      <p>
        The <Term id="definition-of-done">Definition of Done</Term> is the quality bar every piece
        of work must clear. Check each item against it. The ticks show which parts of the definition
        it meets.
      </p>
      <p className="text-muted text-sm">
        There&apos;s no &ldquo;90% done&rdquo;. And the definition covers the whole Increment, not
        one story: &ldquo;If there are multiple Scrum Teams working together on a product, they must
        mutually define and comply with the same Definition of Done.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 3 ─ Is this a Product Goal? ------------------------------------------------------------------- */

export function GoodGoal() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Is this a Product Goal?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="good-goal"
            prompt="Which of these could work as the portal's Product Goal?"
            categories={[
              { id: "good", label: "Works as a Product Goal" },
              { id: "weak", label: "Not really" },
            ]}
            items={[
              {
                id: "future",
                label:
                  "Every citizen can apply for and track Revenue Department certificates online, without visiting an office",
                category: "good",
                why: "A future state of the product, long-term, that the team can plan against.",
              },
              {
                id: "list",
                label: "Finish all 120 items in the backlog by March",
                category: "weak",
                why: "That's a to-do list and a date, not a future state of the product. The backlog should emerge to serve the goal.",
              },
              {
                id: "vague",
                label: "Improve the portal",
                category: "weak",
                why: "Too vague to be “a target for the Scrum Team to plan against”.",
              },
              {
                id: "feature",
                label: "Build the SMS module",
                category: "weak",
                why: "One feature, perhaps a Sprint's work. The Product Goal is “the long-term objective”.",
              },
              {
                id: "offices",
                label:
                  "District offices handle half as many walk-in enquiries because citizens self-serve online",
                category: "good",
                why: "Describes a future state and an outcome; the backlog can emerge to reach it.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        The guide: &ldquo;The Product Goal is the long-term objective for the Scrum Team. They must
        fulfill (or abandon) one objective before taking on the next.&rdquo; It sets no template.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Ready for a Sprint? ----------------------------------------------------------------------- */

export function ReadyOrRefine() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Ready for a Sprint?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="ready-refine"
            prompt="Could each item be selected for the next Sprint, or does it need refining first?"
            categories={[
              { id: "ready", label: "Ready for selection" },
              { id: "refine", label: "Refine it first" },
            ]}
            items={[
              {
                id: "upload",
                label:
                  "Citizens can attach a scanned document to an application (clear, and a few days' work)",
                category: "ready",
                why: "Understood well enough, and it can be Done within one Sprint.",
              },
              {
                id: "rebuild",
                label: "Rebuild the whole portal on a new framework",
                category: "refine",
                why: "Far too big for one Sprint. Break it into smaller items first.",
              },
              {
                id: "inbox",
                label: "Officer's inbox (nobody knows yet which fields officers need)",
                category: "refine",
                why: "Needs detail: talk to officers, then describe and size it.",
              },
              {
                id: "footer",
                label: "Correct the helpline number in the footer",
                category: "ready",
                why: "Small and clear. Nothing to refine.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        The guide&apos;s only test: items &ldquo;that can be Done by the Scrum Team within one
        Sprint are usually deemed ready for selection&rdquo;.
      </p>
      <p className="text-muted text-sm">
        Getting items there is <Term id="refinement">refinement</Term>: &ldquo;the act of breaking
        down and further defining Product Backlog items into smaller more precise items. This is an
        ongoing activity&rdquo;, not an event.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "Product Backlog → Product Goal",
    "An ordered list of what's needed, aimed at one long-term future state.",
  ],
  ["Sprint Backlog → Sprint Goal", "This Sprint's why, what and how, with one objective."],
  [
    "Increment → Definition of Done",
    "Only work that meets the whole definition counts. No partial credit.",
  ],
  ["Refinement never stops", "An ongoing activity, not an event or a gate."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        About a &ldquo;Definition of Ready&rdquo;: it isn&apos;t in the Scrum Guide, and Mike Cohn
        warns that a strict one &ldquo;becomes a huge step towards a sequential, stage-gate
        approach&rdquo;. Use a light checklist if it helps; don&apos;t let it become a gate.
      </p>
      <p>That completes the Scrum chapter. Next: writing the backlog itself, with user stories.</p>
    </StepLayout>
  );
}
