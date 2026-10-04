"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { EDGES, NODES, PG, RDF, cypher, reach, sql } from "./model";
import type { GraphState } from "./state";

/* 1 ─ Circles and arrows -------------------------------------------------------------------------- */

export function Whiteboard() {
  const pts: [number, number, string][] = [
    [60, 50, "Asha"],
    [180, 40, "Ben"],
    [120, 130, "Chitra"],
    [250, 120, "Dev"],
  ];
  const links: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="Circles and arrows"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <svg
            viewBox="0 0 310 170"
            className="w-full max-w-sm"
            role="img"
            aria-label="Four people joined by arrows on a whiteboard"
          >
            {links.map(([a, b], i) => (
              <motion.line
                key={i}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.3 * i }}
                x1={pts[a][0]}
                y1={pts[a][1]}
                x2={pts[b][0]}
                y2={pts[b][1]}
                className="stroke-accent"
                strokeWidth={1.5}
              />
            ))}
            {pts.map(([x, y, l]) => (
              <g key={l}>
                <circle
                  cx={x}
                  cy={y}
                  r={20}
                  className="fill-surface stroke-viz-data"
                  strokeWidth={1.5}
                />
                <text x={x} y={y + 3} textAnchor="middle" className="fill-fg text-[9px]">
                  {l}
                </text>
              </g>
            ))}
          </svg>
        </div>
      }
    >
      <p>
        Ask someone to explain who knows whom in their office and they&apos;ll draw circles and
        arrows, not a table. Graph databases store data that way: things, and the connections
        between them.
      </p>
      <p>
        In a <Term id="property-graph">property graph</Term>, the circles are{" "}
        <Term id="graph-node">nodes</Term> (with labels and properties) and the arrows are{" "}
        <Term id="graph-edge">relationships</Term>: directed, typed, and able to carry properties of
        their own. Following a relationship needs no join.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Follow the ring ⭐ -------------------------------------------------------------------------- */

const KIND_CLS: Record<string, string> = {
  account: "stroke-viz-data",
  phone: "stroke-viz-compute",
  device: "stroke-viz-meta",
  address: "stroke-viz-add",
};

export function FraudRing() {
  const [s, set] = useSceneState<GraphState>();
  const { accounts, ids } = reach(s.hops);
  const pos = (id: string) => NODES.find((n) => n.id === id)!;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Follow the ring"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted">hops from A1</span>
            {[1, 2, 3].map((h) => (
              <button
                key={h}
                type="button"
                aria-pressed={s.hops === h}
                onClick={() => set({ hops: h })}
                className={cn(
                  "size-7 rounded-md border font-mono",
                  s.hops === h ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {h}
              </button>
            ))}
            <span className="text-muted ml-2">
              linked accounts: {[...accounts].filter((a) => a !== "A1").join(", ")}
            </span>
          </div>
          <svg
            viewBox="0 0 400 240"
            className="w-full max-w-lg self-center"
            role="img"
            aria-label="Accounts linked through shared phones, devices and addresses"
          >
            {EDGES.map(([a, b]) => {
              const on = (accounts.has(a) || a === "A1") && ids.has(b);
              return (
                <line
                  key={a + b}
                  x1={pos(a).x}
                  y1={pos(a).y}
                  x2={pos(b).x}
                  y2={pos(b).y}
                  className={on ? "stroke-bad" : "stroke-line-strong"}
                  strokeWidth={on ? 2 : 1}
                />
              );
            })}
            {NODES.map((n) => {
              const hot = accounts.has(n.id) || ids.has(n.id);
              return (
                <g key={n.id}>
                  {n.kind === "account" ? (
                    <>
                      <circle cx={n.x} cy={n.y} r={15} className="fill-surface" />
                      <motion.circle
                        animate={{ scale: hot ? 1.1 : 1 }}
                        cx={n.x}
                        cy={n.y}
                        r={15}
                        className={cn(hot ? "fill-bad/20" : "fill-surface", KIND_CLS[n.kind])}
                        strokeWidth={1.5}
                      />
                    </>
                  ) : (
                    <>
                      <rect
                        x={n.x - 13}
                        y={n.y - 10}
                        width={26}
                        height={20}
                        rx={4}
                        className="fill-surface"
                      />
                      <rect
                        x={n.x - 13}
                        y={n.y - 10}
                        width={26}
                        height={20}
                        rx={4}
                        className={cn(hot ? "fill-bad/15" : "fill-surface", KIND_CLS[n.kind])}
                        strokeWidth={1.2}
                      />
                    </>
                  )}
                  <text
                    x={n.x}
                    y={n.kind === "account" ? n.y + 3 : n.y + 22}
                    textAnchor="middle"
                    className="fill-fg text-[8px]"
                  >
                    {n.kind === "account" ? n.id : n.label}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="grid gap-2 lg:grid-cols-2">
            <div>
              <p className="text-muted mb-1 text-[10px]">Cypher (graph)</p>
              <Code>{cypher(s.hops)}</Code>
            </div>
            <div>
              <p className="text-muted mb-1 text-[10px]">SQL (tables): {s.hops * 2} self-joins</p>
              <Code>{sql(s.hops)}</Code>
            </div>
          </div>
        </div>
      }
    >
      <p>
        Account A1 is a known fraudster. Accounts that share its phone, device or address, and
        accounts that share with <em>those</em>, may be part of the same ring. Raise the number of
        hops.
      </p>
      <p>
        In a graph query, more hops is a bigger number in one pattern. In SQL, every hop adds two
        more self-joins of an identifiers table. Neo4j&apos;s own fraud page puts the idea simply:
        fraudsters &ldquo;operate in rings, not in isolation&rdquo;. A5 and A6 share an address too,
        but nothing links them to A1.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Property graphs and RDF --------------------------------------------------------------------- */

export function TwoGraphModels() {
  const [s, set] = useSceneState<GraphState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Property graphs and RDF"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1.5">
            {[
              [false, "property graph"],
              [true, "RDF triples"],
            ].map(([v, l]) => (
              <button
                key={String(v)}
                type="button"
                aria-pressed={s.rdf === v}
                onClick={() => set({ rdf: v as boolean })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.rdf === v ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {l as string}
              </button>
            ))}
          </div>
          <Code>{s.rdf ? RDF : PG}</Code>
          <p className="text-muted text-xs">Same fact: Asha has known Ben since 2019.</p>
        </div>
      }
    >
      <p>
        There are two main graph models. Property graphs (Neo4j and others) put properties on nodes
        and relationships. <Term id="rdf">RDF</Term>, a W3C standard, writes everything as subject,
        predicate, object triples with web identifiers, which suits linking data across
        organisations.
      </p>
      <p>
        RDF 1.1 (2014) is the current W3C Recommendation; RDF 1.2, which can make statements about
        statements, was a Candidate Recommendation as of April 2026.
      </p>
    </StepLayout>
  );
}

/* 4 ─ When a graph fits --------------------------------------------------------------------------- */

export function WhenGraph() {
  const cards: [string, string][] = [
    ["Many hops", "Friends of friends, supply chains, who-reports-to-whom: questions about paths."],
    ["Connections are the point", "Fraud rings, recommendations, network dependencies."],
    [
      "The shape keeps changing",
      "New kinds of relationship can be added without reworking tables.",
    ],
    ["Not for sums", "Monthly revenue by region is still a job for a star schema."],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="When a graph fits"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {cards.map(([t, d], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.07 * i }}
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs",
                  i === 3 ? "border-line bg-surface-2" : "border-line bg-surface",
                )}
              >
                <p className="font-semibold">{t}</p>
                <p className="text-muted mt-0.5">{d}</p>
              </motion.div>
            ))}
          </div>
          <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
            <span className="font-semibold">ISO GQL (ISO/IEC 39075:2024)</span>, published 12 April
            2024: a standard query language for property graphs, influenced by Cypher, and the first
            new ISO database language since SQL.
          </div>
        </div>
      }
    >
      <p>
        Graphs shine when the questions are about connections, especially chains of them.
        They&apos;re a poor fit for wide aggregations over millions of rows, where tables and
        columnar engines win.
      </p>
      <p>
        Since 2024 property graphs have their own ISO standard query language, GQL. Many relational
        databases have also added graph queries over ordinary tables.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Graph or table? ----------------------------------------------------------------------------- */

export function GraphOrTable() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Graph or table?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="graph-or-table"
            prompt="Which model suits each question better?"
            categories={[
              { id: "graph", label: "Graph" },
              { id: "table", label: "Tables" },
            ]}
            items={[
              {
                id: "rev",
                label: "Monthly revenue by region",
                category: "table",
                why: "A big aggregation: star schema territory.",
              },
              {
                id: "fof",
                label: "People within four introductions of a candidate",
                category: "graph",
                why: "A variable-length path.",
              },
              {
                id: "route",
                label: "Shortest route between two metro stations",
                category: "graph",
                why: "Pathfinding over connections.",
              },
              {
                id: "payroll",
                label: "This month's payroll for 2,000 staff",
                category: "table",
                why: "Rows and sums.",
              },
              {
                id: "ring",
                label: "Accounts linked by chains of shared devices and phones",
                category: "graph",
                why: "Connections are the point.",
              },
            ]}
            explanation="Graphs suit questions about paths and connections; tables suit filtering and summing many rows."
          />
        </div>
      }
    >
      <p>Sort the questions.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  [
    "Nodes and relationships",
    "Both can carry properties; relationships have a type and direction.",
  ],
  ["No joins to follow", "Hops are part of the pattern."],
  ["Two models", "Property graphs and RDF triples."],
  ["A standard language", "ISO GQL, 2024."],
  ["Use for connections", "Not for big sums."],
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
      <p>Next: modelling time itself, from valid time to record time.</p>
    </StepLayout>
  );
}
