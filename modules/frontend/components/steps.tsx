"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { PRODUCTS, PROPS, STYLES, TREE } from "./model";
import type { CompState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Bricks() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Building with bricks"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="flex gap-1">
            {["bg-viz-data/50", "bg-viz-meta/50", "bg-viz-compute/50", "bg-viz-data/50"].map(
              (c, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.12 * i }}
                  className={cn("h-8 w-12 rounded", c)}
                />
              ),
            )}
          </div>
          <div className="flex gap-1">
            {["bg-viz-meta/50", "bg-viz-data/50", "bg-viz-meta/50"].map((c, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + 0.12 * i }}
                className={cn("h-8 w-16 rounded", c)}
              />
            ))}
          </div>
          <p className="text-muted text-xs">Same few bricks, any number of builds.</p>
        </div>
      }
    >
      <p>
        A toy brick set has only a few kinds of brick, but you can build a house, a car or a
        spaceship. Each brick has a standard way to connect, so pieces fit anywhere.
      </p>
      <p>
        Modern interfaces are built the same way, from <Term id="component">components</Term>:
        small, reusable pieces of UI. Each one takes inputs, called <Term id="props">props</Term>,
        and returns what should appear on screen.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Props ⭐ ------------------------------------------------------------------------------------- */

export function Props() {
  const [s, set] = useSceneState<CompState>();
  const has = (id: string) => s.props.includes(id);
  const toggle = (id: string) =>
    set({ props: has(id) ? s.props.filter((x) => x !== id) : [...s.props, id] });
  const extra = PROPS.filter((p) => !p.needed && has(p.id));
  const done = PROPS.every((p) => p.needed === has(p.id));
  return (
    <StepLayout
      eyebrow="Build and connect"
      title="Decide what a ProductCard needs"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {PROPS.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={has(p.id)}
                onClick={() => toggle(p.id)}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 font-mono text-[11px]",
                  has(p.id)
                    ? p.needed
                      ? "border-good bg-good/20"
                      : "border-bad bg-bad/15"
                    : "border-line-strong text-muted",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="border-line bg-surface-2 flex items-center justify-between rounded-lg border px-3 py-1.5 text-xs">
            <span className="text-muted">App · cart</span>
            <span className="font-mono">{s.cart} items</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {PRODUCTS.map((p) => (
              <div
                key={p.id}
                className="border-line bg-surface flex flex-col items-center gap-1 rounded-lg border p-2 text-center text-xs"
              >
                <span className="text-2xl">{has("photo") ? p.emoji : "?"}</span>
                <span className="font-medium">{has("name") ? p.name : "???"}</span>
                <span className="text-muted">{has("price") ? `₹${p.price}` : "₹?"}</span>
                <button
                  type="button"
                  disabled={!has("onAdd")}
                  onClick={() => set({ cart: s.cart + 1 })}
                  className="border-line-strong rounded-full border px-2 py-0.5 text-[10px] disabled:opacity-40"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
          <div className="min-h-10 text-[11px]">
            {extra.map((p) => (
              <p key={p.id} className="text-bad">
                {p.label}: {p.note}
              </p>
            ))}
            {done && (
              <p className="text-good">
                Exactly what it needs. The card is reusable for any product, and the cart lives in
                one place: App.
              </p>
            )}
          </div>
        </div>
      }
    >
      <p>
        One ProductCard component renders all three products; only the props differ. Choose which
        props it receives and watch the cards fill in.
      </p>
      <p>
        Data flows down as props. To change something above it, like the cart, a child calls a
        function its parent handed down. That&apos;s{" "}
        <Term id="one-way-data-flow">one-way data flow</Term>.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The tree ------------------------------------------------------------------------------------- */

export function Tree() {
  const [s, set] = useSceneState<CompState>();
  const region = (id: string, cls: string, label: string) => (
    <div
      className={cn(
        "rounded border border-dashed px-2 py-1 text-[10px] transition-colors",
        s.hover === id ? "border-accent bg-accent-soft" : "border-line-strong",
        cls,
      )}
    >
      {label}
    </div>
  );
  return (
    <StepLayout
      eyebrow="Explore"
      title="A page is a tree of components"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="grid gap-0.5 font-mono text-[11px]">
            {TREE.map((n) => (
              <button
                key={n.id}
                type="button"
                onMouseEnter={() => set({ hover: n.id })}
                onFocus={() => set({ hover: n.id })}
                onClick={() => set({ hover: n.id })}
                className={cn("rounded px-1 text-left", s.hover === n.id && "bg-surface-2")}
                style={{ paddingLeft: 4 + n.depth * 14 }}
              >
                {n.label}
              </button>
            ))}
          </div>
          <div
            className={cn(
              "grid gap-1 rounded-lg border p-2",
              s.hover === "app" ? "border-accent" : "border-line",
            )}
          >
            <div
              className={cn(
                "flex gap-1 rounded border border-dashed p-1",
                s.hover === "header" ? "border-accent bg-accent-soft" : "border-line-strong",
              )}
            >
              {region("search", "flex-1", "SearchBox")}
              {region("cart", "", "Cart")}
            </div>
            <div
              className={cn(
                "grid grid-cols-3 gap-1 rounded border border-dashed p-1",
                s.hover === "grid" ? "border-accent bg-accent-soft" : "border-line-strong",
              )}
            >
              {[0, 1, 2].map((i) => (
                <div key={i}>{region("card", "h-10", "Card")}</div>
              ))}
            </div>
            {region("footer", "", "Footer")}
          </div>
        </div>
      }
    >
      <p>
        Point at a component in the tree to see where it sits on the page. React&apos;s guide calls
        this the first step of building any UI: break it into a hierarchy.
      </p>
      <p>
        A good split gives each component one job. Shared data lives in the nearest common parent;
        here, App owns the cart so both CartButton and each ProductCard can use it.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Four styles ---------------------------------------------------------------------------------- */

export function Styles() {
  const [s, set] = useSceneState<CompState>();
  const st = STYLES.find((x) => x.id === s.style)!;
  return (
    <StepLayout
      eyebrow="Explore"
      title="The same component, four ways"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<string>
            size="sm"
            value={s.style}
            onChange={(style) => set({ style })}
            options={STYLES.map((x) => [x.id, x.label])}
          />
          <pre className="border-line bg-surface overflow-x-auto rounded-lg border p-3 font-mono text-[10.5px]">
            {st.code.join("\n")}
          </pre>
        </div>
      }
    >
      <p>
        React uses JavaScript functions returning JSX; Vue and Svelte use single files with
        template, script and styles; web components are built into the browser and work with any
        framework.
      </p>
      <p>
        The ideas are identical: inputs in, UI out, events back up. Learn them once and you can read
        any framework.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function CompCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Updating the cart"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="frontend-components"
            prompt="Clicking Add on a ProductCard must update the count shown in the Header. Where should the cart live?"
            options={[
              {
                id: "card",
                label: "In each ProductCard, which then updates the Header directly",
                feedback:
                  "Siblings can't reach into each other, and three cards would each have their own count.",
              },
              {
                id: "app",
                label:
                  "In their common parent, which passes the count to the Header and an onAdd function to each card",
                correct: true,
                feedback:
                  "Right: one source of truth, data flows down, changes flow up through the callback.",
              },
              {
                id: "header",
                label: "In the Header, with each card keeping its own copy",
                feedback: "Copies drift out of sync. Keep one copy, in the nearest common parent.",
              },
            ]}
            explanation="Put shared data in the closest common parent. Pass values down as props and pass functions down so children can ask for changes."
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
        ["Small, reusable pieces", "Each with one job."],
        ["Props in, UI out", "Props are read-only."],
        ["Data down, events up", "One-way data flow."],
        ["Shared data in a parent", "The nearest common one."],
        ["Same idea everywhere", "React, Vue, Svelte, web components."],
      ]}
    >
      <p>Next: state, the data that changes, and how the screen keeps up.</p>
    </WrapStep>
  );
}
