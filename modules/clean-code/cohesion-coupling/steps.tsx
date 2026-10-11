"use client";

import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CHANGES, FILES, ITEMS, START, crossCalls, filesTouched } from "./model";
import type { CohesionState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Kitchen() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Stations in a kitchen"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Grouped by tool</p>
            <p className="text-muted">
              All the knives in one corner, all the pans in another. Making one dosa means walking
              to five places.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Grouped by dish</p>
            <p className="text-muted">
              A dosa station with everything for dosas. Changing the dosa recipe happens in one
              place.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        A kitchen organised by type of tool looks tidy, but every dish needs things from everywhere.
        A kitchen organised into stations keeps everything one dish needs together.
      </p>
      <p>
        Code is the same. <Term id="cohesion">Cohesion</Term> means things that change together live
        together. <Term id="coupling">Coupling</Term> is how much separate parts depend on each
        other. Aim for high cohesion and loose coupling, and a change stays in one place.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Rearrange ⭐ --------------------------------------------------------------------------------- */

export function Rearrange() {
  const [s, set] = useSceneState<CohesionState>();
  const move = (id: string, file: string) => set({ layout: { ...s.layout, [id]: file } });
  const used = FILES.filter((f) => ITEMS.some((i) => s.layout[i.id] === f));
  const total = CHANGES.reduce((t, c) => t + filesTouched(s.layout, c.touches), 0);
  return (
    <StepLayout
      eyebrow="Build"
      title="Rearrange the code by what changes together"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1 sm:grid-cols-2">
            {ITEMS.map((i) => (
              <label
                key={i.id}
                className="border-line bg-surface flex items-center justify-between gap-2 rounded-lg border px-3 py-1 text-xs"
              >
                <span>{i.label}</span>
                <select
                  aria-label={`File for ${i.label}`}
                  value={s.layout[i.id]}
                  onChange={(e) => move(i.id, e.target.value)}
                  className="border-line-strong bg-surface rounded border px-1 py-0.5 font-mono text-[10px]"
                >
                  {FILES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {used.map((f) => (
              <div
                key={f}
                className="border-line bg-surface-2 rounded-lg border px-2 py-1 text-[10px]"
              >
                <p className="font-mono font-semibold">{f}</p>
                {ITEMS.filter((i) => s.layout[i.id] === f).map((i) => (
                  <p key={i.id} className="text-muted">
                    {i.label}
                  </p>
                ))}
              </div>
            ))}
          </div>
          <div className="grid gap-1">
            {CHANGES.map((c) => {
              const n = filesTouched(s.layout, c.touches);
              return (
                <div
                  key={c.label}
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-3 py-1 text-xs",
                    n === 1 ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
                  )}
                >
                  <span>{c.label}</span>
                  <span className="font-mono">
                    {n} file{n > 1 ? "s" : ""}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span>
              Files touched by all four changes: <span className="font-mono">{total}</span>
            </span>
            <span>
              Calls between files: <span className="font-mono">{crossCalls(s.layout)}</span>
            </span>
            <button
              type="button"
              onClick={() => set({ layout: { ...START } })}
              className="border-line-strong ml-auto flex items-center gap-1 rounded-full border px-2 py-0.5"
            >
              <RotateCcw className="size-3" /> Reset
            </button>
          </div>
        </div>
      }
    >
      <p>
        This café&apos;s code is grouped by kind: a <code>utils</code> file, a <code>service</code>{" "}
        file and a <code>helpers</code> file. Four change requests each touch several files.
      </p>
      <p>
        Move each responsibility into a file named after what it&apos;s about. Aim for every change
        touching one file. Watch the calls between files too: some coupling is natural (receipts
        need prices), but it should be deliberate.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Where the ideas come from --------------------------------------------------------------------- */

export function Origins() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Old ideas that still hold"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "1972",
              "Information hiding",
              "David Parnas: divide a system by the decisions likely to change, and hide each one inside a module.",
            ],
            [
              "1974",
              "Coupling and cohesion",
              "Stevens, Myers and Constantine named the two forces, later expanded in Structured Design (1979).",
            ],
            [
              "1992",
              "Connascence",
              "Meilir Page-Jones: two parts are connascent if changing one forces a change in the other. Name, type, meaning, order…",
            ],
            [
              "2018",
              "Change amplification",
              "John Ousterhout: a symptom of complexity is a simple change needing edits in many places.",
            ],
          ].map(([y, t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface flex gap-3 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-mono">{y}</span>
              <span>
                <span className="font-semibold">{t}</span>
                <span className="text-muted block">{b}</span>
              </span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        These ideas are over fifty years old and still at the heart of good design. Parnas&apos;s
        insight is the key one: split code around the decisions most likely to change, so each
        change has one home.
      </p>
      <p>The same thinking scales up to services and teams, as the System Design track shows.</p>
    </StepLayout>
  );
}

/* 4 ─ Loose to tight ------------------------------------------------------------------------------- */

export function Spectrum() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="From loose to tight coupling"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            ["Passes plain values", "total(items) gets a list and returns a number.", "loose"],
            [
              "Passes a whole object",
              "Gets the full order but uses one field: now it depends on the order's shape.",
              "mid",
            ],
            [
              "Passes a flag that steers it",
              "receipt(order, true) means the caller controls its insides.",
              "mid",
            ],
            [
              "Shares global state",
              "Both read and write a global settings object: any change can surprise the other.",
              "tight",
            ],
            ["Reaches into internals", "Edits another module's private data directly.", "tight"],
          ].map(([t, b, k], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs",
                k === "tight"
                  ? "border-bad/40 bg-bad/10"
                  : k === "loose"
                    ? "border-good/40 bg-good/10"
                    : "border-line bg-surface",
              )}
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Not all dependencies are equal. The looser the connection, the more freely each side can
        change. Passing exactly what&apos;s needed beats passing everything; returning a result
        beats reaching into someone else&apos;s data.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function CohesionCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Cohesive or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="clean-cohesion"
            prompt="Is each file cohesive (one reason to change) or a grab bag?"
            categories={[
              { id: "cohesive", label: "Cohesive" },
              { id: "grab", label: "Grab bag" },
            ]}
            items={[
              {
                id: "utils",
                label: "utils.js: dates, GST, email templates, retries",
                category: "grab",
                why: "Four unrelated reasons to change.",
              },
              {
                id: "pricing",
                label: "pricing.js: item totals, discounts, GST",
                category: "cohesive",
                why: "All about the price of an order.",
              },
              {
                id: "receipts",
                label: "receipts.js: format and send receipts",
                category: "cohesive",
                why: "One topic.",
              },
              {
                id: "common",
                label: "common.js: anything used in two places",
                category: "grab",
                why: "Grouped by reuse, not meaning.",
              },
              {
                id: "booking",
                label: "booking.js: availability, reserve, cancel",
                category: "cohesive",
                why: "One feature's rules.",
              },
            ]}
            explanation="Group code by what it's about, so each file has one reason to change. Files named utils or common usually collect unrelated things."
          />
        </div>
      }
    >
      <p>Sort each file.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Group by what changes together", "Not by kind of code."],
        ["One change, one place", "Many files per change means low cohesion."],
        ["Loose coupling", "Depend on as little as possible, as simply as possible."],
        ["Hide decisions", "Parnas: split around what's likely to change."],
        ["Beware utils", "A grab bag has many reasons to change."],
      ]}
    >
      <p>Next: SOLID, five design principles, and the arguments about them.</p>
    </WrapStep>
  );
}
