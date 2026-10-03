"use client";

import { motion } from "motion/react";
import { Bike, Bus, Car, Truck } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ENGINES, FACETS, type Engine, type Facet } from "./model";
import type { EngState } from "./state";

/* 1 ─ Same job, different machines ---------------------------------------------------------------- */

const VEHICLES = [
  { icon: Bike, t: "Bicycle", d: "Goes anywhere, no fuel, one rider", db: "SQLite" },
  { icon: Car, t: "Family car", d: "Does most jobs well", db: "PostgreSQL, MySQL" },
  { icon: Bus, t: "Bus fleet", d: "Many routes, coordinated", db: "Distributed SQL" },
  { icon: Truck, t: "Lorry", d: "Huge loads, not nimble", db: "Warehouses (Lakehouse track)" },
];

export function Vehicles() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Same job, different machines"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {VEHICLES.map(({ icon: Icon, t, d, db }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface flex items-start gap-3 rounded-xl border px-4 py-3"
            >
              <Icon className="text-accent mt-0.5 size-6 shrink-0" />
              <div>
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted text-xs">{d}</p>
                <p className="text-accent mt-1 font-mono text-[11px]">≈ {db}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A bicycle, a family car, a bus and a lorry all move things from A to B. Nobody argues which
        is &ldquo;best&rdquo;; each is built around different choices: engine, size, who drives.
      </p>
      <p>
        Databases are the same. They all store rows and answer SQL, but each picks a page layout, a
        way to keep old versions, a locking style and a shape (library or server). You&apos;ve met
        every one of those choices in this course; now see how the popular engines combine them.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Side by side ⭐ ----------------------------------------------------------------------------- */

export function Matrix() {
  const [s, set] = useSceneState<EngState>();
  const e = ENGINES[s.engine];
  return (
    <StepLayout
      eyebrow="Infographic"
      title="Side by side"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="overflow-x-auto">
            <Segmented<Facet>
              size="sm"
              value={s.facet}
              onChange={(facet) => set({ facet })}
              options={(Object.keys(FACETS) as Facet[]).map((k) => [k, FACETS[k]])}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            {(Object.keys(ENGINES) as Engine[]).map((k, i) => (
              <motion.button
                key={k}
                type="button"
                aria-pressed={s.engine === k}
                onClick={() => set({ engine: k })}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
                className={cn(
                  "grid grid-cols-[7.5rem_1fr] items-start gap-3 rounded-lg border px-3 py-2 text-left",
                  s.engine === k
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                <span className="text-sm font-semibold">{ENGINES[k].name}</span>
                <motion.span
                  key={s.facet}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-muted text-xs"
                >
                  {ENGINES[k].facets[s.facet]}
                </motion.span>
              </motion.button>
            ))}
          </div>
          <motion.div
            key={s.engine}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-2 rounded-xl px-4 py-3 text-xs"
          >
            <p className="text-sm font-semibold">
              {e.name}{" "}
              <span className="text-accent font-mono text-[11px] font-normal">{e.version}</span>
            </p>
            <p className="text-muted mt-1">Revisit: {e.see}</p>
          </motion.div>
          <p className="text-subtle text-[10px]">Versions as of October 2026.</p>
        </div>
      }
    >
      <p>
        Pick a dimension, then compare. Click an engine for its current version and the module that
        explains its key idea.
      </p>
      <p>
        Notice the split on concurrency: PostgreSQL keeps old versions in the table, InnoDB and
        Oracle in an <Term id="undo-log">undo log</Term>, and on-premises SQL Server locks unless
        you switch row versioning on. Each explains a different operational chore: VACUUM, purge
        lag, &ldquo;snapshot too old&rdquo;, or blocking.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Heap or clustered? -------------------------------------------------------------------------- */

export function HeapOrClustered() {
  return (
    <StepLayout
      eyebrow="Compare"
      title="Heap or clustered?"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface flex flex-col gap-2 rounded-xl border px-4 py-3">
            <p className="text-sm font-semibold">PostgreSQL: heap + indexes</p>
            <div className="flex flex-col gap-1 font-mono text-[10px]">
              <span className="border-viz-meta bg-viz-meta/10 rounded border px-2 py-1">
                index on id → (page 4, slot 2)
              </span>
              <span className="border-viz-meta bg-viz-meta/10 rounded border px-2 py-1">
                index on email → (page 4, slot 2)
              </span>
              <span className="text-muted pl-2">↓ both point into the heap</span>
              <span className="border-viz-data bg-viz-data/10 rounded border px-2 py-1">
                heap page 4: … row 42 …
              </span>
            </div>
            <p className="text-muted text-xs">
              Every index is equal; all point at the row&apos;s physical spot. An update writes a
              new row version, so every index gets a new entry (unless it&apos;s a HOT update).
            </p>
          </div>
          <div className="border-line bg-surface flex flex-col gap-2 rounded-xl border px-4 py-3">
            <p className="text-sm font-semibold">InnoDB: clustered index</p>
            <div className="flex flex-col gap-1 font-mono text-[10px]">
              <span className="border-viz-meta bg-viz-meta/10 rounded border px-2 py-1">
                index on email → id 42
              </span>
              <span className="text-muted pl-2">↓ look up the primary key</span>
              <span className="border-viz-data bg-viz-data/10 rounded border px-2 py-1">
                primary-key B-tree: id 42 → whole row
              </span>
            </div>
            <p className="text-muted text-xs">
              The rows live in the primary-key B-tree, sorted by key. Lookups by primary key are one
              tree walk; secondary indexes store the key and take a second walk.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Here&apos;s a difference you can feel. In InnoDB, &ldquo;each InnoDB table has a special
        index called the <Term id="clustered-index">clustered index</Term> that stores row
        data&rdquo;, typically the primary key. PostgreSQL keeps rows in an unordered heap and every
        index points into it.
      </p>
      <p>
        So in InnoDB a short, ever-increasing primary key matters: it&apos;s copied into every
        secondary index, and random keys scatter inserts across the tree.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Managed in the cloud ------------------------------------------------------------------------ */

const CLOUD: [string, string][] = [
  [
    "Amazon Aurora",
    "MySQL- and PostgreSQL-compatible, on a shared storage volume copied across three availability zones.",
  ],
  [
    "Google AlloyDB",
    "PostgreSQL-compatible, with a built-in columnar engine to speed up analytical scans, joins and aggregates.",
  ],
  [
    "Azure Database for PostgreSQL",
    "Managed PostgreSQL (the flexible server option); Azure SQL Database is the managed SQL Server engine.",
  ],
  [
    "Google Spanner",
    "Fully managed distributed SQL (module 19), with an availability SLA of up to 99.999%.",
  ],
  [
    "Neon (Lakebase)",
    "Serverless PostgreSQL that splits compute from storage, linked by a stream of WAL records. Databricks announced it was acquiring Neon in May 2025.",
  ],
];

export function Managed() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Managed in the cloud"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {CLOUD.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
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
        A <Term id="managed-service">managed</Term> database takes the chores: backups, failover,
        patching, and often the storage layer itself. Several rebuild storage around the write-ahead
        log, as you saw with Aurora.
      </p>
      <p>
        What it doesn&apos;t take: your schema, your indexes, your queries and your transactions.
        Everything in this course still applies; a slow query is just as slow in the cloud, and
        costs money by the hour.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Pick an engine ------------------------------------------------------------------------------ */

export function PickEngine() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Pick an engine"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="pick-engine"
            prompt="Which kind of database fits each situation best?"
            categories={[
              { id: "embedded", label: "Embedded (SQLite)" },
              { id: "server", label: "Client-server" },
              { id: "dist", label: "Distributed SQL" },
            ]}
            items={[
              {
                id: "mobile",
                label: "A mobile app that must work offline",
                category: "embedded",
                why: "A file inside the app, no server needed.",
              },
              {
                id: "desktop",
                label: "A desktop tool's local settings and history",
                category: "embedded",
                why: "One user, one writer: SQLite's sweet spot.",
              },
              {
                id: "webapp",
                label: "A typical web app with hundreds of concurrent users",
                category: "server",
                why: "PostgreSQL or MySQL handle many concurrent writers.",
              },
              {
                id: "reports",
                label: "An internal app with complex joins and a few replicas for reports",
                category: "server",
                why: "One primary plus read replicas covers it comfortably.",
              },
              {
                id: "global",
                label: "Writes from three continents that must survive losing a region",
                category: "dist",
                why: "Consensus across regions is exactly what distributed SQL is for.",
              },
              {
                id: "huge",
                label: "A write load no single machine can keep up with, needing transactions",
                category: "dist",
                why: "Spread ranges over many nodes while keeping ACID.",
              },
            ]}
            explanation="Start with the simplest that fits: SQLite for one app, a single PostgreSQL or MySQL server for most services, distributed SQL only when one machine or one region genuinely isn't enough."
          />
        </div>
      }
    >
      <p>Most systems never outgrow a well-tuned single server. Choose for the need you have.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Same SQL, different insides", "Layout, versions, locking and shape vary."],
  ["Heap vs clustered", "PostgreSQL's heap; InnoDB's primary-key tree."],
  ["Old versions somewhere", "In the table, or in undo; both need cleanup."],
  ["Library or server", "SQLite lives in your app; the rest are servers."],
  ["Managed isn't magic", "It runs the database; you still design it."],
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
        One module left: a capstone where you diagnose a struggling production database with
        everything you&apos;ve learned.
      </p>
    </StepLayout>
  );
}
