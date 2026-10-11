"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DECLARATIVE, FRAMEWORKS, IMPERATIVE, MENU } from "./model";
import type { StateState } from "./state";

const price = (id: string) => MENU.find((m) => m.id === id)!.price;

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Scoreboard() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Two scoreboards, one match"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            ["North stand", "India 214/3", "border-line bg-surface"],
            ["South stand", "India 208/3", "border-bad/50 bg-bad/10"],
          ].map(([t, sc, c]) => (
            <div key={t} className={cn("rounded-xl border p-3 text-center text-xs", c)}>
              <p className="text-muted">{t}</p>
              <p className="font-mono text-xl font-semibold">{sc}</p>
            </div>
          ))}
          <p className="text-muted text-xs sm:col-span-2">
            Each board is updated by hand. Someone missed a boundary.
          </p>
        </div>
      }
    >
      <p>
        A cricket ground with two scoreboards, each updated by a different person, will sooner or
        later show two different scores. Which one is right?
      </p>
      <p>
        Interfaces have the same risk. <Term id="ui-state">State</Term> is data that changes over
        time, like what&apos;s in a cart. Keep one copy, and work out everything else from it, so
        the screen can never disagree with itself.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Cart ⭐ -------------------------------------------------------------------------------------- */

export function Cart() {
  const [s, set] = useSceneState<StateState>();
  const realTotal = s.items.reduce((t, i) => t + price(i), 0);
  const count = s.derived ? s.items.length : s.storedCount;
  const total = s.derived ? realTotal : s.storedTotal;
  const drift = !s.derived && (count !== s.items.length || total !== realTotal);
  const add = (id: string) =>
    set({
      items: [...s.items, id],
      storedCount: s.storedCount + 1,
      storedTotal: s.storedTotal + price(id),
      renders: s.renders + 1,
    });
  const remove = (i: number) => {
    const id = s.items[i];
    // The duplicated version "forgets" to update the stored count on remove: a typical bug.
    set({
      items: s.items.filter((_, k) => k !== i),
      storedTotal: s.storedTotal - price(id),
      renders: s.renders + 1,
    });
  };
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Duplicated state versus derived values"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<string>
            size="sm"
            value={s.derived ? "derived" : "dup"}
            onChange={(v) =>
              set({
                derived: v === "derived",
                items: [],
                storedCount: 0,
                storedTotal: 0,
                renders: s.renders + 1,
              })
            }
            options={[
              ["dup", "Count and total stored separately"],
              ["derived", "Calculated from the items"],
            ]}
          />
          <div className="flex flex-wrap gap-1">
            {MENU.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => add(m.id)}
                className="border-line-strong rounded-full border px-3 py-1 text-xs"
              >
                + {m.name} ₹{m.price}
              </button>
            ))}
          </div>
          <div
            className={cn(
              "flex items-center justify-between rounded-lg border px-3 py-1.5 text-xs",
              drift ? "border-bad/50 bg-bad/10" : "border-line bg-surface-2",
            )}
          >
            <span>Header</span>
            <span className="font-mono">{count} items</span>
          </div>
          <div className="border-line bg-surface min-h-16 rounded-lg border p-2 text-xs">
            {s.items.length === 0 && <p className="text-subtle">Cart is empty.</p>}
            {s.items.map((id, i) => (
              <motion.div
                layout
                key={`${id}-${i}`}
                className="flex items-center justify-between py-0.5"
              >
                <span>{MENU.find((m) => m.id === id)!.name}</span>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="text-muted text-[10px] underline"
                >
                  remove
                </button>
              </motion.div>
            ))}
          </div>
          <div
            className={cn(
              "flex items-center justify-between rounded-lg border px-3 py-1.5 text-xs",
              drift ? "border-bad/50 bg-bad/10" : "border-line bg-surface-2",
            )}
          >
            <span>Summary</span>
            <span className="font-mono">₹{total}</span>
          </div>
          <p
            className={cn(
              "text-xs",
              drift ? "text-bad" : s.derived && s.items.length ? "text-good" : "text-muted",
            )}
          >
            {drift
              ? `The header says ${count} items, but the list has ${s.items.length}. Someone forgot to update the count on remove.`
              : s.derived && s.items.length
                ? "Count and total are calculated from the items on every render, so they can't drift."
                : "Add a few items, then remove one."}
          </p>
          <p className="text-subtle text-[10px]">
            Each change re-renders the cart: {s.renders} renders so far.
          </p>
        </div>
      }
    >
      <p>
        Here the header count and the summary total are each stored as their own state and updated
        by hand. Add items, remove one, and watch what happens. Then switch to calculating them from
        the item list.
      </p>
      <p>
        Every change to state triggers a <Term id="re-render">re-render</Term>: the framework runs
        the component again with the new data.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Declarative ---------------------------------------------------------------------------------- */

export function Declarative() {
  const [s, set] = useSceneState<StateState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Describe the result, not the steps"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<string>
            size="sm"
            value={s.declarative ? "d" : "i"}
            onChange={(v) => set({ declarative: v === "d" })}
            options={[
              ["i", "Imperative: change the page by hand"],
              ["d", "Declarative: UI from state"],
            ]}
          />
          <pre className="border-line bg-surface overflow-x-auto rounded-lg border p-3 font-mono text-[10.5px]">
            {(s.declarative ? DECLARATIVE : IMPERATIVE).join("\n")}
          </pre>
        </div>
      }
    >
      <p>
        Without a framework, you update each bit of the page yourself, and every new feature adds
        another place to forget. That&apos;s the two-scoreboards problem.
      </p>
      <p>
        Frameworks let you write the UI as a function of state: describe what it should look like
        for any data, and the framework updates the page to match.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Frameworks ----------------------------------------------------------------------------------- */

export function Frameworks() {
  const [s, set] = useSceneState<StateState>();
  const f = FRAMEWORKS.find((x) => x.id === s.fw)!;
  return (
    <StepLayout
      eyebrow="Explore"
      title="State and derived values in four frameworks"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<string>
            size="sm"
            value={s.fw}
            onChange={(fw) => set({ fw })}
            options={FRAMEWORKS.map((x) => [x.id, x.label])}
          />
          <pre className="border-line bg-surface overflow-x-auto rounded-lg border p-3 font-mono text-[10.5px]">
            {f.code.join("\n")}
          </pre>
        </div>
      }
    >
      <p>
        Every framework has the same two ideas: a way to hold state, and a way to derive values from
        it. React&apos;s docs put it plainly: if something can be calculated from existing state,
        don&apos;t store it; calculate it during rendering.
      </p>
      <p>
        &ldquo;Single source of truth&rdquo; doesn&apos;t mean all state in one place: each piece
        has one owner.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function StateCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Store it or derive it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="frontend-state"
            prompt="Should each value be stored as state, or calculated from other state?"
            categories={[
              { id: "store", label: "Store as state" },
              { id: "derive", label: "Calculate from state" },
            ]}
            items={[
              {
                id: "items",
                label: "The items in the cart",
                category: "store",
                why: "Changes when the user acts; can't be worked out.",
              },
              {
                id: "total",
                label: "The cart total",
                category: "derive",
                why: "Sum of the items.",
              },
              {
                id: "query",
                label: "The text typed in the search box",
                category: "store",
                why: "User input.",
              },
              {
                id: "results",
                label: "Products matching the search text",
                category: "derive",
                why: "Filter the list by the query.",
              },
              {
                id: "open",
                label: "Whether the menu is open",
                category: "store",
                why: "Changes on click.",
              },
            ]}
            explanation="Store the minimum: things users change. Calculate everything else from it, so nothing can fall out of sync."
          />
        </div>
      }
    >
      <p>Sort each value.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["State changes over time", "Changing it re-renders."],
        ["Keep it minimal", "Store only what users change."],
        ["Derive the rest", "Totals, counts, filtered lists."],
        ["One owner per piece", "No duplicated copies."],
        ["UI from state", "Describe the result."],
      ]}
    >
      <p>Next: how different frameworks find what changed and update the screen.</p>
    </WrapStep>
  );
}
