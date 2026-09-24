"use client";

import { motion } from "motion/react";
import { defineModule, useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { Segmented } from "@/toolkit/controls/segmented";
import { cn } from "@/lib/cn";
import { DiskView, pagesRead, TableView, type Layout } from "./storage-scene";

type State = { layout: Layout; query: boolean };

function Query() {
  return (
    <pre className="bg-surface-2 rounded-xl px-4 py-3 font-mono text-sm">
      <span className="text-viz-meta">SELECT</span> SUM(<span className="text-accent">amount</span>){" "}
      <span className="text-viz-meta">FROM</span> orders
    </pre>
  );
}

function Hook() {
  return (
    <StepLayout
      eyebrow="The question"
      title="How much of a table does a query really need?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-6">
          <Query />
          <TableView highlight />
        </div>
      }
    >
      <p>
        An analyst wants total revenue. The query mentions <strong>one column</strong> out of five.
      </p>
      <p>
        Whether the engine reads one column or the whole table depends on how the bytes are laid out
        on disk. Let&apos;s look.
      </p>
    </StepLayout>
  );
}

function Explore() {
  const [s, set] = useSceneState<State>();
  const { read, total } = pagesRead(s.layout);

  return (
    <StepLayout
      eyebrow="Explore"
      title="Same data, two layouts"
      stage={
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <Segmented
              value={s.layout}
              options={[
                ["row", "Row layout"],
                ["column", "Columnar layout"],
              ]}
              onChange={(layout) => set({ layout })}
            />
            <button
              type="button"
              onClick={() => set({ query: !s.query })}
              className={cn(
                "h-9 rounded-full border px-4 text-sm transition",
                s.query
                  ? "border-viz-compute bg-viz-compute/15 text-fg"
                  : "border-line text-muted hover:text-fg",
              )}
            >
              {s.query ? "Query running" : "Run SUM(amount)"}
            </button>
          </div>
          <DiskView layout={s.layout} query={s.query} />
          <div className="mt-auto flex items-end gap-4">
            <div>
              <p className="text-muted text-xs">Pages read</p>
              <motion.p
                key={`${s.layout}-${s.query}`}
                initial={{ scale: 1.25, opacity: 0.4 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-semibold tracking-tight tabular-nums"
              >
                {s.query ? read : "—"}
                <span className="text-subtle text-lg"> / {total}</span>
              </motion.p>
            </div>
            {s.query && (
              <div className="bg-surface-2 mb-2 h-2 flex-1 overflow-hidden rounded-full">
                <motion.div
                  className="bg-viz-compute h-full rounded-full"
                  animate={{ width: `${(read / total) * 100}%` }}
                  transition={{ type: "spring", stiffness: 140, damping: 20 }}
                />
              </div>
            )}
          </div>
        </div>
      }
    >
      <p>
        Disks and object stores hand back data in <strong>pages</strong>, not single values. To read
        one value you pay for its whole page.
      </p>
      <p>Switch layouts, then run the query. Watch which pages light up.</p>
      <p>
        In a <strong>row layout</strong> each order&apos;s values sit together, so every page holds
        an amount. In a <strong>columnar layout</strong> all amounts sit together in one place.
      </p>
    </StepLayout>
  );
}

function Predict() {
  return (
    <StepLayout
      eyebrow="Predict"
      title="Now scale it up"
      stage={
        <div className="flex flex-1 items-center">
          <PredictCheckpoint
            id="wide-table"
            prompt="A real fact table has 50 columns of similar size. A query uses 2 of them. Roughly what share of the data does a columnar scan read?"
            min={0}
            max={100}
            unit="%"
            answer={4}
            tolerance={3}
            explanation="2 of 50 columns is 4%. Row layout would read about 100%. This is why analytical formats such as Parquet and ORC store data by column."
          />
        </div>
      }
    >
      <p>
        Commit to a guess before you see the answer. Making a prediction first helps the idea stick.
      </p>
    </StepLayout>
  );
}

function Order() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="How a columnar engine answers a filter"
      stage={
        <div className="flex flex-1 items-center">
          <OrderCheckpoint
            id="engine-steps"
            prompt="Put the steps for SUM(amount) WHERE country = 'IN' in order."
            items={[
              { id: "footer", label: "Read the file's metadata to find where each column lives" },
              { id: "filter", label: "Read the country column and find the rows matching 'IN'" },
              { id: "amount", label: "Read only the amount values for those rows" },
              { id: "sum", label: "Add them up" },
            ]}
            explanation="Metadata first, then the filter column, then only the values you need. Real engines add one more trick: the metadata stores min/max statistics, so whole chunks of the file can be skipped. You'll meet this in 'Inside a Parquet file'."
          />
        </div>
      }
    >
      <p>
        Drag the steps into order. You&apos;ve seen the core idea already, so this is about
        sequence.
      </p>
    </StepLayout>
  );
}

function WhenRows() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="So is columnar always better?"
      stage={
        <div className="flex flex-1 items-center">
          <ChoiceCheckpoint
            id="row-wins"
            prompt="Which workload is a better fit for a row layout?"
            options={[
              {
                id: "lookup",
                label: "Fetch every field of order #1004 to show it on a screen",
                correct: true,
                feedback:
                  "Right. One order's values sit together in a row layout, so a single page read returns the whole record.",
              },
              {
                id: "sum",
                label: "Total revenue per country for last year",
                feedback:
                  "That touches two columns across millions of rows, which is exactly what columnar storage is good at.",
              },
              {
                id: "distinct",
                label: "Count distinct customers",
                feedback: "That reads a single column, so a columnar layout wins.",
              },
            ]}
            explanation="Transactional (OLTP) databases usually store rows. Analytical (OLAP) systems and lakehouses store columns."
          />
        </div>
      }
    />
  );
}

function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to take away"
      stage={
        <div className="grid flex-1 content-center gap-3">
          {[
            ["Storage is read in pages", "So layout decides how much a query really reads."],
            ["Columnar layout suits analytics", "Queries touch few columns across many rows."],
            ["Row layout suits transactions", "Lookups and writes touch whole records."],
          ].map(([title, body], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-2xl border p-4"
            >
              <p className="font-semibold">{title}</p>
              <p className="text-muted text-sm">{body}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        This sample module exercises the toolkit: steps, scene state that survives a refresh, and
        all three checkpoint types.
      </p>
    </StepLayout>
  );
}

export default defineModule<State>({
  initialState: { layout: "row", query: false },
  steps: [
    { id: "hook", title: "The question", Component: Hook },
    { id: "explore", title: "Same data, two layouts", Component: Explore },
    { id: "predict", title: "Scale it up", checkpoint: "wide-table", Component: Predict },
    { id: "order", title: "How an engine answers", checkpoint: "engine-steps", Component: Order },
    { id: "rows", title: "When rows win", checkpoint: "row-wins", Component: WhenRows },
    { id: "wrap", title: "Takeaways", Component: Wrap },
  ],
});
