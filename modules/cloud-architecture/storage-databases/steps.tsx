"use client";

import { motion } from "motion/react";
import { Archive, Check, FolderOpen, HardDrive, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { HOURS, PER_GB_MONTH, RDS, inr, usd } from "./prices";
import type { Place, StorageState } from "./state";

/* 1 ─ Warehouse, drawer, cupboard ----------------------------------------------------------------- */

const KINDS: [typeof Archive, string, string, string][] = [
  [
    Archive,
    "Object storage · a warehouse",
    "Boxes on endless shelves, each fetched whole by its label. Cheap, huge, reachable from anywhere over the web.",
    "S3, Azure Blob Storage, Google Cloud Storage",
  ],
  [
    HardDrive,
    "Block storage · a desk drawer",
    "Fast and right under one desk. Programs that need a real disk, like databases, use it.",
    "EBS, Azure managed disks, Persistent Disk / Hyperdisk",
  ],
  [
    FolderOpen,
    "File storage · a shared cupboard",
    "Folders many people open and edit at once, like a network drive.",
    "EFS and FSx, Azure Files, Filestore",
  ],
];

export function ThreeKinds() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Warehouse, drawer, cupboard"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {KINDS.map(([Icon, t, d, ex], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface flex items-start gap-3 rounded-xl border px-4 py-3"
            >
              <Icon className="text-accent mt-0.5 size-5 shrink-0" />
              <div>
                <p className="font-semibold">{t}</p>
                <p className="text-muted mt-0.5 text-sm">{d}</p>
                <p className="text-muted mt-1 text-[11px]">{ex}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        An office keeps papers in three ways: archive boxes in a warehouse, files in a desk drawer,
        and folders in a shared cupboard. Clouds offer the same three, with very different prices.
      </p>
      <p>
        <Term id="object-storage">Object storage</Term> is the warehouse, and the cheapest by far.{" "}
        <Term id="block-storage">Block storage</Term> is a disk attached to one server, in one zone.{" "}
        <Term id="file-storage">File storage</Term> is shared. Picking the right one is the first
        cost decision for any data.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Place the department's data ⭐ --------------------------------------------------------------- */

const OPTIONS: [Place, string][] = [
  ["std", "Object · Standard"],
  ["ia", "Object · Infrequent"],
  ["gir", "Object · Glacier Instant"],
  ["deep", "Object · Deep Archive"],
  ["block", "Block disk"],
  ["file", "File share"],
];

type Fit = [ok: "good" | "warn" | "bad", text: string];

const DATA: { id: string; name: string; gb: number; desc: string; fit: Record<Place, Fit> }[] = [
  {
    id: "scans",
    name: "Scanned land records",
    gb: 5000,
    desc: "5 TB of PDFs. Read often the first month, rarely after; citizens ask for copies online.",
    fit: {
      std: ["warn", "Works, but you pay top price for files nobody opens."],
      ia: ["good", "Good: cheaper storage, small fee per read."],
      gir: [
        "good",
        "Good for older scans: very cheap, still opens in milliseconds (retrievals cost more).",
      ],
      deep: [
        "bad",
        "Cheapest, but each request waits up to 12 hours to restore. Not for files citizens ask for.",
      ],
      block: ["bad", "A disk on one server, at nearly 4× Standard's price."],
      file: ["bad", "A shared drive at 13× Standard's price."],
    },
  },
  {
    id: "db",
    name: "The case database",
    gb: 200,
    desc: "200 GB, constant small reads and writes from the case-management app.",
    fit: {
      std: ["bad", "Databases can't run on object storage: they need a real disk."],
      ia: ["bad", "Databases can't run on object storage."],
      gir: ["bad", "Databases can't run on object storage."],
      deep: ["bad", "Databases can't run on object storage, least of all an offline archive."],
      block: [
        "good",
        "Right: a fast disk for the database server (or a managed database, next steps).",
      ],
      file: ["warn", "Possible but slower and pricier; databases want block storage."],
    },
  },
  {
    id: "docs",
    name: "Shared office documents",
    gb: 500,
    desc: "500 GB of documents 80 staff open and edit like a network drive.",
    fit: {
      std: ["warn", "Cheap, but staff can't open it like a shared drive without extra software."],
      ia: ["warn", "Cheap, but not a shared drive, and every read costs."],
      gir: ["bad", "Not a shared drive; edits mean expensive retrievals."],
      deep: ["bad", "Offline archive: no."],
      block: ["bad", "A disk attaches to one server; 80 people need a share."],
      file: [
        "good",
        "Right: a shared file system. Lifecycle can move untouched files to its cheaper tier.",
      ],
    },
  },
  {
    id: "backups",
    name: "Nightly backups",
    gb: 2000,
    desc: "2 TB kept for a year, almost never read.",
    fit: {
      std: ["warn", "Safe but pricey for data you hope never to read."],
      ia: ["warn", "Better, but colder tiers are cheaper still."],
      gir: ["good", "Good if restores must be instant."],
      deep: [
        "good",
        "Great for long-term copies: restore takes hours, which is acceptable for old backups.",
      ],
      block: ["bad", "Expensive, and in the same zone as what it protects."],
      file: ["bad", "The most expensive place for backups."],
    },
  },
];

export function PlaceData() {
  const [s, set] = useSceneState<StorageState>();
  const placed = s.placed;
  const total = DATA.reduce((sum, d) => sum + d.gb * PER_GB_MONTH[placed[d.id] ?? "std"], 0);
  return (
    <StepLayout
      eyebrow="Simulation · AWS Mumbai prices, Oct 2026"
      title="Place the department's data"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {DATA.map((d) => {
            const p = placed[d.id] ?? "std";
            const [ok, text] = d.fit[p];
            const cost = d.gb * PER_GB_MONTH[p];
            return (
              <div key={d.id} className="border-line bg-surface rounded-xl border px-3 py-2">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold">{d.name}</p>
                  <p className="font-mono text-xs">{usd(cost)}/mo</p>
                </div>
                <p className="text-muted text-[11px]">{d.desc}</p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {OPTIONS.map(([k, n]) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => set({ placed: { ...placed, [d.id]: k } })}
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px]",
                        p === k ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <p
                  className={cn(
                    "mt-1 text-[11px]",
                    ok === "good" ? "text-good" : ok === "bad" ? "text-bad" : "text-muted",
                  )}
                >
                  {text}
                </p>
              </div>
            );
          })}
          <div className="bg-surface-2 flex items-baseline justify-between rounded-lg px-3 py-2">
            <span className="text-sm">Storage bill</span>
            <span className="font-mono text-sm font-semibold">
              {usd(total)}/month <span className="text-muted font-normal">≈ {inr(total)}</span>
            </span>
          </div>
        </div>
      }
    >
      <p>
        A district office is moving four kinds of data to the cloud. Everything starts in standard
        object storage. Move each to where it fits, and watch the bill.
      </p>
      <p>
        Per GB-month in Mumbai: S3 Standard $0.025, Infrequent Access $0.0138, Glacier Instant
        Retrieval $0.005, Deep Archive $0.002; a gp3 disk $0.0912; an EFS file share $0.33. Colder{" "}
        <Term id="storage-class">storage classes</Term> are cheaper to keep but charge to read, and
        have minimum stays (30, 90 or 180 days).
      </p>
    </StepLayout>
  );
}

/* 3 ─ Let files cool down ⭐ ----------------------------------------------------------------------- */

const MONTHS = 24;
const GB = 5000;

function tierAt(month: number, rule: boolean): keyof typeof PER_GB_MONTH {
  if (!rule) return "std";
  if (month < 1) return "std";
  if (month < 3) return "ia";
  if (month < 12) return "gir";
  return "deep";
}

const TIER_LABEL: Record<string, string> = {
  std: "Standard",
  ia: "Infrequent Access",
  gir: "Glacier Instant",
  deep: "Deep Archive",
};

export function Lifecycle() {
  const [s, set] = useSceneState<StorageState>();
  const bars = Array.from({ length: MONTHS }, (_, m) => {
    const t = tierAt(m, s.lifecycle);
    return { m, t, cost: GB * PER_GB_MONTH[t] };
  });
  const total = bars.reduce((a, b) => a + b.cost, 0);
  const without = MONTHS * GB * PER_GB_MONTH.std;
  const max = GB * PER_GB_MONTH.std;
  return (
    <StepLayout
      eyebrow="Simulation · 5 TB of scans over two years"
      title="Let files cool down"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={s.lifecycle}
              onChange={(e) => set({ lifecycle: e.target.checked })}
              className="accent-accent"
            />
            Add a lifecycle rule: Infrequent after 30 days, Glacier Instant after 90, Deep Archive
            after a year
          </label>
          <div className="flex h-40 items-end gap-0.5">
            {bars.map((b) => (
              <motion.div
                key={b.m}
                title={`Month ${b.m + 1}: ${TIER_LABEL[b.t]}, ${usd(b.cost)}`}
                animate={{ height: `${Math.max((b.cost / max) * 100, 2)}%` }}
                className={cn(
                  "flex-1 rounded-t-sm",
                  b.t === "std"
                    ? "bg-accent"
                    : b.t === "ia"
                      ? "bg-accent/70"
                      : b.t === "gir"
                        ? "bg-accent/45"
                        : "bg-accent/25",
                )}
              />
            ))}
          </div>
          <div className="text-muted flex justify-between text-[10px]">
            <span>Month 1</span>
            <span>Month 12</span>
            <span>Month 24</span>
          </div>
          <div className="flex flex-wrap gap-3 text-[10px]">
            {(["std", "ia", "gir", "deep"] as const).map((t) => (
              <span key={t} className="flex items-center gap-1">
                <span
                  className={cn(
                    "size-2.5 rounded-sm",
                    t === "std"
                      ? "bg-accent"
                      : t === "ia"
                        ? "bg-accent/70"
                        : t === "gir"
                          ? "bg-accent/45"
                          : "bg-accent/25",
                  )}
                />
                {TIER_LABEL[t]}
              </span>
            ))}
          </div>
          <p className="text-sm">
            Two years: <span className="font-mono font-semibold">{usd(total)}</span>
            {s.lifecycle && (
              <span className="text-good">
                {" "}
                instead of {usd(without)} (−{Math.round((1 - total / without) * 100)}%)
              </span>
            )}
          </p>
        </div>
      }
    >
      <p>
        Most files are hot when new and cold soon after. A{" "}
        <Term id="lifecycle-rule">lifecycle rule</Term> moves them to colder classes automatically
        as they age, and can delete them when they&apos;re no longer needed. Turn it on.
      </p>
      <p>
        Two catches: reading cold data costs extra, and since 2024 S3 doesn&apos;t move objects
        smaller than 128 KB by default. If you can&apos;t predict access, S3 Intelligent-Tiering (or
        Azure&apos;s smart tier) moves objects for you for a small monitoring fee. Google&apos;s
        coldest class still reads in milliseconds; AWS Deep Archive and Azure Archive need hours to
        restore.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Run the database, or rent it? ⭐ ------------------------------------------------------------- */

const TASKS: [string, boolean][] = [
  ["Install and patch the operating system", true],
  ["Apply minor engine patches", true],
  ["Take daily backups, kept up to 35 days", true],
  ["Restore to any second (point-in-time)", true],
  ["Fail over to a standby in another zone", true],
  ["Design tables and indexes", false],
  ["Plan major version upgrades", false],
  ["Tune slow queries", false],
  ["Decide who can connect, and encryption", false],
];

export function ManagedDb() {
  const [s, set] = useSceneState<StorageState>();
  const gb = 100;
  const inst = HOURS * (s.multiAz ? RDS.multi : RDS.single);
  const storage = gb * (s.multiAz ? RDS.storageMulti : RDS.storageSingle);
  const ext = s.oldVersion ? HOURS * RDS.extended * RDS.vcpus : 0;
  const total = inst + storage + ext;
  const rows: [string, number][] = [
    [s.multiAz ? "Server + standby (db.t4g.medium)" : "Server (db.t4g.medium)", inst],
    [`Storage, ${gb} GB`, storage],
    ...(s.oldVersion ? ([["Extended Support for an old version", ext]] as [string, number][]) : []),
  ];
  return (
    <StepLayout
      eyebrow="Explore · Amazon RDS Mumbai prices"
      title="Run the database, or rent it?"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => set({ managed: false })}
                className={cn(
                  "flex-1 rounded-full border px-2 py-1",
                  !s.managed ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                On your own VM
              </button>
              <button
                type="button"
                onClick={() => set({ managed: true })}
                className={cn(
                  "flex-1 rounded-full border px-2 py-1",
                  s.managed ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                Managed database
              </button>
            </div>
            {TASKS.map(([t, cloud]) => {
              const yours = !s.managed || !cloud;
              return (
                <motion.div
                  key={t}
                  layout
                  className={cn(
                    "flex items-center gap-2 rounded-md border px-2 py-1 text-xs",
                    yours ? "border-line bg-surface" : "border-good/40 bg-good/10",
                  )}
                >
                  {yours ? (
                    <X className="text-muted size-3.5 shrink-0" />
                  ) : (
                    <Check className="text-good size-3.5 shrink-0" />
                  )}
                  <span className="flex-1">{t}</span>
                  <span className="text-muted text-[10px]">{yours ? "you" : "the cloud"}</span>
                </motion.div>
              );
            })}
          </div>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={s.multiAz}
                onChange={(e) => set({ multiAz: e.target.checked })}
                className="accent-accent"
              />
              Standby in a second zone (Multi-AZ)
            </label>
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={s.oldVersion}
                onChange={(e) => set({ oldVersion: e.target.checked })}
                className="accent-accent"
              />
              Stay on a version past end of standard support
            </label>
            <div className="border-line bg-surface flex flex-col gap-1 rounded-lg border px-3 py-2 text-xs">
              {rows.map(([n, v]) => (
                <div
                  key={n}
                  className={cn("flex justify-between", n.startsWith("Extended") && "text-bad")}
                >
                  <span>{n}</span>
                  <span className="font-mono">{usd(v)}</span>
                </div>
              ))}
              <div className="border-line mt-1 flex justify-between border-t pt-1 font-semibold">
                <span>Per month</span>
                <span className="font-mono">
                  {usd(total)} <span className="text-muted font-normal">≈ {inr(total)}</span>
                </span>
              </div>
            </div>
            <p className="text-muted text-[10px]">
              Multi-AZ doubles the price for a standby that takes over automatically. Extended
              Support costs $0.114 per vCPU-hour in years 1–2 (double in year 3): more than the
              server itself.
            </p>
          </div>
        </div>
      }
    >
      <p>
        You can install a database on a VM yourself, or use a{" "}
        <Term id="managed-database">managed database</Term>: Amazon RDS and Aurora, Azure Database
        for PostgreSQL and Azure SQL, Google Cloud SQL, AlloyDB and Spanner. Toggle to see who does
        the work.
      </p>
      <p>
        The work you hand over is the work people forget. In January 2017 GitLab deleted its
        production database by mistake and found its backups weren&apos;t working; it lost about six
        hours of data. Managed services take backups automatically (still practise restoring them)
        and patch for you, but major upgrades are yours: MySQL 8.0 and PostgreSQL 13 reached end of
        standard support on RDS in 2026.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which storage? ---------------------------------------------------------------------------- */

export function WhichStorage() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which storage?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-storage"
            prompt="Pick the kind of storage for each."
            categories={[
              { id: "object", label: "Object" },
              { id: "block", label: "Block" },
              { id: "file", label: "File" },
            ]}
            items={[
              {
                id: "photos",
                label: "Millions of citizen-uploaded photos served on a website",
                category: "object",
                why: "Huge scale, read over the web, cheapest per GB.",
              },
              {
                id: "vmdisk",
                label: "The boot disk of a virtual machine",
                category: "block",
                why: "A server's own disk.",
              },
              {
                id: "pg",
                label: "Data files of a PostgreSQL server you run yourself",
                category: "block",
                why: "Databases need a fast attached disk.",
              },
              {
                id: "team",
                label: "A folder many Windows desktops map as drive S:",
                category: "file",
                why: "A shared file system (Azure Files, FSx for Windows).",
              },
              {
                id: "logs",
                label: "Audit logs that must be kept 180 days for CERT-In",
                category: "object",
                why: "Cheap, durable and lifecycle rules can expire them after the retention period.",
              },
              {
                id: "render",
                label: "Images that a pool of servers all read and write at once",
                category: "file",
                why: "Many servers sharing one file system (EFS, Filestore).",
              },
            ]}
            explanation="Object for scale and the web, block for one server's disk, file for sharing."
          />
        </div>
      }
    >
      <p>Six pieces of data, three kinds of storage.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Three kinds", "Object (warehouse), block (drawer), file (cupboard)."],
  ["Cold is cheap to keep", "Lifecycle rules move ageing data down; reads cost more."],
  ["Hand over the chores", "Managed databases patch, back up and fail over."],
  ["Lock it down", "Public buckets still leak data: India's marine portal in 2023."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        In 2023 public storage buckets on India&apos;s National Logistics Portal-Marine exposed
        seafarers&apos; passport details until CERT-In got them fixed: module 12&apos;s guardrails
        exist for exactly this. Next: keeping all this running when a zone or a region fails.
      </p>
    </StepLayout>
  );
}
