"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, BookUser, Database, GitCommitVertical, RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { CatalogState } from "./state";

/* 1 ─ A contact list for tables --------------------------------------------------------------- */

const CONSUMERS = ["Finance dashboard", "Nightly ETL job", "Data science notebook"];
const OLD_PATH = "s3://brewline-old/orders/";
const NEW_PATH = "s3://brewline-lake/sales/orders/";

export function ContactList() {
  const [s, set] = useSceneState<CatalogState>();
  const broken = !s.withCatalog && s.moved;
  return (
    <StepLayout
      eyebrow="The big idea first"
      title="A contact list for tables"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Segmented
              size="sm"
              value={s.withCatalog ? "catalog" : "paths"}
              options={[
                ["paths", "Everyone keeps the storage path"],
                ["catalog", "Everyone asks a catalog"],
              ]}
              onChange={(v) => set({ withCatalog: v === "catalog" })}
            />
            <button
              type="button"
              onClick={() => set({ moved: !s.moved })}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
                s.moved ? "bg-surface-2 text-muted" : "bg-accent text-accent-fg",
              )}
            >
              {s.moved ? <RotateCcw className="size-3.5" /> : <ArrowRight className="size-3.5" />}
              {s.moved ? "Undo the move" : "Move the table to a new bucket"}
            </button>
          </div>

          <div className="grid items-center gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
            <ul className="grid gap-2">
              {CONSUMERS.map((c) => (
                <motion.li
                  key={c}
                  animate={{ x: broken ? [0, -3, 3, 0] : 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-sm",
                    broken ? "border-bad/50 bg-bad/10" : "border-good/40 bg-good/10",
                  )}
                >
                  {c}
                  <span className="text-muted block font-mono text-[10px]">
                    {s.withCatalog ? "reads sales.orders" : `reads ${OLD_PATH}`}
                  </span>
                  {broken && <span className="text-bad block text-[10px]">✗ path not found</span>}
                </motion.li>
              ))}
            </ul>

            <AnimatePresence mode="wait">
              {s.withCatalog ? (
                <motion.div
                  key="catalog"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-accent bg-accent-soft rounded-2xl border px-4 py-3 text-center"
                >
                  <BookUser className="text-accent mx-auto size-6" />
                  <p className="mt-1 text-sm font-semibold">Catalog</p>
                  <p className="font-mono text-[10px]">sales.orders →</p>
                  <motion.p
                    key={String(s.moved)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-muted font-mono text-[10px]"
                  >
                    {s.moved ? NEW_PATH : OLD_PATH}
                  </motion.p>
                </motion.div>
              ) : (
                <motion.div
                  key="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ArrowRight className="text-subtle size-6" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="border-line bg-bg/40 rounded-2xl border p-3">
              <p className="text-muted flex items-center gap-1.5 text-xs">
                <Database className="size-3.5" /> Object storage
              </p>
              <p className="mt-1 font-mono text-[11px]">{s.moved ? NEW_PATH : OLD_PATH}</p>
              <p className="text-subtle font-mono text-[10px]">
                <GitCommitVertical className="inline size-3" /> metadata + Parquet files
              </p>
            </div>
          </div>

          <p
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              broken ? "border-bad/40 bg-bad/10" : "border-line bg-surface",
            )}
          >
            {broken
              ? "The table moved and every consumer broke: each one had the old path hard-coded. Someone now has to find and fix all of them, and hope they found them all."
              : s.withCatalog && s.moved
                ? "The table moved, and one entry in the catalog changed. Every consumer still asks for sales.orders and gets the new location."
                : s.withCatalog
                  ? "Consumers ask for a name. The catalog answers with where the table lives and which version is current. Try moving it."
                  : "Each consumer knows the table only by its storage path. Try moving the table."}
          </p>
        </div>
      }
    >
      <p>
        You don&apos;t memorise your friends&apos; phone numbers. You look them up by name, and when
        someone changes number, you update one contact.
      </p>
      <p>
        A <Term id="catalog">catalog</Term> is the lakehouse&apos;s contact list. Engines ask it for
        a table by name, like <code>sales.orders</code>, and it answers: here&apos;s where the table
        lives, here&apos;s its current version, and here&apos;s whether you&apos;re allowed in.
      </p>
      <p>Switch between the two worlds and move the table.</p>
    </StepLayout>
  );
}
