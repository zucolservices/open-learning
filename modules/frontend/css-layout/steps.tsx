"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { COLUMNS, GOALS, type Align, type Dir, type Justify } from "./model";
import type { LayoutState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Shelves() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Shelves and pigeonholes"
      stage={
        <div className="grid flex-1 content-center gap-4 sm:grid-cols-2">
          <div className="text-xs">
            <p className="mb-1 font-semibold">One shelf: flexbox</p>
            <div className="border-line-strong flex justify-between gap-1 rounded border-b-4 p-2">
              {["Tea", "Coffee", "Juice", "Water"].map((t) => (
                <div
                  key={t}
                  className="bg-viz-data/25 border-viz-data rounded border px-1.5 py-3 text-[10px]"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs">
            <p className="mb-1 font-semibold">Pigeonholes: grid</p>
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "border-viz-meta bg-viz-meta/20 rounded border py-3",
                    i === 0 && "col-span-2",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <p>
        A shop arranges things two ways: along a shelf, where items line up in one direction, and in
        pigeonholes, where each item sits in a row <em>and</em> a column.
      </p>
      <p>
        CSS has a tool for each. <Term id="flexbox">Flexbox</Term> lines items up in one direction;{" "}
        <Term id="css-grid">grid</Term> places them in two. And every item is a box with its own
        padding and border, like packaging around a product.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Flexbox sandbox ⭐ --------------------------------------------------------------------------- */

export function Flex() {
  const [s, set] = useSceneState<LayoutState>();
  const update = (patch: Partial<LayoutState>) => {
    const f = { dir: s.dir, justify: s.justify, align: s.align, gap: s.gap, ...patch };
    const met = [...s.met];
    for (const g of GOALS) if (g.met(f) && !met.includes(g.id)) met.push(g.id);
    set({ ...patch, met });
  };
  return (
    <StepLayout
      eyebrow="Sandbox"
      title="Arrange a row with flexbox"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5 text-[11px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted w-28 font-mono">flex-direction</span>
              <Segmented<Dir>
                size="sm"
                value={s.dir}
                onChange={(dir) => update({ dir })}
                options={[
                  ["row", "row"],
                  ["column", "column"],
                ]}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted w-28 font-mono">justify-content</span>
              <Segmented<Justify>
                size="sm"
                value={s.justify}
                onChange={(justify) => update({ justify })}
                options={[
                  ["flex-start", "start"],
                  ["center", "center"],
                  ["space-between", "space-between"],
                ]}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted w-28 font-mono">align-items</span>
              <Segmented<Align>
                size="sm"
                value={s.align}
                onChange={(align) => update({ align })}
                options={[
                  ["stretch", "stretch"],
                  ["flex-start", "start"],
                  ["center", "center"],
                ]}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted w-28 font-mono">gap</span>
              <Segmented<string>
                size="sm"
                value={String(s.gap)}
                onChange={(g) => update({ gap: Number(g) })}
                options={[
                  ["0", "0"],
                  ["8", "8px"],
                  ["16", "16px"],
                ]}
              />
            </div>
          </div>
          <div
            className="border-line-strong bg-surface h-44 rounded-lg border border-dashed p-2"
            style={{
              display: "flex",
              flexDirection: s.dir,
              justifyContent: s.justify,
              alignItems: s.align,
              gap: s.gap,
            }}
          >
            {["Menu", "Order", "Help"].map((t) => (
              <motion.div
                layout
                key={t}
                className="border-viz-data bg-viz-data/25 rounded border px-3 py-1.5 text-xs"
              >
                {t}
              </motion.div>
            ))}
          </div>
          <pre className="text-muted font-mono text-[10.5px] whitespace-pre-wrap">{`display: flex; flex-direction: ${s.dir};\njustify-content: ${s.justify}; align-items: ${s.align}; gap: ${s.gap}px;`}</pre>
          <div className="grid gap-1">
            {GOALS.map((g) => (
              <p
                key={g.id}
                className={cn(
                  "rounded-md border px-2 py-1 text-[11px]",
                  s.met.includes(g.id)
                    ? "border-good/50 bg-good/10 text-good"
                    : "border-line text-muted",
                )}
              >
                {s.met.includes(g.id) ? "✓ " : "○ "}
                {g.text}
              </p>
            ))}
          </div>
        </div>
      }
    >
      <p>
        These three buttons sit in a flex container. Change the properties and watch them move.
        justify-content works along the main direction; align-items works across it.
      </p>
      <p>Try to reach all three goals. There&apos;s more than one way to get some of them.</p>
    </StepLayout>
  );
}

/* 3 ─ Grid ----------------------------------------------------------------------------------------- */

export function Grid() {
  const [s, set] = useSceneState<LayoutState>();
  const c = COLUMNS.find((x) => x.id === s.columns)!;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Rows and columns with grid"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {COLUMNS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.columns === x.id}
                onClick={() => set({ columns: x.id })}
                className={cn(
                  "rounded-full border px-2 py-0.5 font-mono text-[10px]",
                  s.columns === x.id ? "border-fg bg-surface-2" : "border-line text-muted",
                )}
              >
                {x.css}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={s.span} onChange={() => set({ span: !s.span })} />
            Make the first card span two columns
          </label>
          <div
            className="border-line-strong rounded-lg border border-dashed p-2"
            style={{ display: "grid", gridTemplateColumns: c.css, gap: 8 }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                layout
                key={i}
                className={cn(
                  "border-viz-meta bg-viz-meta/20 rounded border px-2 py-3 text-center text-xs",
                )}
                style={i === 0 && s.span ? { gridColumn: "span 2" } : undefined}
              >
                {i === 0 ? "Featured" : `Item ${i + 1}`}
              </motion.div>
            ))}
          </div>
          <p className="text-muted text-xs">{c.note}</p>
        </div>
      }
    >
      <p>
        Grid defines columns (and rows) on the container; items flow into the cells. Pick a column
        template and see the same six cards rearrange.
      </p>
      <p>
        Grid has worked in every major browser since 2017. Subgrid, which lets nested items line up
        with the outer grid, became safe to use widely in 2026.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Box model ------------------------------------------------------------------------------------ */

export function BoxModel() {
  const [s, set] = useSceneState<LayoutState>();
  const total = s.borderBox ? 200 : 200 + 2 * s.padding + 2 * s.border;
  const content = s.borderBox ? 200 - 2 * s.padding - 2 * s.border : 200;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Every element is a box"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5 text-[11px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted w-20 font-mono">padding</span>
              <Segmented<string>
                size="sm"
                value={String(s.padding)}
                onChange={(v) => set({ padding: Number(v) })}
                options={[
                  ["0", "0"],
                  ["16", "16px"],
                  ["32", "32px"],
                ]}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted w-20 font-mono">border</span>
              <Segmented<string>
                size="sm"
                value={String(s.border)}
                onChange={(v) => set({ border: Number(v) })}
                options={[
                  ["0", "0"],
                  ["4", "4px"],
                  ["12", "12px"],
                ]}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted w-20 font-mono">box-sizing</span>
              <Segmented<string>
                size="sm"
                value={s.borderBox ? "border" : "content"}
                onChange={(v) => set({ borderBox: v === "border" })}
                options={[
                  ["content", "content-box"],
                  ["border", "border-box"],
                ]}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <motion.div
              animate={{ width: total * 0.9 }}
              className="border-viz-compute bg-viz-compute/10 rounded"
              style={{ borderWidth: s.border * 0.9, padding: s.padding * 0.9 }}
            >
              <div className="bg-viz-data/30 py-4 text-center text-[10px]">content {content}px</div>
            </motion.div>
          </div>
          <p className="text-xs">
            <span className="font-mono">width: 200px</span> → takes up{" "}
            <span className={cn("font-mono font-semibold", total !== 200 && "text-bad")}>
              {total}px
            </span>
          </p>
        </div>
      }
    >
      <p>
        The <Term id="box-model">box model</Term>: content, then padding, then border, then margin
        outside. By default, width sets only the content, so padding and border make the box wider
        than you asked.
      </p>
      <p>
        Setting box-sizing: border-box makes width include padding and border. Most projects set it
        on every element so sizes behave predictably.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function LayoutCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Flexbox or grid?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="frontend-layout"
            prompt="Which tool fits each layout best?"
            categories={[
              { id: "flex", label: "Flexbox" },
              { id: "grid", label: "Grid" },
            ]}
            items={[
              {
                id: "nav",
                label: "A row of navigation links",
                category: "flex",
                why: "One direction.",
              },
              {
                id: "gallery",
                label: "A photo gallery in rows and columns",
                category: "grid",
                why: "Two directions.",
              },
              {
                id: "page",
                label: "A page with header, sidebar, main area and footer",
                category: "grid",
                why: "Areas in rows and columns.",
              },
              {
                id: "toolbar",
                label: "Buttons in a toolbar, spaced evenly",
                category: "flex",
                why: "A single row.",
              },
              {
                id: "form",
                label: "A label and its input side by side",
                category: "flex",
                why: "Two items in a line.",
              },
            ]}
            explanation="One direction: flexbox. Rows and columns at once: grid. Plenty of layouts use both, grid for the page and flexbox inside each part."
          />
        </div>
      }
    >
      <p>Sort each layout.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Everything is a box", "Content, padding, border, margin."],
        ["Use border-box", "Width means what you expect."],
        ["Flexbox for a line", "Row or column."],
        ["Grid for two directions", "Rows and columns together."],
        ["gap for spacing", "Works in both."],
      ]}
    >
      <p>Next: JavaScript, and why a busy page can freeze.</p>
    </WrapStep>
  );
}
