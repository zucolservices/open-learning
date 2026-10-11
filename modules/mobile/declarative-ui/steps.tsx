"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CODE, MENU, changedRows, type Fw } from "./model";
import type { UiState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Board() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The menu board"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Instructions to a painter</p>
            <p className="text-muted">
              &ldquo;Rub out line 3. Write 45 where 40 was. Cross out the idli. Move the dosa up one
              line.&rdquo; Miss one step and the board is wrong.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Today&apos;s menu to a printer</p>
            <p className="text-muted">
              &ldquo;Here is what the menu is now.&rdquo; The printer compares it with the old board
              and reprints only the lines that changed.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        A café can update its menu board in two ways: give someone a list of edits, or hand over the
        new menu and let them work out the edits.
      </p>
      <p>
        Modern mobile screens use the second way. With{" "}
        <Term id="declarative-ui">declarative UI</Term> you write a function that describes the
        screen for the current data. When the data changes, the framework calls it again and changes
        only what differs.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Simulation ⭐ -------------------------------------------------------------------------------- */

export function Screen() {
  const [s, set] = useSceneState<UiState>();
  const fw = s.fw as Fw;
  const shown = MENU.filter((m) => !s.vegOnly || m.veg);
  const apply = (next: { qty: Record<string, number>; vegOnly: boolean }) =>
    set({
      ...next,
      changed: s.skip
        ? changedRows(s, next)
        : MENU.filter((m) => !next.vegOnly || m.veg).map((m) => m.id),
    });
  const total = shown.reduce((t, m) => t + (s.qty[m.id] ?? 0) * m.price, 0);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="One screen, three frameworks"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<Fw>
            value={fw}
            onChange={(v) => set({ fw: v })}
            size="sm"
            options={[
              ["swiftui", "SwiftUI"],
              ["compose", "Compose"],
              ["flutter", "Flutter"],
            ]}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <pre className="border-line bg-surface-2 overflow-x-auto rounded-lg border p-2 font-mono text-[10px] leading-snug whitespace-pre-wrap">
              {CODE[fw].code}
            </pre>
            <div className="border-line-strong bg-surface rounded-2xl border p-2 text-xs">
              <label className="mb-1.5 flex items-center gap-2 text-[11px]">
                <input
                  type="checkbox"
                  checked={s.vegOnly}
                  onChange={() => apply({ qty: s.qty, vegOnly: !s.vegOnly })}
                />
                Vegetarian only
              </label>
              <div className="grid gap-1">
                {shown.map((m) => {
                  const hot = s.changed.includes(m.id);
                  return (
                    <motion.div
                      key={`${m.id}-${hot ? s.changed.join() + JSON.stringify(s.qty) : "x"}`}
                      initial={hot ? { backgroundColor: "var(--color-accent-soft)" } : false}
                      animate={{ backgroundColor: "rgba(0,0,0,0)" }}
                      transition={{ duration: 1.2 }}
                      className={cn(
                        "flex min-w-0 items-center gap-2 rounded-md border px-2 py-1",
                        hot ? "border-accent" : "border-line",
                      )}
                    >
                      <span
                        className={cn("size-2 shrink-0 rounded-full", m.veg ? "bg-good" : "bg-bad")}
                      />
                      <span className="min-w-0 flex-1 truncate">{m.name}</span>
                      <span className="text-muted">₹{m.price}</span>
                      <button
                        type="button"
                        aria-label={`Add ${m.name}`}
                        onClick={() =>
                          apply({
                            qty: { ...s.qty, [m.id]: (s.qty[m.id] ?? 0) + 1 },
                            vegOnly: s.vegOnly,
                          })
                        }
                        className="border-line-strong rounded-full border px-2"
                      >
                        + {s.qty[m.id] ?? 0}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
              <p className="text-muted mt-1.5 text-right text-[11px]">Order total ₹{total}</p>
            </div>
          </div>
          <div className="border-line bg-surface-2 rounded-lg border px-3 py-2 text-xs">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={s.skip}
                onChange={() => set({ skip: !s.skip, changed: [] })}
              />
              Skip rows whose inputs didn&apos;t change
            </label>
            <p className="text-muted mt-1">
              {s.changed.length
                ? `Last change re-ran ${s.changed.length} of ${shown.length} rows (highlighted). `
                : "Add something or filter the menu. "}
              {CODE[fw].rerun}
            </p>
          </div>
        </div>
      }
    >
      <p>
        The code describes the menu for the current order. Tap + on a dish or filter the menu, and
        watch which rows the framework re-runs: this is{" "}
        <Term id="recomposition">recomposition</Term>.
      </p>
      <p>
        Switch frameworks: the words differ, but the idea is identical. You never write
        &ldquo;update the label on row 3&rdquo;. Turn skipping off to see how much extra work it
        saves.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Imperative vs declarative -------------------------------------------------------------------- */

export function Imperative() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Describing versus instructing"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <p className="text-muted text-xs">The chai sells out. What does the code have to do?</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Imperative (older UIKit and Android Views)</p>
              <ol className="text-muted mt-1 list-decimal pl-4">
                <li>Find the chai row&apos;s view</li>
                <li>Grey out its label</li>
                <li>Disable its + button</li>
                <li>Remove chai from the order</li>
                <li>Recalculate and redraw the total</li>
              </ol>
            </div>
            <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Declarative (SwiftUI, Compose, Flutter)</p>
              <ol className="text-muted mt-1 list-decimal pl-4">
                <li>Mark chai as sold out in the data</li>
              </ol>
              <p className="text-muted mt-1">
                The row and the total already describe how sold-out items look.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        With hand-written updates, every change is a chance to forget one step, and the screen
        drifts out of sync with the data. Describing the screen from the data removes that whole
        class of bug.
      </p>
      <p>
        Flutter 1.0 arrived in December 2018, SwiftUI in 2019 and Jetpack Compose 1.0 in July 2021.
        React Native applies the same idea to native views, and Apple&apos;s Observation framework
        (iOS 17) refreshes a view only when properties it actually reads change.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Lists ---------------------------------------------------------------------------------------- */

const VISIBLE = 9;

export function Lists() {
  const [s, set] = useSceneState<UiState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Lists that scale"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <label className="flex flex-col gap-1">
            <span>Items in the list: {s.rows.toLocaleString("en-IN")}</span>
            <input
              type="range"
              min={10}
              max={10000}
              step={10}
              value={s.rows}
              onChange={(e) => set({ rows: Number(e.target.value) })}
            />
          </label>
          {[
            ["Build every row up front", s.rows, "bad"],
            ["Lazy list: build only rows on screen", Math.min(VISIBLE, s.rows), "good"],
          ].map(([t, n, tone]) => (
            <div key={t as string}>
              <p className="flex justify-between">
                <span>{t}</span>
                <span className="font-mono">
                  {(n as number).toLocaleString("en-IN")} rows built
                </span>
              </p>
              <div className="bg-surface-2 mt-1 h-2 rounded-full">
                <motion.div
                  animate={{ width: `${Math.max(1, ((n as number) / 10000) * 100)}%` }}
                  className={cn("h-2 rounded-full", tone === "bad" ? "bg-bad" : "bg-good")}
                />
              </div>
            </div>
          ))}
          <p className="text-subtle text-[10px]">
            Illustrative: assumes about {VISIBLE} rows fit on screen.
          </p>
        </div>
      }
    >
      <p>
        A long menu or feed can&apos;t build every row at once. Lazy lists build only the rows on
        screen and create more as you scroll: <code>LazyColumn</code> in Compose,{" "}
        <code>ListView.builder</code> in Flutter and <code>List</code> in SwiftUI.
      </p>
      <p>
        Give each row a stable id (the dish&apos;s id, not its position), so the framework can tell
        which row is which when items are added, removed or reordered.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function UiCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The stale price"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="mobile-declarative"
            prompt="The café raises the chai price to ₹45. The data updates, but one screen still shows ₹40 until the app restarts. What's the most likely cause?"
            options={[
              {
                id: "copy",
                label:
                  "The screen copied the price into its own variable once, instead of reading it from the shared state",
                correct: true,
                feedback:
                  "Right. Its copy never changes, so nothing tells the framework to redraw.",
              },
              {
                id: "slow",
                label: "Declarative frameworks only redraw every few seconds",
                feedback: "No, they redraw on the next frame after state they read changes.",
              },
              {
                id: "lazy",
                label: "The list is lazy, so prices never update",
                feedback: "Lazy lists still update visible rows when their data changes.",
              },
              {
                id: "native",
                label: "Only fully native apps can show live data",
                feedback: "SwiftUI, Compose and Flutter all update the same way.",
              },
            ]}
            explanation="A screen updates when the state it reads changes. Copy the data into a private variable and the framework has no reason to redraw it: keep one source of truth and read from it."
          />
        </div>
      }
    >
      <p>Pick the most likely cause.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Describe, don't instruct", "UI is a function of state."],
        ["State changes, screen follows", "The framework works out the edits."],
        ["Unchanged rows are skipped", "Recompose only what changed."],
        ["Lazy lists scale", "Build only rows on screen, with stable ids."],
        ["One source of truth", "Copies of data go stale."],
      ]}
    >
      <p>Next: moving between screens.</p>
    </WrapStep>
  );
}
