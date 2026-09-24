"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ParquetZoom } from "./parquet-scene";
import type { ParquetState } from "./state";

/* 1 ─ A book with the index at the back ------------------------------------ */

type Seg = {
  id: string;
  label: string;
  w: number;
  tone: "idle" | "data" | "meta";
  rg?: number;
  col?: string;
};

const COLS = ["order_id", "customer", "city", "amount", "status"];
const SEGMENTS: Seg[] = [
  { id: "head", label: "PAR1", w: 0.6, tone: "idle" },
  ...[1, 2, 3].flatMap((rg) =>
    COLS.map((col) => ({ id: `rg${rg}-${col}`, label: col, w: 1, tone: "data" as const, rg, col })),
  ),
  { id: "footer", label: "footer", w: 2.2, tone: "meta" },
  { id: "tail", label: "len+PAR1", w: 1, tone: "idle" },
];

const READS: { title: string; text: string; read: (s: Seg) => boolean }[] = [
  {
    title: "A 3 GB file of orders",
    text: "Query: SELECT SUM(amount) WHERE amount > 400. A naive reader would start at byte 0 and read everything.",
    read: () => false,
  },
  {
    title: "1. Read the last 8 bytes",
    text: "The end of every Parquet file holds the footer's length and the magic word PAR1. Now the reader knows where the footer starts.",
    read: (s) => s.id === "tail",
  },
  {
    title: "2. Read the footer",
    text: "The footer lists every row group and column chunk: where it is, how big it is, and each column's min and max. Row group 2's amounts max out at 380, so it can't match amount > 400.",
    read: (s) => s.id === "footer",
  },
  {
    title: "3. Fetch only what's needed",
    text: "Jump straight to the amount chunks of row groups 1 and 3. Every other byte is never read.",
    read: (s) => s.col === "amount" && s.rg !== 2,
  },
];

const toneCls = {
  idle: "bg-viz-idle/30",
  data: "bg-viz-data/25",
  meta: "bg-viz-meta/30",
};

export function ReadingOrder() {
  const [s, set] = useSceneState<ParquetState>();
  const step = Math.min(s.readStep, READS.length - 1);
  const r = READS[step];
  const readCount = SEGMENTS.filter(r.read).reduce((n, g) => n + g.w, 0);
  const total = SEGMENTS.reduce((n, g) => n + g.w, 0);

  return (
    <StepLayout
      eyebrow="The big idea first"
      title="A book with the index at the back"
      stage={
        <div className="flex flex-1 flex-col gap-5">
          <div className="grid gap-2 sm:grid-cols-4">
            {[
              ["Chapters", "Row groups", "slices of rows"],
              ["Topics in a chapter", "Column chunks", "one per column"],
              ["Pages", "Pages", "the unit that's compressed"],
              ["Index at the back", "Footer", "what's where, and min/max"],
            ].map(([book, pq, note]) => (
              <div key={pq} className="border-line bg-surface rounded-xl border p-3 text-center">
                <p className="text-muted text-xs">{book}</p>
                <p className="text-subtle my-0.5 text-xs">↓</p>
                <p className="text-sm font-semibold">{pq}</p>
                <p className="text-subtle text-[11px]">{note}</p>
              </div>
            ))}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-muted text-xs">orders.parquet, start → end</p>
              <div className="flex items-center gap-1">
                <Nav
                  label="Previous"
                  onClick={() => set({ readStep: Math.max(0, step - 1) })}
                  disabled={step === 0}
                >
                  <ChevronLeft className="size-4" />
                </Nav>
                <span className="text-muted w-10 text-center font-mono text-xs">
                  {step + 1}/{READS.length}
                </span>
                <Nav
                  label="Next"
                  primary
                  onClick={() => set({ readStep: Math.min(READS.length - 1, step + 1) })}
                  disabled={step === READS.length - 1}
                >
                  <ChevronRight className="size-4" />
                </Nav>
              </div>
            </div>
            <div className="flex h-16 gap-[2px] overflow-hidden rounded-xl">
              {SEGMENTS.map((g) => {
                const on = r.read(g);
                return (
                  <motion.div
                    key={g.id}
                    style={{ flexGrow: g.w, flexBasis: 0 }}
                    animate={{ opacity: step === 0 || on ? 1 : 0.35 }}
                    className={cn(
                      "relative grid place-items-center overflow-hidden font-mono text-[8px]",
                      on ? "bg-viz-compute text-bg" : toneCls[g.tone],
                    )}
                    title={g.rg ? `row group ${g.rg} · ${g.col}` : g.label}
                  >
                    <span className="rotate-[-60deg] whitespace-nowrap sm:rotate-0">
                      {g.rg ? (g.col === "order_id" ? `RG${g.rg}` : "") : g.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
            <div className="text-subtle mt-1 flex justify-between font-mono text-[10px]">
              <span>byte 0</span>
              <span>end of file</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{r.title}</p>
              <p className="text-muted mt-1 text-sm">{r.text}</p>
              {step > 0 && (
                <p className="text-viz-compute mt-2 text-xs font-medium">
                  Read so far in this step: {Math.round((readCount / total) * 100)}% of the file
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        You wouldn&apos;t read a whole textbook to find one topic. You&apos;d flip to the{" "}
        <strong>index at the back</strong>, find the page numbers, and go straight there.
      </p>
      <p>
        A <Term id="parquet">Parquet</Term> file works exactly the same way. Its index is the{" "}
        <Term id="parquet-footer">footer</Term>, and a reader always starts there. Step through how
        a real engine reads a file.
      </p>
    </StepLayout>
  );
}

function Nav({
  children,
  label,
  onClick,
  disabled,
  primary,
}: {
  children: React.ReactNode;
  label: string;
  onClick(): void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "grid size-8 place-items-center rounded-full transition disabled:opacity-30",
        primary ? "bg-accent text-accent-fg" : "text-muted hover:bg-surface-2 hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

/* 2 ─ Zoom into a Parquet file ⭐ -------------------------------------------- */

const SECTIONS: StorySection[] = [
  {
    id: "file",
    kicker: "File",
    title: "One file, 3 GB of orders",
    body: (
      <>
        <p>
          This is one Parquet file of Brewline orders. From the outside it&apos;s just a block of
          bytes, starting and ending with the magic word <code>PAR1</code>.
        </p>
        <p>Scroll down to open it up, layer by layer. Watch the 3D view on the right.</p>
      </>
    ),
  },
  {
    id: "row-groups",
    kicker: "Row groups",
    title: "Split into row groups",
    body: (
      <>
        <p>
          The rows are cut into horizontal slices called <Term id="row-group">row groups</Term>,
          often many thousands of rows each. At the end sits the{" "}
          <Term id="parquet-footer">footer</Term>.
        </p>
        <p>
          Row groups are also the unit of parallelism: different workers can read different row
          groups of the same file.
        </p>
      </>
    ),
  },
  {
    id: "chunks",
    kicker: "Column chunks",
    title: "Each row group, column by column",
    body: (
      <>
        <p>
          Inside a row group, each column is stored on its own, as a{" "}
          <Term id="column-chunk">column chunk</Term>: all the order_ids together, then all the
          customers, and so on.
        </p>
        <p>
          This is why a query for <code>amount</code> can read just the amount chunks. That&apos;s{" "}
          <Term id="projection-pruning">projection pruning</Term>.
        </p>
      </>
    ),
  },
  {
    id: "pages",
    kicker: "Pages",
    title: "Chunks are made of pages",
    body: (
      <>
        <p>
          A column chunk is split into <strong>pages</strong>, the unit that gets encoded and
          compressed. A chunk can start with a <strong>dictionary page</strong> listing its distinct
          values, like status here.
        </p>
      </>
    ),
  },
  {
    id: "values",
    kicker: "Values",
    title: "Inside a page: encoded values",
    body: (
      <>
        <p>
          Numbers like amounts are often stored plainly and then compressed. Repetitive columns like
          status become tiny codes that point into the dictionary, with runs shortened further.
        </p>
        <p>
          <Term id="encoding">Encoding</Term> first, then compression. Two layers of shrinking.
        </p>
      </>
    ),
  },
  {
    id: "footer",
    kicker: "Footer",
    title: "The footer: the map of the file",
    body: (
      <>
        <p>
          Finally, the footer. It records the schema, where every row group and column chunk starts,
          and <Term id="statistics">min/max statistics</Term> for each column in each row group.
        </p>
        <p>
          That&apos;s what lets an engine skip whole row groups before reading a single value. Up
          next, you&apos;ll try it yourself.
        </p>
      </>
    ),
  },
];

export function Zoom() {
  return (
    <ScrollStory
      persistent
      sections={SECTIONS}
      renderScene={(i) => <ParquetZoom stage={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">3D scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Zoom into a Parquet file
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            Six levels, from the whole file down to individual encoded values. Scroll slowly.
          </p>
        </div>
      }
    />
  );
}
