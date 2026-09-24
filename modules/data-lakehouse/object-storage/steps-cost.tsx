"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Snowflake, TriangleAlert } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { cn } from "@/lib/cn";
import { LIST_PAGE, PRICE } from "./data";
import type { StorageState } from "./state";
import { Term } from "@/toolkit/glossary/term";

/* 8 ─ Many small objects --------------------------------------------------- */

const FILE_MB = [1, 8, 64, 128, 512, 1024];
const DATASET_MB = 1_000_000; // 1 TB

function fmtCount(n: number) {
  return n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`
    : n >= 1000
      ? `${Math.round(n / 1000)}K`
      : `${Math.round(n)}`;
}

export function SmallObjects() {
  const [s, set] = useSceneState<StorageState>();
  const mb = FILE_MB[s.fileSizeIndex];
  const objects = Math.ceil(DATASET_MB / mb);
  const lists = Math.ceil(objects / LIST_PAGE);
  const gets = objects;
  const cost = (gets / 1000) * PRICE.getPer1000 + (lists / 1000) * PRICE.putPer1000;
  const maxObjects = DATASET_MB / FILE_MB[0];
  const tiles = Math.min(256, Math.max(1, Math.round(256 / Math.sqrt(mb))));

  return (
    <StepLayout
      eyebrow="Cost & speed"
      title="The same terabyte, cut into different sizes"
      stage={
        <div className="flex flex-1 flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-muted">File size</span>
            <input
              type="range"
              min={0}
              max={FILE_MB.length - 1}
              value={s.fileSizeIndex}
              onChange={(e) => set({ fileSizeIndex: Number(e.target.value) })}
              aria-label="File size"
              className="min-w-40 flex-1 accent-[var(--accent)]"
            />
            <span className="w-20 text-right font-mono font-semibold tabular-nums">
              {mb >= 1024 ? "1 GB" : `${mb} MB`}
            </span>
          </div>

          <div className="grid items-center gap-4 sm:grid-cols-[11rem_minmax(0,1fr)]">
            <div className="border-line bg-bg/40 rounded-2xl border p-3">
              <p className="text-muted mb-2 text-xs">1 TB, as files</p>
              <motion.div
                layout
                className="mx-auto grid size-36 content-start gap-[2px]"
                style={{
                  gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(tiles))}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: tiles }, (_, i) => (
                  <motion.div
                    key={i}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "aspect-square rounded-[2px]",
                      mb < 64 ? "bg-viz-remove/60" : "bg-viz-data/60",
                    )}
                  />
                ))}
              </motion.div>
            </div>
            <div className="grid gap-3">
              <Meter
                label="Objects"
                value={fmtCount(objects)}
                ratio={objects / maxObjects}
                bad={mb < 64}
              />
              <Meter
                label="GET requests to read it all (at least)"
                value={fmtCount(gets)}
                ratio={gets / maxObjects}
                bad={mb < 64}
              />
              <Meter
                label="LIST requests to find the files"
                value={fmtCount(lists)}
                ratio={lists / (maxObjects / LIST_PAGE)}
                bad={mb < 64}
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-2xl border p-4">
              <p className="text-muted text-xs">Request cost for one full scan</p>
              <p className="text-2xl font-semibold tabular-nums">
                ${cost.toFixed(cost < 0.01 ? 4 : 2)}
              </p>
              <p className="text-subtle mt-1 text-[11px]">
                S3 Standard, us-east-1. Storage itself costs the same for every file size.
              </p>
            </div>
            <div
              className={cn(
                "rounded-2xl border p-4 text-sm",
                mb < 64 ? "border-bad/40 bg-bad/10" : "border-good/40 bg-good/10",
              )}
            >
              {mb < 64 ? (
                <p>
                  <strong className="text-bad">The real cost is time.</strong>{" "}
                  <span className="text-muted">
                    Every request carries fixed latency, and engines spend more time opening files
                    than reading data.
                  </span>
                </p>
              ) : (
                <p>
                  <strong className="text-good">Healthy size.</strong>{" "}
                  <span className="text-muted">
                    Few requests, long sequential reads. Table formats compact small files toward
                    sizes like this.
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      }
    >
      <p>
        Storage is billed per GB, so file size doesn&apos;t change the storage bill. But every file
        means <strong>requests</strong>: LIST to find it, and GETs to read it. Parquet readers
        usually issue several GETs per file.
      </p>
      <p>Drag the slider from 1 MB files to 1 GB files.</p>
      <p className="text-subtle text-xs">
        S3 also limits request rates per prefix, at least 3,500 writes and 5,500 reads per second,
        and scales up gradually. Millions of tiny files hit that sooner. This is the{" "}
        <Term id="small-files">
          <em>small-files problem</em>
        </Term>
        , which gets its own module later.
      </p>
    </StepLayout>
  );
}

function Meter({
  label,
  value,
  ratio,
  bad,
}: {
  label: string;
  value: string;
  ratio: number;
  bad: boolean;
}) {
  return (
    <div className="border-line bg-surface rounded-2xl border p-3">
      <p className="text-muted text-[11px] leading-tight">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
      <div className="bg-surface-2 mt-2 h-1.5 overflow-hidden rounded-full">
        <motion.div
          className={cn("h-full rounded-full", bad ? "bg-bad" : "bg-good")}
          animate={{ width: `${Math.max(1.5, ratio * 100)}%` }}
          transition={{ type: "spring", stiffness: 140, damping: 20 }}
        />
      </div>
    </div>
  );
}

/* 9 ─ Storage classes & lifecycle ----------------------------------------- */

const CLASSES = [
  {
    from: 0,
    name: "S3 Standard",
    gbMonth: 0.023,
    access: "Milliseconds. No retrieval fee.",
    note: "Hot data: everything engines query today.",
    cls: "bg-viz-data",
  },
  {
    from: 30,
    name: "S3 Standard-IA",
    gbMonth: 0.0125,
    access: "Milliseconds, plus a per-GB retrieval fee.",
    note: "Minimum 30-day charge, 128 KB minimum billable size.",
    cls: "bg-viz-meta",
  },
  {
    from: 90,
    name: "Glacier Flexible Retrieval",
    gbMonth: 0.0036,
    access: "Must be restored first: minutes to hours.",
    note: "Minimum 90-day charge. Engines cannot query it directly.",
    cls: "bg-viz-compute",
  },
  {
    from: 365,
    name: "Expired (deleted)",
    gbMonth: 0,
    access: "Gone.",
    note: "The lifecycle rule deletes the object.",
    cls: "bg-viz-remove",
  },
];

const MAX_AGE = 420;

export function Lifecycle() {
  const [s, set] = useSceneState<StorageState>();
  const current = [...CLASSES].reverse().find((c) => s.objectAge >= c.from)!;
  const archived = current.from >= 90;

  return (
    <StepLayout
      eyebrow="Storage classes"
      title="Let data cool down, and know what that costs you"
      stage={
        <div className="flex flex-1 flex-col gap-5">
          <pre className="bg-surface-2/60 overflow-x-auto rounded-xl px-4 py-3 font-mono text-[11px] leading-relaxed">
            {`Lifecycle rule for prefix raw/clickstream/
  after  30 days → STANDARD_IA
  after  90 days → GLACIER (Flexible Retrieval)
  after 365 days → expire`}
          </pre>

          <div>
            <div className="relative flex h-10 overflow-hidden rounded-xl">
              {CLASSES.map((c, i) => {
                const end = CLASSES[i + 1]?.from ?? MAX_AGE;
                return (
                  <div
                    key={c.name}
                    className={cn("h-full opacity-70", c.cls)}
                    style={{ width: `${((end - c.from) / MAX_AGE) * 100}%` }}
                  />
                );
              })}
              <motion.div
                className="bg-fg absolute top-0 bottom-0 w-1 rounded-full shadow"
                animate={{ left: `calc(${(s.objectAge / MAX_AGE) * 100}% - 2px)` }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={MAX_AGE}
              value={s.objectAge}
              onChange={(e) => set({ objectAge: Number(e.target.value) })}
              aria-label="Object age in days"
              className="mt-2 w-full accent-[var(--accent)]"
            />
            <p className="text-muted text-xs">
              Object age:{" "}
              <span className="text-fg font-mono font-semibold">{s.objectAge} days</span>
            </p>
          </div>

          <motion.div
            key={current.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface grid gap-4 rounded-2xl border p-4 sm:grid-cols-[1fr_auto]"
          >
            <div>
              <p className="flex items-center gap-2 font-semibold">
                <span className={cn("size-3 rounded-full", current.cls)} /> {current.name}
                {archived && current.gbMonth > 0 && (
                  <Snowflake className="text-viz-compute size-4" />
                )}
              </p>
              <p className="text-muted mt-1 text-sm">{current.access}</p>
              <p className="text-subtle mt-1 text-xs">{current.note}</p>
            </div>
            <div className="text-right">
              <p className="text-muted text-xs">per TB-month</p>
              <p className="text-2xl font-semibold tabular-nums">
                ${(current.gbMonth * 1000).toFixed(2)}
              </p>
            </div>
          </motion.div>

          <div className="border-viz-compute/40 bg-viz-compute/10 flex gap-3 rounded-2xl border p-4 text-sm">
            <TriangleAlert className="text-viz-compute mt-0.5 size-4 shrink-0" />
            <p className="text-muted">
              <strong className="text-fg">Careful with tables.</strong> If a lifecycle rule archives
              or deletes a file that a table snapshot still references, queries on that table fail.
              Tier raw landing data and old exports freely. Clean up table files with the table
              format&apos;s own maintenance (VACUUM, expire snapshots), never raw lifecycle deletes.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Not all data is hot. S3 offers{" "}
        <Term id="storage-class">
          <strong>storage classes</strong>
        </Term>
        : cheaper per GB, but slower or pricier to read.{" "}
        <Term id="lifecycle-rule">
          <strong>Lifecycle rules</strong>
        </Term>{" "}
        move objects between them by age, or delete them.
      </p>
      <p>Age the object and watch its class, price and access change.</p>
      <p className="text-subtle text-xs">
        Prices: S3, us-east-1, per GB-month. Other options include Intelligent-Tiering (moves
        objects automatically), Glacier Instant Retrieval and Deep Archive.
      </p>
    </StepLayout>
  );
}

/* 10 ─ S3 vs GCS vs ADLS --------------------------------------------------- */

const STORES: { name: string; rows: [string, string, "good" | "bad" | "mid"][] }[] = [
  {
    name: "Amazon S3 (general purpose)",
    rows: [
      ["Namespace", "Flat keys", "mid"],
      ["Rename a directory", "No: copy + delete per object", "bad"],
      ["Create-if-absent", "If-None-Match: * (since 2024)", "good"],
      ["Consistency", "Strong read-after-write", "good"],
    ],
  },
  {
    name: "S3 Express One Zone",
    rows: [
      ["Namespace", "Directory buckets", "good"],
      ["Rename a directory", "No. Atomic RenameObject for single objects only (2025)", "mid"],
      ["Create-if-absent", "Supported", "good"],
      ["Consistency", "Strong read-after-write", "good"],
    ],
  },
  {
    name: "Google Cloud Storage",
    rows: [
      ["Namespace", "Flat, or hierarchical if chosen at bucket creation", "mid"],
      ["Rename a directory", "Atomic folder rename in hierarchical-namespace buckets", "good"],
      ["Create-if-absent", "ifGenerationMatch=0", "good"],
      ["Consistency", "Strong read-after-write", "good"],
    ],
  },
  {
    name: "Azure Data Lake Storage",
    rows: [
      ["Namespace", "Hierarchical namespace (real directories)", "good"],
      ["Rename a directory", "Atomic: one metadata update", "good"],
      ["Create-if-absent", "If-None-Match: *", "good"],
      ["Consistency", "Strong", "good"],
    ],
  },
];

const tone = { good: "bg-good", bad: "bg-bad", mid: "bg-viz-compute" };

export function CompareStores() {
  return (
    <StepLayout
      eyebrow="Across clouds"
      title="Not all object stores are equal"
      stage={
        <div className="grid flex-1 content-start gap-4 md:grid-cols-2">
          {STORES.map((store, si) => (
            <motion.div
              key={store.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.08 }}
              className="border-line bg-surface rounded-2xl border p-4"
            >
              <p className="font-semibold tracking-tight">{store.name}</p>
              <ul className="mt-3 grid gap-2.5">
                {store.rows.map(([k, v, t]) => (
                  <li key={k} className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-2 text-xs">
                    <span className="text-muted">{k}</span>
                    <span className="flex gap-1.5">
                      <span className={cn("mt-1 size-2 shrink-0 rounded-full", tone[t])} />
                      {v}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The big three differ in exactly the places this module explored: directories, rename and
        conditional writes.
      </p>
      <p>
        Hierarchical namespaces make renames atomic. Table formats only need one small atomic commit
        per version, and each store can provide that in its own way (Delta on Azure, for example,
        uses rename-without-overwrite), which is why the same Delta or Iceberg table works on every
        one of them.
      </p>
      <p className="text-subtle text-xs">
        AWS also offers <strong>table buckets (S3 Tables)</strong>, which manage Apache Iceberg
        tables for you. More in the AWS module.
      </p>
    </StepLayout>
  );
}

/* 11 ─ Takeaways ------------------------------------------------------------ */

const FACTS: [string, string][] = [
  ["Max object size", "50 TB (since Dec 2025)"],
  ["Single PUT", "up to 5 GB"],
  ["Multipart parts", "5 MiB–5 GiB, up to 10,000"],
  ["LIST page", "1,000 keys"],
  ["Durability (S3 Standard)", "designed for 11 nines"],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to take away"
      stage={
        <div className="grid flex-1 content-center gap-5">
          {[
            [
              "Keys, not folders",
              "Object storage is a flat key → bytes map. Folders are prefixes drawn by the console.",
            ],
            [
              "No atomic rename",
              "Renaming a prefix copies and deletes every object, can stop halfway, and copies every byte.",
            ],
            [
              "One atomic write is enough",
              "Put-if-absent on a single small object is the foundation table formats build their commits on.",
            ],
            [
              "Requests cost time and money",
              "LIST pages 1,000 keys at a time; tiny files multiply requests. Aim for large files.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="border-line bg-surface flex gap-3 rounded-2xl border p-4"
            >
              <span className="bg-viz-idle/20 grid size-7 shrink-0 place-items-center rounded-full font-mono text-xs font-semibold">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold">{t}</p>
                <p className="text-muted text-sm">{b}</p>
              </div>
            </motion.div>
          ))}
          <div>
            <p className="text-muted mb-2 text-xs">S3 numbers worth remembering</p>
            <div className="flex flex-wrap gap-1.5">
              {FACTS.map(([k, v]) => (
                <span key={k} className="bg-surface-2 rounded-full px-2.5 py-1 text-xs">
                  <span className="text-muted">{k}:</span> {v}
                </span>
              ))}
            </div>
          </div>
          <Link
            href="/tracks/data-lakehouse/delta-lake"
            className="text-accent inline-flex items-center gap-1 text-sm hover:underline"
          >
            See these ideas at work in the Delta Lake transaction log{" "}
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      }
    >
      <p>
        The ground floor is cheap, durable and endlessly scalable. It&apos;s also missing the one
        thing databases took for granted: an atomic way to change many things at once.
      </p>
      <p>
        Everything above it in the stack, starting with <strong>file formats</strong> in the next
        module, is designed around these rules.
      </p>
    </StepLayout>
  );
}
