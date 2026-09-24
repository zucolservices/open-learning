"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { useTicker } from "@/lib/use-ticker";

/**
 * Brewline's data platform, era by era. Every scene uses the same vocabulary:
 * sources on the left, storage in the centre, consumers on the right.
 * viewBox 400 × 280.
 */

function Svg({ label, children }: { label: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 400 280"
      className="h-full w-full"
      role="img"
      aria-label={label}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function Db({ x, y, label, sub }: { x: number; y: number; label: string; sub?: string }) {
  return (
    <g>
      <path
        d={`M${x} ${y + 8}v38c0 5 10 8 22 8s22-3 22-8V${y + 8}`}
        className="fill-viz-idle/20 stroke-viz-idle"
        strokeWidth={1.4}
      />
      <ellipse
        cx={x + 22}
        cy={y + 8}
        rx={22}
        ry={8}
        className="fill-surface-2 stroke-viz-idle"
        strokeWidth={1.4}
      />
      <text x={x + 22} y={y + 70} textAnchor="middle" className="fill-fg text-[10px] font-medium">
        {label}
      </text>
      {sub && (
        <text
          x={x + 22}
          y={y + 82}
          textAnchor="middle"
          className="fill-subtle font-mono text-[8px]"
        >
          {sub}
        </text>
      )}
    </g>
  );
}

function Box({
  x,
  y,
  w,
  h,
  label,
  cls = "fill-surface stroke-line-strong",
  text = "fill-fg",
  size = 10,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  cls?: string;
  text?: string;
  size?: number;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} className={cls} strokeWidth={1.4} />
      {label && (
        <text
          x={x + w / 2}
          y={y + h / 2 + size / 3}
          textAnchor="middle"
          className={`${text} font-medium`}
          style={{ fontSize: size }}
        >
          {label}
        </text>
      )}
    </g>
  );
}

function Flow({ d, cls = "stroke-accent" }: { d: string; cls?: string }) {
  return <path d={d} className={`${cls} flow`} strokeWidth={2} />;
}

function File({
  x,
  y,
  cls = "fill-viz-data/25 stroke-viz-data",
  rot = 0,
  columnar,
}: {
  x: number;
  y: number;
  cls?: string;
  rot?: number;
  columnar?: boolean;
}) {
  return (
    <g transform={`rotate(${rot} ${x + 7} ${y + 9})`}>
      <path d={`M${x} ${y}h10l4 4v14h-14z`} className={cls} strokeWidth={1.2} />
      {columnar &&
        [3, 7, 11].map((dx) => (
          <line
            key={dx}
            x1={x + dx}
            y1={y + 6}
            x2={x + dx}
            y2={y + 15}
            className="stroke-viz-data"
            strokeWidth={1.4}
          />
        ))}
    </g>
  );
}

function Tags({ good = [], bad = [] }: { good?: string[]; bad?: string[] }) {
  const all = [...good.map((t) => ["✓", t, "fill-good"]), ...bad.map((t) => ["✗", t, "fill-bad"])];
  return (
    <g>
      {all.map(([sym, t, cls], i) => (
        <text
          key={t}
          x={i % 2 === 0 ? 12 : 206}
          y={248 + Math.floor(i / 2) * 16}
          className="fill-muted text-[10px]"
        >
          <tspan className={`${cls} font-bold`}>{sym}</tspan> {t}
        </text>
      ))}
    </g>
  );
}

function Bars({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={60} height={52} rx={6} className="fill-surface stroke-line-strong" />
      {[18, 30, 24, 38].map((h, i) => (
        <rect
          key={i}
          x={x + 8 + i * 12}
          y={y + 44 - h}
          width={8}
          height={h}
          rx={1.5}
          className="fill-viz-data"
        />
      ))}
    </g>
  );
}

/* 0 ─ The data warehouse ----------------------------------------------- */
function Warehouse() {
  return (
    <Svg label="Nightly ETL copies data from the app database into a data warehouse that powers BI dashboards.">
      <Db x={24} y={86} label="Tills DB" sub="OLTP" />
      <Flow d="M74 118H146" />
      <text x={110} y={108} textAnchor="middle" className="fill-muted font-mono text-[9px]">
        nightly ETL
      </text>
      <rect
        x={150}
        y={62}
        width={128}
        height={120}
        rx={10}
        className="fill-viz-meta/10 stroke-viz-meta"
        strokeWidth={1.5}
      />
      <text x={214} y={80} textAnchor="middle" className="fill-fg text-[11px] font-semibold">
        Data warehouse
      </text>
      <Box
        x={166}
        y={90}
        w={96}
        h={30}
        label="compute"
        cls="fill-viz-compute/20 stroke-viz-compute"
        size={10}
      />
      <Box
        x={166}
        y={120}
        w={96}
        h={30}
        label="storage"
        cls="fill-viz-data/20 stroke-viz-data"
        size={10}
      />
      <text x={214} y={170} textAnchor="middle" className="fill-subtle font-mono text-[8px]">
        🔒 proprietary format
      </text>
      <Flow d="M280 118H316" />
      <Bars x={320} y={92} />
      <text x={350} y={160} textAnchor="middle" className="fill-muted text-[9px]">
        BI reports
      </text>
      <Tags
        good={["fast, reliable SQL", "one trusted source"]}
        bad={["expensive to scale", "structured data only"]}
      />
    </Svg>
  );
}

/* 1 ─ Big data and Hadoop ----------------------------------------------- */
function Hadoop() {
  const sources = ["app logs", "clickstream", "JSON events", "images"];
  return (
    <Svg label="Many kinds of data flow into a Hadoop cluster whose nodes each hold both storage and compute.">
      {sources.map((s, i) => (
        <g key={s}>
          <Box
            x={8}
            y={52 + i * 36}
            w={74}
            h={24}
            label={s}
            size={9}
            cls="fill-surface-2 stroke-line-strong"
          />
          <Flow d={`M84 ${64 + i * 36}L146 ${110 + (i - 1.5) * 12}`} cls="stroke-viz-data" />
        </g>
      ))}
      <rect
        x={148}
        y={48}
        width={140}
        height={150}
        rx={10}
        className="fill-viz-idle/10 stroke-viz-idle"
        strokeWidth={1.5}
      />
      <text x={218} y={66} textAnchor="middle" className="fill-fg text-[10px] font-semibold">
        Hadoop cluster
      </text>
      {Array.from({ length: 6 }, (_, i) => {
        const x = 160 + (i % 3) * 42;
        const y = 76 + Math.floor(i / 3) * 56;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={36}
              height={48}
              rx={5}
              className="fill-surface stroke-line-strong"
            />
            <rect
              x={x + 6}
              y={y + 7}
              width={24}
              height={12}
              rx={2}
              className="fill-viz-compute/40"
            />
            <rect x={x + 6} y={y + 25} width={24} height={16} rx={2} className="fill-viz-data/40" />
          </g>
        );
      })}
      <Flow d="M290 110H318" cls="stroke-viz-compute" />
      <Box x={320} y={82} w={72} h={24} label="Hive SQL" size={9} />
      <Box x={320} y={114} w={72} h={24} label="batch jobs" size={9} />
      <Tags
        good={["cheap, stores any data", "schema-on-read"]}
        bad={["slow and complex to run", "storage + compute on the same nodes"]}
      />
    </Svg>
  );
}

/* 2 ─ The swamp ---------------------------------------------------------- */
function Swamp() {
  const files: [number, number, number, string, string?][] = [
    [40, 120, -14, "sales_final.csv"],
    [120, 150, 8, "sales_final_v2.csv"],
    [210, 118, -6, "sales_FINAL_fixed.csv"],
    [300, 150, 12, "events_tmp_0932"],
    [80, 184, 4, "customers.json"],
    [250, 188, -10, "part-0007", "half"],
  ];
  return (
    <Svg label="The lake becomes a swamp: duplicate files, half-written data, and nobody knows which is right.">
      <path d="M0 110q50-16 100 0t100 0 100 0 100 0V232H0z" className="fill-viz-idle/15" />
      <path
        d="M0 110q50-16 100 0t100 0 100 0 100 0"
        className="stroke-viz-idle"
        strokeWidth={1.5}
      />
      {files.map(([x, y, r, name, half], i) => (
        <motion.g
          key={name}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <File
            x={x}
            y={y}
            rot={r}
            cls={
              half
                ? "fill-viz-remove/15 stroke-viz-remove [stroke-dasharray:3_2]"
                : "fill-viz-data/15 stroke-viz-data/70"
            }
          />
          <text
            x={x + 20}
            y={y + 12}
            className={half ? "fill-bad font-mono text-[8px]" : "fill-muted font-mono text-[8px]"}
          >
            {name}
            {half ? " (half-written)" : ""}
          </text>
        </motion.g>
      ))}
      {[
        [70, 60],
        [200, 48],
        [330, 66],
      ].map(([x, y], i) => (
        <motion.text
          key={i}
          x={x}
          y={y}
          className="fill-viz-compute text-[26px] font-bold"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
        >
          ?
        </motion.text>
      ))}
      <text x={200} y={88} textAnchor="middle" className="fill-fg text-[11px] font-semibold">
        “Which sales file is the real one?”
      </text>
      <Tags
        bad={[
          "no transactions: half-written files",
          "no schema: readers break",
          "no catalog: nothing is trusted",
          "copies everywhere",
        ]}
      />
    </Svg>
  );
}

/* 3 ─ Cloud object storage + separated compute --------------------------- */
function Cloud() {
  const { ref, tick } = useTicker<SVGSVGElement>(1300);
  const clusters = [1, 3, 4, 2][tick % 4];
  return (
    <svg
      ref={ref}
      viewBox="0 0 400 280"
      className="h-full w-full"
      role="img"
      aria-label="Compute clusters scale up and down independently above shared cloud object storage."
      fill="none"
    >
      <text x={200} y={30} textAnchor="middle" className="fill-muted text-[10px]">
        compute: scales up and down on its own
      </text>
      {Array.from({ length: 4 }, (_, i) => (
        <motion.g
          key={i}
          animate={{ opacity: i < clusters ? 1 : 0.12, y: i < clusters ? 0 : 8 }}
          transition={{ duration: 0.4 }}
        >
          <Box
            x={28 + i * 90}
            y={44}
            w={74}
            h={44}
            label={`cluster ${i + 1}`}
            cls="fill-viz-compute/20 stroke-viz-compute"
            size={10}
          />
          <Flow
            d={`M${65 + i * 90} 90V168`}
            cls={i < clusters ? "stroke-viz-compute" : "stroke-transparent"}
          />
        </motion.g>
      ))}
      <rect
        x={20}
        y={170}
        width={360}
        height={52}
        rx={10}
        className="fill-viz-data/10 stroke-viz-data"
        strokeWidth={1.5}
      />
      <text x={200} y={188} textAnchor="middle" className="fill-fg text-[11px] font-semibold">
        Object storage: S3 · GCS · ADLS
      </text>
      {Array.from({ length: 14 }, (_, i) => (
        <File key={i} x={40 + i * 23} y={196} />
      ))}
      <Tags
        good={["cheap, durable, practically unlimited", "pay for compute only while it runs"]}
        bad={["objects, not files: no atomic rename"]}
      />
    </svg>
  );
}

/* 4 ─ Two-tier: lake + warehouse ----------------------------------------- */
function TwoTier() {
  return (
    <Svg label="A two-tier architecture: raw data lands in the lake, then a second copy is loaded into a warehouse for BI.">
      <Box
        x={8}
        y={70}
        w={62}
        h={24}
        label="sources"
        size={9}
        cls="fill-surface-2 stroke-line-strong"
      />
      <Flow d="M72 82H104" cls="stroke-viz-data" />
      <rect
        x={106}
        y={50}
        width={96}
        height={68}
        rx={10}
        className="fill-viz-data/10 stroke-viz-data"
        strokeWidth={1.5}
      />
      <text x={154} y={68} textAnchor="middle" className="fill-fg text-[10px] font-semibold">
        Data lake
      </text>
      {Array.from({ length: 6 }, (_, i) => (
        <File key={i} x={116 + (i % 3) * 26} y={76 + Math.floor(i / 3) * 18} />
      ))}
      <Flow d="M204 84H240" />
      <text x={222} y={74} textAnchor="middle" className="fill-muted font-mono text-[8px]">
        ETL
      </text>
      <rect
        x={242}
        y={50}
        width={90}
        height={68}
        rx={10}
        className="fill-viz-meta/10 stroke-viz-meta"
        strokeWidth={1.5}
      />
      <text x={287} y={68} textAnchor="middle" className="fill-fg text-[10px] font-semibold">
        Warehouse
      </text>
      <text x={287} y={88} textAnchor="middle" className="fill-viz-meta text-[9px]">
        copy #2
      </text>
      <text x={287} y={104} textAnchor="middle" className="fill-subtle font-mono text-[8px]">
        loaded nightly
      </text>
      <Flow d="M334 84H338" />
      <Bars x={340} y={58} />
      <text x={370} y={124} textAnchor="middle" className="fill-muted text-[9px]">
        BI
      </text>
      <Flow d="M154 120V150" cls="stroke-viz-compute" />
      <Box
        x={112}
        y={152}
        w={84}
        h={28}
        label="ML / data science"
        size={9}
        cls="fill-viz-compute/15 stroke-viz-compute"
      />
      <text x={287} y={150} textAnchor="middle" className="fill-bad text-[10px] font-semibold">
        2 copies · 2 systems
      </text>
      <text x={287} y={166} textAnchor="middle" className="fill-bad text-[10px]">
        BI sees yesterday&apos;s data
      </text>
      <Tags
        good={["ML on the lake, BI on the warehouse"]}
        bad={[
          "pay for storage twice",
          "stale reports",
          "two security models",
          "ETL breaks, reports drift",
        ]}
      />
    </Svg>
  );
}

/* 5 ─ Open, columnar file formats ---------------------------------------- */
function OpenFormats() {
  return (
    <Svg label="Open columnar file formats such as Parquet and ORC let many engines read the same files directly.">
      {["Spark", "Trino / Presto", "Hive"].map((e, i) => (
        <g key={e}>
          <Box
            x={30 + i * 120}
            y={40}
            w={100}
            h={28}
            label={e}
            size={10}
            cls="fill-viz-compute/20 stroke-viz-compute"
          />
          <Flow d={`M${80 + i * 120} 70V128`} cls="stroke-viz-compute" />
        </g>
      ))}
      <rect
        x={20}
        y={130}
        width={360}
        height={80}
        rx={10}
        className="fill-viz-data/10 stroke-viz-data"
        strokeWidth={1.5}
      />
      <text x={200} y={148} textAnchor="middle" className="fill-fg text-[11px] font-semibold">
        Parquet · ORC files in object storage
      </text>
      {Array.from({ length: 12 }, (_, i) => (
        <File key={i} x={42 + i * 28} y={162} columnar />
      ))}
      <Tags
        good={["open: any engine can read them", "columnar: fast scans, good compression"]}
        bad={["a folder of files still isn't a table", "no safe updates or deletes"]}
      />
    </Svg>
  );
}

/* 6 ─ Open table formats ------------------------------------------------- */
function TableFormats() {
  return (
    <Svg label="Open table formats add a metadata layer over the files: transactions, snapshots and schema.">
      <rect
        x={20}
        y={40}
        width={360}
        height={70}
        rx={10}
        className="fill-viz-meta/15 stroke-viz-meta"
        strokeWidth={1.5}
      />
      <text x={200} y={58} textAnchor="middle" className="fill-fg text-[11px] font-semibold">
        Table format: metadata + transaction log
      </text>
      {["Apache Hudi", "Apache Iceberg", "Delta Lake"].map((n, i) => (
        <Box
          key={n}
          x={40 + i * 110}
          y={70}
          w={96}
          h={28}
          label={n}
          size={10}
          cls="fill-surface stroke-viz-meta"
        />
      ))}
      <Flow d="M200 112V140" cls="stroke-viz-meta" />
      <rect
        x={20}
        y={142}
        width={360}
        height={66}
        rx={10}
        className="fill-viz-data/10 stroke-viz-data"
        strokeWidth={1.5}
      />
      {Array.from({ length: 12 }, (_, i) => (
        <File key={i} x={42 + i * 28} y={166} columnar />
      ))}
      <text x={200} y={160} textAnchor="middle" className="fill-muted text-[9px]">
        the same Parquet files
      </text>
      <Tags
        good={[
          "ACID transactions",
          "time travel",
          "schema enforcement + evolution",
          "updates, deletes, MERGE",
        ]}
      />
    </Svg>
  );
}

/* 7 ─ The lakehouse -------------------------------------------------------- */
function Lakehouse() {
  const layers: [string, string][] = [
    ["Engines: Spark · Trino · DuckDB · warehouses", "fill-viz-compute/20 stroke-viz-compute"],
    ["Catalog + governance", "fill-accent/20 stroke-accent"],
    ["Open table format", "fill-viz-meta/20 stroke-viz-meta"],
    ["Open file format (Parquet)", "fill-viz-data/20 stroke-viz-data"],
    ["Object storage", "fill-viz-idle/20 stroke-viz-idle"],
  ];
  return (
    <Svg label="The lakehouse: one copy of open data in object storage, with table format, catalog and any engine on top, serving BI, ML and AI.">
      {layers.map(([label, cls], i) => (
        <motion.g
          key={label}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: (4 - i) * 0.12 }}
        >
          <Box x={20} y={34 + i * 40} w={236} h={32} label={label} size={10} cls={cls} />
        </motion.g>
      ))}
      {["BI dashboards", "ML models", "AI apps"].map((c, i) => (
        <g key={c}>
          <Flow d={`M258 50 C290 50 290 ${60 + i * 56} 310 ${60 + i * 56}`} />
          <Box
            x={310}
            y={46 + i * 56}
            w={82}
            h={28}
            label={c}
            size={9}
            cls="fill-surface stroke-accent"
          />
        </g>
      ))}
      <Tags
        good={[
          "one copy of open data",
          "warehouse guarantees on the lake",
          "any engine, no lock-in",
          "BI, ML and AI on the same tables",
        ]}
      />
    </Svg>
  );
}

export const ERA_SCENES = [
  Warehouse,
  Hadoop,
  Swamp,
  Cloud,
  TwoTier,
  OpenFormats,
  TableFormats,
  Lakehouse,
];
