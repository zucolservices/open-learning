"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { AVRO_SCHEMA, CSV_TEXT, JSON_TEXT, ORDERS } from "./data";

/* Shared bits ---------------------------------------------------------------- */

function Code({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <pre
      className={cn(
        "border-line bg-bg/70 overflow-auto rounded-xl border p-3 font-mono text-[11px] leading-relaxed sm:text-xs",
        className,
      )}
    >
      {children}
    </pre>
  );
}

function Chips({ good = [], bad = [] }: { good?: string[]; bad?: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5 text-[11px] sm:text-xs">
      {good.map((t) => (
        <li key={t} className="bg-good/10 text-good rounded-full px-2.5 py-1">
          ✓ {t}
        </li>
      ))}
      {bad.map((t) => (
        <li key={t} className="bg-bad/10 text-bad rounded-full px-2.5 py-1">
          ✗ {t}
        </li>
      ))}
    </ul>
  );
}

function Scene({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto">
      <p className="text-muted text-xs">{label}</p>
      {children}
    </div>
  );
}

/** Colour JSON keys so repeated field names stand out. */
function JsonView({ text }: { text: string }) {
  return (
    <Code>
      {text.split(/("[^"]+"(?=\s*:))/g).map((part, i) =>
        /^"[^"]+"$/.test(part) ? (
          <span key={i} className="text-viz-meta">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </Code>
  );
}

const first = ORDERS[0];
const minifiedJson = JSON.stringify({
  order_id: first.order_id,
  customer: first.customer,
  city: first.city,
  item: first.item,
  qty: first.qty,
  amount: first.amount,
  status: first.status,
});
const csvLine = CSV_TEXT.split("\n")[1];
const bytes = (s: string) => new TextEncoder().encode(s).length;

/* Scenes ---------------------------------------------------------------------- */

function JsonScene() {
  return (
    <Scene label="Brewline's app sends order #88213 to the server as JSON">
      <JsonView text={JSON_TEXT} />
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="border-line bg-surface rounded-xl border p-3">
          <p className="text-muted">This order, minified JSON</p>
          <p className="text-lg font-semibold tabular-nums">{bytes(minifiedJson)} bytes</p>
        </div>
        <div className="border-line bg-surface rounded-xl border p-3">
          <p className="text-muted">Of which field names</p>
          <p className="text-viz-meta text-lg font-semibold tabular-nums">
            {Object.keys(JSON.parse(minifiedJson)).reduce((n, k) => n + k.length + 2, 0)} bytes
          </p>
        </div>
      </div>
      <Chips
        good={["readable by people and every language", "nested data fits naturally"]}
        bad={["field names repeated in every record", "few types: dates are just strings"]}
      />
    </Scene>
  );
}

function CsvScene() {
  const lines = CSV_TEXT.split("\n");
  return (
    <Scene label="Finance gets a daily export as CSV">
      <Code>
        {lines.map((line, i) => (
          <div key={i} className={i === 0 ? "text-viz-meta" : ""}>
            {line.split(/("[^"]*")/).map((part, j) =>
              part.startsWith('"') ? (
                <span key={j} className="bg-viz-compute/25 rounded px-0.5">
                  {part}
                </span>
              ) : (
                <span key={j}>{part}</span>
              ),
            )}
          </div>
        ))}
      </Code>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="border-line bg-surface rounded-xl border p-3">
          <p className="text-muted">Order #88213 as a CSV line</p>
          <p className="text-lg font-semibold tabular-nums">{bytes(csvLine)} bytes</p>
        </div>
        <div className="border-viz-compute/40 bg-viz-compute/10 rounded-xl border p-3">
          <p className="text-muted">A comma inside a name?</p>
          <p className="text-sm">
            It has to be wrapped in quotes, or every column after it shifts by one.
          </p>
        </div>
      </div>
      <Chips
        good={["opens in any spreadsheet", "compact: no repeated names"]}
        bad={["no schema: is 88213 a number or text?", "no nesting", "quoting pitfalls"]}
      />
    </Scene>
  );
}

function AvroScene() {
  return (
    <Scene label="Every order is published to Kafka as Avro">
      <div className="grid gap-3 lg:grid-cols-2">
        <Code className="max-h-56">{AVRO_SCHEMA}</Code>
        <div className="grid content-start gap-2 text-[11px]">
          <p className="text-muted">An Avro file</p>
          <div className="flex flex-wrap gap-1 font-mono">
            <span className="bg-viz-meta/25 rounded px-2 py-1.5">
              header: schema + codec + sync marker
            </span>
            {[1, 2].map((b) => (
              <span key={b} className="contents">
                <span className="bg-viz-data/30 rounded px-2 py-1.5">
                  block {b}: rows, compressed
                </span>
                <span className="bg-viz-compute/40 rounded px-1.5 py-1.5">sync</span>
              </span>
            ))}
          </div>
          <p className="text-muted mt-2">A Kafka message (with a schema registry)</p>
          <div className="flex gap-1 font-mono">
            <span className="bg-viz-idle/40 rounded px-2 py-1.5">0</span>
            <span className="bg-viz-meta/25 rounded px-2 py-1.5">schema id</span>
            <span className="bg-viz-data/30 flex-1 rounded px-2 py-1.5">order #88213, binary</span>
          </div>
        </div>
      </div>
      <Chips
        good={[
          "compact binary rows",
          "schema travels with the data",
          "fields can be added with defaults",
          "splittable at sync markers",
        ]}
        bad={["not human-readable", "still reads whole rows"]}
      />
    </Scene>
  );
}

function ParquetScene() {
  const cols = ["order_id", "customer", "city", "amount", "status"];
  const amounts = ORDERS.map((o) => o.amount);
  return (
    <Scene label="In the lakehouse, orders land as Parquet files">
      <div className="border-line bg-bg/60 grid gap-2 rounded-xl border p-3 font-mono text-[10px] sm:text-[11px]">
        <span className="bg-viz-idle/30 w-fit rounded px-2 py-1">PAR1</span>
        {[1, 2].map((rg) => (
          <div key={rg} className="border-viz-data/50 rounded-lg border border-dashed p-2">
            <p className="text-muted mb-1.5">row group {rg}</p>
            <div className="grid grid-cols-5 gap-1">
              {cols.map((c) => (
                <motion.div
                  key={c}
                  initial={{ scaleY: 0.3, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ delay: rg * 0.1 }}
                  className={cn(
                    "grid h-12 place-items-center rounded text-center",
                    c === "amount" ? "bg-viz-data/50" : "bg-viz-data/20",
                  )}
                >
                  {c}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
        <div className="bg-viz-meta/20 border-viz-meta/60 rounded-lg border p-2">
          <p className="text-viz-meta font-semibold">footer</p>
          <p className="text-muted">schema · row groups · per column: min / max / nulls</p>
          <p className="mt-1">
            amount, row group 1: min {Math.min(...amounts.slice(0, 3))}, max{" "}
            {Math.max(...amounts.slice(0, 3))}
          </p>
        </div>
        <span className="bg-viz-idle/30 w-fit rounded px-2 py-1">PAR1</span>
      </div>
      <Chips
        good={[
          "columnar: read only the columns you need",
          "footer stats let engines skip data",
          "strong compression",
        ]}
        bad={["written in batches, not one row at a time"]}
      />
    </Scene>
  );
}

function SummaryScene() {
  const hops: [string, string, string][] = [
    ["App → server", "JSON", "bg-viz-meta/25"],
    ["Finance export", "CSV", "bg-viz-idle/35"],
    ["Kafka stream", "Avro", "bg-viz-compute/30"],
    ["Lakehouse table", "Parquet", "bg-viz-data/35"],
  ];
  return (
    <Scene label="One order, four shapes, each chosen for its job">
      <ol className="grid gap-2">
        {hops.map(([where, fmt, cls], i) => (
          <motion.li
            key={fmt}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
            className="border-line bg-surface flex items-center gap-3 rounded-xl border p-3"
          >
            <span className="text-subtle w-5 font-mono text-xs">{i + 1}</span>
            <span className="flex-1 text-sm">{where}</span>
            <span className={cn("rounded-full px-3 py-1 font-mono text-xs font-semibold", cls)}>
              {fmt}
            </span>
          </motion.li>
        ))}
      </ol>
      <p className="text-muted text-sm">
        Text formats for people and APIs. Binary rows for streams. Binary columns for analytics.
      </p>
    </Scene>
  );
}

const SCENES = [JsonScene, CsvScene, AvroScene, ParquetScene, SummaryScene];

const SECTIONS: StorySection[] = [
  {
    id: "json",
    kicker: "App",
    title: "Born as JSON",
    body: (
      <>
        <p>
          A customer in Pune orders two masala chais. Brewline&apos;s app sends the order to the
          server as <Term id="json">JSON</Term>: readable text, with each value labelled by its
          field name.
        </p>
        <p>
          Perfect for apps and APIs. But look at the scene: a large share of every record is{" "}
          <strong>field names</strong>, repeated again for the next order, and the one after.
        </p>
      </>
    ),
  },
  {
    id: "csv",
    kicker: "Finance",
    title: "Exported as CSV",
    body: (
      <>
        <p>
          Every evening, finance wants a spreadsheet. <Term id="csv">CSV</Term> writes the column
          names once, then one line per row, so it&apos;s much smaller.
        </p>
        <p>
          But CSV has <strong>no schema</strong>: every value is just text, and a reader has to
          guess the types. A comma inside a customer&apos;s name has to be quoted, or every column
          after it shifts.
        </p>
      </>
    ),
  },
  {
    id: "avro",
    kicker: "Stream",
    title: "Streamed as Avro",
    body: (
      <>
        <p>
          Other systems react to orders in real time through Kafka. There, each order travels as{" "}
          <Term id="avro">Avro</Term>: compact binary rows, with the <Term id="schema">schema</Term>{" "}
          kept alongside (in the file header, or as a small schema ID that points to a schema
          registry), so every reader knows the exact types.
        </p>
        <p>
          Avro is <Term id="self-describing">self-describing</Term>, and it handles change well: a
          new field like <code>loyalty</code> can be added with a default, and old readers keep
          working.
        </p>
      </>
    ),
  },
  {
    id: "parquet",
    kicker: "Lake",
    title: "Stored as Parquet",
    body: (
      <>
        <p>
          Finally, orders are written in batches into the lakehouse as{" "}
          <Term id="parquet">Parquet</Term>: binary, and <Term id="columnar">columnar</Term>.
        </p>
        <p>
          Rows are grouped into <strong>row groups</strong>. Inside each one, every column is stored
          separately. A <strong>footer</strong> at the end records the schema and each column&apos;s
          min and max, so an engine can skip what it doesn&apos;t need. ORC, from the Hive world,
          works in a very similar way.
        </p>
      </>
    ),
  },
  {
    id: "summary",
    kicker: "Recap",
    title: "Four shapes, four jobs",
    body: (
      <>
        <p>
          No format is simply &ldquo;best&rdquo;. Each fits a job: text for people and APIs, binary
          rows for streams, binary columns for analytics.
        </p>
        <p>Next, let&apos;s measure the one that matters most for a lakehouse: columns.</p>
      </>
    ),
  },
];

export function Journey() {
  return (
    <ScrollStory
      sections={SECTIONS}
      renderScene={(i) => {
        const S = SCENES[i];
        return <S />;
      }}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">A scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            The journey of order #88213
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            One order, four systems, four file formats. Scroll down and watch its shape change at
            every stop.
          </p>
        </div>
      }
    />
  );
}
