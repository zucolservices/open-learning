"use client";

import { AnimatePresence, motion } from "motion/react";
import { File, Folder, FolderPlus, KeyRound } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { cn } from "@/lib/cn";
import { BUCKET, LIST_PAGE, PRICE, bucketObjects, formatBytes, listObjects } from "./data";
import type { StorageState } from "./state";
import { Term } from "@/toolkit/glossary/term";

/* 1 ─ The folders that aren't ------------------------------------------- */

interface TreeNode {
  name: string;
  children: Map<string, TreeNode>;
  size?: number;
}

function buildTree(keys: { key: string; size: number }[]): TreeNode {
  const root: TreeNode = { name: "", children: new Map() };
  for (const { key, size } of keys) {
    const parts = key.split("/");
    let node = root;
    parts.forEach((part, i) => {
      if (part === "") return; // trailing "/" of a folder marker
      const leaf = i === parts.length - 1;
      if (!node.children.has(part))
        node.children.set(part, { name: part, children: new Map(), size: leaf ? size : undefined });
      node = node.children.get(part)!;
    });
  }
  return root;
}

function Tree({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  return (
    <ul className={cn(depth > 0 && "border-line ml-3 border-l pl-3")}>
      {[...node.children.values()].map((child) => {
        const isFolder = child.size === undefined;
        return (
          <li key={child.name}>
            <motion.div layout className="flex items-center gap-2 py-0.5 text-sm">
              {isFolder ? (
                <Folder className="text-viz-compute size-4" />
              ) : (
                <File className="text-viz-data size-4" />
              )}
              <span className={isFolder ? "font-medium" : ""}>{child.name}</span>
              {!isFolder && (
                <span className="text-subtle ml-auto font-mono text-[11px]">
                  {formatBytes(child.size!)}
                </span>
              )}
            </motion.div>
            {isFolder && <Tree node={child} depth={depth + 1} />}
          </li>
        );
      })}
    </ul>
  );
}

export function FoldersThatArent() {
  const [s, set] = useSceneState<StorageState>();
  const objects = bucketObjects(s.folderCreated);

  return (
    <StepLayout
      eyebrow="Look closer"
      title="The folders that aren't there"
      stage={
        <div className="flex flex-1 flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <Segmented
              size="sm"
              value={s.view}
              options={[
                ["console", "Console view"],
                ["raw", "What S3 actually stores"],
              ]}
              onChange={(view) => set({ view })}
            />
            <button
              type="button"
              disabled={s.folderCreated}
              onClick={() => set({ folderCreated: true })}
              className="border-line-strong hover:bg-surface-2 inline-flex h-8 items-center gap-2 rounded-full border px-3 text-xs transition disabled:opacity-40"
            >
              <FolderPlus className="size-3.5" /> Create folder &ldquo;reports&rdquo;
            </button>
          </div>

          <div className="border-line bg-bg/40 flex-1 rounded-2xl border p-4">
            <p className="text-muted mb-3 font-mono text-xs">s3://{BUCKET}</p>
            <AnimatePresence mode="wait">
              {s.view === "console" ? (
                <motion.div
                  key="console"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Tree node={buildTree(objects)} />
                </motion.div>
              ) : (
                <motion.ul
                  key="raw"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-1.5"
                >
                  {objects.map((o, i) => (
                    <motion.li
                      key={o.key}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-1.5 font-mono text-xs",
                        o.size === 0
                          ? "bg-viz-compute/10 ring-viz-compute/40 ring-1"
                          : "bg-surface-2/60",
                      )}
                    >
                      <KeyRound className="text-subtle size-3.5 shrink-0" />
                      <span className="min-w-0 flex-1 truncate">
                        {o.key.split("/").map((part, j, arr) => (
                          <span key={j}>
                            <span className={j < arr.length - 1 ? "text-viz-compute" : "text-fg"}>
                              {part}
                            </span>
                            {j < arr.length - 1 && <span className="text-subtle">/</span>}
                          </span>
                        ))}
                      </span>
                      <span className="text-subtle">{formatBytes(o.size)}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
          <p className="text-muted text-xs">
            {s.view === "console"
              ? "Looks like a file system: folders inside folders."
              : `${objects.length} keys, each a plain string. No folders, no hierarchy. The "/" is just a character.`}
            {s.folderCreated &&
              s.view === "raw" &&
              " The new “folder” is a zero-byte object whose key ends in “/”."}
          </p>
        </div>
      }
    >
      <p>
        This is Brewline&apos;s lake in Amazon S3. The console shows folders like{" "}
        <code>sales/2026/09/</code>. Switch to what S3 actually stores.
      </p>
      <p>
        Object storage is a giant{" "}
        <Term id="key-prefix">
          <strong>key → bytes</strong>
        </Term>{" "}
        map. A key like <code>sales/2026/09/part-0000.parquet</code> is one string. The
        &ldquo;folders&rdquo; are an illusion the console draws by splitting keys on <code>/</code>.
      </p>
      <p>Now create a folder in the console and see what really gets stored.</p>
    </StepLayout>
  );
}

/* 2 ─ Listing by prefix --------------------------------------------------- */

const PREFIXES = ["", "sales/", "sales/2026/", "events/"];
const SCALES = [1_000, 50_000, 1_000_000, 10_000_000, 100_000_000];

export function ListByPrefix() {
  const [s, set] = useSceneState<StorageState>();
  const { contents, commonPrefixes } = listObjects(
    bucketObjects(s.folderCreated),
    s.prefix,
    s.delimiter,
  );
  const n = SCALES[s.listScale];
  const calls = Math.ceil(n / LIST_PAGE);

  return (
    <StepLayout
      eyebrow="Explore"
      title="Listing is a search by prefix"
      stage={
        <div className="flex flex-1 flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-1">
              {PREFIXES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => set({ prefix: p })}
                  className={cn(
                    "h-8 rounded-full border px-3 font-mono text-xs transition-colors",
                    s.prefix === p
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-line-strong text-muted hover:text-fg",
                  )}
                >
                  {p === "" ? '""' : p}
                </button>
              ))}
            </div>
            <Segmented
              size="sm"
              value={s.delimiter ? "slash" : "none"}
              options={[
                ["slash", 'Delimiter "/"'],
                ["none", "No delimiter"],
              ]}
              onChange={(v) => set({ delimiter: v === "slash" })}
            />
          </div>

          <pre className="bg-surface-2/60 overflow-x-auto rounded-xl px-4 py-2.5 font-mono text-xs">
            <span className="text-viz-meta">ListObjectsV2</span>(Bucket=&quot;{BUCKET}&quot;,
            Prefix=&quot;{s.prefix}&quot;
            {s.delimiter ? ', Delimiter="/"' : ""})
          </pre>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-2xl border p-3">
              <p className="text-muted mb-2 text-xs">
                Contents <span className="text-subtle">(objects)</span>
              </p>
              <ul className="grid gap-1 font-mono text-[11px]">
                <AnimatePresence initial={false}>
                  {contents.map((o) => (
                    <motion.li
                      key={o.key}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-viz-data/10 truncate rounded px-2 py-1"
                    >
                      {o.key}
                    </motion.li>
                  ))}
                </AnimatePresence>
                {contents.length === 0 && <li className="text-subtle px-2 py-1">none</li>}
              </ul>
            </div>
            <div className="border-line bg-surface rounded-2xl border p-3">
              <p className="text-muted mb-2 text-xs">
                CommonPrefixes{" "}
                <span className="text-subtle">(what the console draws as folders)</span>
              </p>
              <ul className="grid gap-1 font-mono text-[11px]">
                <AnimatePresence initial={false}>
                  {commonPrefixes.map((p) => (
                    <motion.li
                      key={p}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-viz-compute/10 rounded px-2 py-1"
                    >
                      {p}
                    </motion.li>
                  ))}
                </AnimatePresence>
                {commonPrefixes.length === 0 && <li className="text-subtle px-2 py-1">none</li>}
              </ul>
            </div>
          </div>

          <div className="border-line bg-surface rounded-2xl border p-4">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-muted">Objects under a prefix at scale:</span>
              <input
                type="range"
                min={0}
                max={SCALES.length - 1}
                value={s.listScale}
                onChange={(e) => set({ listScale: Number(e.target.value) })}
                aria-label="Number of objects"
                className="min-w-32 flex-1 accent-[var(--viz-meta)]"
              />
              <span className="font-mono tabular-nums">{n.toLocaleString("en-IN")}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-muted text-xs">LIST requests (1,000 keys per page)</p>
                <p className="text-2xl font-semibold tabular-nums">
                  {calls.toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p className="text-muted text-xs">Request cost, just to list once</p>
                <p className="text-2xl font-semibold tabular-nums">
                  ${((calls / 1000) * PRICE.putPer1000).toFixed(calls < 1000 ? 4 : 2)}
                </p>
              </div>
            </div>
            <p className="text-subtle mt-2 text-[11px]">
              Pages come one after another: each response carries the token for the next. S3
              Standard LIST price, us-east-1.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Asking &ldquo;what&apos;s in this folder?&rdquo; really means{" "}
        <strong>list every key that starts with this prefix</strong>.
      </p>
      <p>
        With the <code>/</code> delimiter, S3 groups deeper keys into{" "}
        <strong>CommonPrefixes</strong>. That grouping is where the console&apos;s folders come
        from.
      </p>
      <p>
        Now slide the scale. Lakes hold millions of objects, and listing them is slow and costs
        money. That&apos;s one reason modern table formats keep their own list of files instead of
        listing storage.
      </p>
    </StepLayout>
  );
}
