"use client";

import { AnimatePresence, motion } from "motion/react";
import { BookUser, Play, RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ENGINE_CONFIG } from "./data";
import type { CatalogState } from "./state";

/* 2 ─ Three engines, one catalog ⭐ ------------------------------------------------------------ */

const BASE = 7;
const MAX_COMMITS = 3;

type Reader = "trino" | "duckdb";

export function ThreeEngines() {
  const [s, set] = useSceneState<CatalogState>();
  const current = BASE + s.commits;
  const seen = (r: Reader) => (s[r] === "catalog" ? current : BASE);

  const engine = (
    id: "spark" | Reader,
    name: string,
    role: string,
    conn: "catalog" | "path",
    onConn?: (v: "catalog" | "path") => void,
  ) => {
    const v = id === "spark" ? current : seen(id);
    const stale = v < current;
    return (
      <div
        className={cn(
          "flex flex-col gap-2 rounded-2xl border p-3 transition-colors",
          stale ? "border-bad/50 bg-bad/10" : "border-good/40 bg-good/5",
        )}
      >
        <div className="flex items-baseline justify-between gap-2">
          <p className="font-semibold">{name}</p>
          <span className="text-muted text-[10px]">{role}</span>
        </div>
        {onConn ? (
          <Segmented
            size="sm"
            value={conn}
            options={[
              ["path", id === "trino" ? "Own metastore" : "Pinned file"],
              ["catalog", "Shared catalog"],
            ]}
            onChange={(val) => onConn(val as "catalog" | "path")}
          />
        ) : (
          <p className="text-muted text-[11px]">Connected to the shared catalog</p>
        )}
        <Code className="text-[9px] whitespace-pre-wrap">
          {conn === "catalog" ? ENGINE_CONFIG[id].catalog : ENGINE_CONFIG[id].path}
        </Code>
        <motion.p
          key={`${id}-${v}-${conn}`}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("font-mono text-sm font-semibold", stale ? "text-bad" : "text-good")}
        >
          sees version {v}
          {stale && <span className="text-[10px] font-normal"> (stale: {current - v} behind)</span>}
        </motion.p>
      </div>
    );
  };

  return (
    <StepLayout
      eyebrow="Build and connect"
      title="Three engines, one table"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={s.commits >= MAX_COMMITS}
              onClick={() => set({ commits: s.commits + 1 })}
              className="bg-accent text-accent-fg flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition enabled:hover:brightness-110 disabled:opacity-35"
            >
              <Play className="size-3.5" /> Spark: INSERT new orders
            </button>
            <button
              type="button"
              aria-label="Reset"
              disabled={s.commits === 0}
              onClick={() => set({ commits: 0 })}
              className="bg-surface-2 grid size-9 place-items-center rounded-full disabled:opacity-35"
            >
              <RotateCcw className="size-3.5" />
            </button>
          </div>

          <div className="border-accent/50 bg-accent-soft flex items-center gap-3 rounded-2xl border px-4 py-3">
            <BookUser className="text-accent size-6 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold">Catalog · sales.orders</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={current}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="text-muted truncate font-mono text-[11px]"
                >
                  current → …/metadata/0000{current}-….metadata.json
                </motion.p>
              </AnimatePresence>
            </div>
            <span className="text-muted ml-auto font-mono text-xs">v{current}</span>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {engine("spark", "Spark", "writes", "catalog")}
            {engine("trino", "Trino", "reads", s.trino, (v) => set({ trino: v }))}
            {engine("duckdb", "DuckDB", "reads", s.duckdb, (v) => set({ duckdb: v }))}
          </div>

          <p className="border-line bg-surface text-muted rounded-xl border px-4 py-3 text-sm">
            {s.commits === 0
              ? "Spark is about to commit. Connect the readers however you like, then press INSERT."
              : s.trino === "catalog" && s.duckdb === "catalog"
                ? `Spark's commit moved the catalog pointer to v${current}. Both readers asked the catalog on their next query and got v${current}. Nobody had to tell them.`
                : "A reader pinned to one metadata file, or registered in a different catalog, is frozen at the version it was given. It never learns about new commits, because it never asks the catalog that saw them. Switch it to the shared catalog."}
          </p>
        </div>
      }
    >
      <p>
        Brewline runs three engines on the same <code>orders</code> table: Spark loads data, Trino
        serves dashboards, and an analyst uses DuckDB on a laptop.
      </p>
      <p>
        For them to agree, they must agree on one thing: which metadata file is current. That&apos;s
        exactly what the catalog holds. Commit from Spark a few times, and compare readers pinned to
        a file with readers that ask the <Term id="catalog">catalog</Term>.
      </p>
      <p className="text-subtle text-xs">
        Nothing is pushed to the readers. Each one asks the catalog when it plans its next query.
        Engines may cache the answer: Spark&apos;s Iceberg catalog caches table metadata for up to
        30 seconds by default, so a new version can take that long to appear.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Checkpoint: two catalogs, one table ---------------------------------------------------------- */

export function SplitBrainCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Two catalogs, one table"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="two-catalogs"
            prompt="Team A registers an Iceberg table in their Hive Metastore. Team B registers the same table folder in a separate REST catalog, and both teams write to it. What happens?"
            options={[
              {
                id: "fine",
                label: "It's fine: both catalogs read the same metadata files",
                feedback:
                  "Each catalog keeps its own pointer. A commit through one never moves the other's.",
              },
              {
                id: "split",
                label:
                  "Each catalog tracks its own “current version”, so each team's commits are invisible to the other and history forks",
                correct: true,
                feedback:
                  "Right. Two referees for one game: each accepts its own commits, and the table splits into two diverging histories over the same files.",
              },
              {
                id: "locks",
                label: "The two catalogs lock each other, so writes just get slower",
                feedback:
                  "Catalogs don't know about each other. There's no shared lock, which is exactly the problem.",
              },
              {
                id: "merge",
                label: "The catalogs merge their commits automatically",
                feedback:
                  "Nothing merges them. Keep one catalog as the owner of each table; others can federate or mirror it read-only.",
              },
            ]}
            explanation="Rule of thumb: every table has exactly one catalog that owns its commits. Other catalogs can federate or mirror it read-only."
          />
        </div>
      }
    >
      <p>Remember: the catalog is the referee that decides which version is current.</p>
    </StepLayout>
  );
}
