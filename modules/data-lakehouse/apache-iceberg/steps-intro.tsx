"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Segmented } from "@/toolkit/controls/segmented";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ALL_FILES, MANIFESTS, QUERIES, type QueryId } from "./data";
import { IcebergQueryTree, IcebergTree, queryReach } from "./tree-scene";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import type { IcebergState } from "./state";

/* 1 ─ A diary or a tree? ------------------------------------------------------ */

const DIARY = [
  { v: "00000.json", text: "add f1, f2" },
  { v: "00001.json", text: "add f3" },
  { v: "00002.json", text: "remove f1 · add f4" },
  { v: "00003.json", text: "add f5" },
];

const LIBRARY: { everyday: string; iceberg: string; note: string; tone: string }[] = [
  {
    everyday: "Card at the front desk",
    iceberg: "Catalog pointer",
    note: "“The current guide is edition 3”",
    tone: "border-accent/60 bg-accent-soft",
  },
  {
    everyday: "The library guide",
    iceberg: "Metadata file",
    note: "rules, layout, and every past edition",
    tone: "border-viz-meta/50 bg-viz-meta/10",
  },
  {
    everyday: "List of sections",
    iceberg: "Manifest list",
    note: "which shelf lists, and what each covers",
    tone: "border-viz-meta/50 bg-viz-meta/10",
  },
  {
    everyday: "Shelf lists",
    iceberg: "Manifests",
    note: "every book on the shelf, with a summary",
    tone: "border-viz-meta/50 bg-viz-meta/10",
  },
  {
    everyday: "Books",
    iceberg: "Data files (Parquet)",
    note: "where the rows actually live",
    tone: "border-viz-data/50 bg-viz-data/15",
  },
];

export function DiaryOrTree() {
  const [s, set] = useSceneState<IcebergState>();
  return (
    <StepLayout
      eyebrow="The big idea first"
      title="A diary, or a tree?"
      stage={
        <div className="flex flex-1 flex-col gap-5">
          <Segmented
            size="sm"
            value={s.view}
            options={[
              ["delta", "Delta Lake: a diary"],
              ["iceberg", "Iceberg: a tree"],
            ]}
            onChange={(v) => set({ view: v as IcebergState["view"] })}
          />
          <AnimatePresence mode="wait">
            {s.view === "delta" ? (
              <motion.div
                key="delta"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid gap-2"
              >
                {DIARY.map((line, i) => (
                  <motion.div
                    key={line.v}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 * i }}
                    className="border-viz-meta/40 bg-viz-meta/10 flex items-center gap-3 rounded-xl border px-4 py-2.5 font-mono text-xs"
                  >
                    <span className="text-viz-meta w-24 shrink-0">{line.v}</span>
                    <span className="text-fg">{line.text}</span>
                  </motion.div>
                ))}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="border-line bg-surface mt-2 rounded-xl border px-4 py-3 text-sm"
                >
                  <span className="text-muted">Replay every line in order → </span>
                  <span className="font-mono text-xs">table = f2, f3, f4, f5</span>
                </motion.p>
              </motion.div>
            ) : (
              <motion.ol
                key="iceberg"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid gap-1"
              >
                {LIBRARY.map((row, i) => (
                  <motion.li
                    key={row.iceberg}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    {i > 0 && <ArrowDown className="text-subtle mx-auto mb-1 size-3.5" />}
                    <div
                      className={cn(
                        "grid items-center gap-x-4 gap-y-0.5 rounded-xl border px-4 py-2.5 sm:grid-cols-[10rem_minmax(0,1fr)]",
                        row.tone,
                      )}
                    >
                      <p className="text-muted text-xs">{row.everyday}</p>
                      <p className="text-sm">
                        <span className="font-semibold">{row.iceberg}</span>{" "}
                        <span className="text-muted text-xs">· {row.note}</span>
                      </p>
                    </div>
                  </motion.li>
                ))}
              </motion.ol>
            )}
          </AnimatePresence>
          <p className="text-subtle mt-auto text-xs">
            Both answer the same question from the last module: which files make up the table right
            now?
          </p>
        </div>
      }
    >
      <p>
        In the last module, <Term id="delta-lake">Delta Lake</Term> kept a diary: a log of every
        change, replayed in order to find the table.
      </p>
      <p>
        <Term id="iceberg">Apache Iceberg</Term>, created at Netflix, works more like a library. A
        card at the front desk names the current guide. The guide lists the sections, each section
        lists its shelves, and each shelf list summarises its books.
      </p>
      <p>
        To find a book you never search every shelf. You go top-down, and skip every section that
        can&apos;t contain it. Flip the switch to compare.
      </p>
      <p className="text-subtle text-xs">
        Like Delta, Iceberg isn&apos;t a server or a database. It&apos;s a specification for
        metadata files that sit next to ordinary Parquet files, so many engines can share one table.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The tree in 3D ⭐ --------------------------------------------------------- */

const SECTIONS: StorySection[] = [
  {
    id: "catalog",
    kicker: "Catalog",
    title: "It starts with one pointer",
    body: (
      <>
        <p>
          This is Brewline&apos;s <code>orders</code> table, partitioned by day. At the top sits the{" "}
          <Term id="catalog">catalog</Term>: a service such as a REST catalog, AWS Glue or a Hive
          Metastore.
        </p>
        <p>
          For each table, the catalog stores just one thing that matters here: the location of the
          table&apos;s <strong>current metadata file</strong>. Every reader starts by asking for it.
        </p>
      </>
    ),
  },
  {
    id: "metadata",
    kicker: "Metadata file",
    title: "The metadata file: the table's guide",
    body: (
      <>
        <p>
          A JSON <Term id="iceberg-metadata-file">metadata file</Term> describes the whole table:
          its schema, how it&apos;s partitioned, and a list of <Term id="snapshot">snapshots</Term>,
          one per commit. It also says which snapshot is current.
        </p>
        <p>
          Metadata files are never edited. Each commit writes a new one, so older versions (faded on
          the left) stay behind. That&apos;s how history is kept.
        </p>
      </>
    ),
  },
  {
    id: "manifest-list",
    kicker: "Manifest list",
    title: "One manifest list per snapshot",
    body: (
      <>
        <p>
          Each snapshot points to a <Term id="manifest-list">manifest list</Term>: an Avro file
          naming the manifests that make up that version of the table.
        </p>
        <p>
          Crucially, next to each manifest it records a <strong>summary of partition values</strong>
          , here which days the manifest covers. A query can skip a whole manifest without opening
          it.
        </p>
      </>
    ),
  },
  {
    id: "manifests",
    kicker: "Manifests",
    title: "Manifests list the actual files",
    body: (
      <>
        <p>
          A <Term id="manifest">manifest</Term> is another Avro file. It has one entry per data
          file: its path, its partition, its row count and size, and{" "}
          <Term id="statistics">statistics</Term> for each column such as min and max.
        </p>
        <p>
          It&apos;s like the Parquet footer from module 4, one level up: stats per file instead of
          per row group.
        </p>
      </>
    ),
  },
  {
    id: "data",
    kicker: "Data files",
    title: "Finally, the data",
    body: (
      <>
        <p>
          At the bottom are ordinary Parquet files (ORC and Avro are allowed too). They&apos;re the
          only place rows live, and they&apos;re never changed once written.
        </p>
        <p>
          Every file path comes from a manifest. Iceberg never lists folders, which avoids the slow,
          inconsistent listings you met in modules 2 and 5.
        </p>
      </>
    ),
  },
  {
    id: "whole",
    kicker: "Whole tree",
    title: "Read top-down, write bottom-up",
    body: (
      <>
        <p>
          <strong>Reading</strong> is walking down: pointer → metadata file → manifest list →
          manifests → data files, skipping branches along the way.
        </p>
        <p>
          <strong>Writing</strong> is the reverse: new data files first, then the metadata above
          them, and finally a swap of the pointer at the top. You&apos;ll try both next.
        </p>
      </>
    ),
  },
];

export function TreeStory() {
  return (
    <ScrollStory
      persistent
      sections={SECTIONS}
      renderScene={(i) => <IcebergTree stage={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">3D scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Climb down the metadata tree
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            Five levels, from one pointer at the top to the Parquet files at the bottom. Scroll
            slowly and watch the 3D view.
          </p>
        </div>
      }
    />
  );
}

/* 3 ─ Follow a query ⭐ -------------------------------------------------------- */

const QUERY_FRAMES = [
  "The query arrives",
  "Catalog → metadata file",
  "Manifest list",
  "Manifests",
  "Read data files",
];

export function FollowQuery() {
  const [s, set] = useSceneState<IcebergState>();
  const q = QUERIES[s.query];
  const step = Math.min(s.queryStep, QUERY_FRAMES.length - 1);
  const { keptManifests, keptFiles } = queryReach(s.query, 4);
  const manifestsOpened = step >= 3 ? keptManifests.size : 0;
  const filesRead = step >= 4 ? keptFiles.size : 0;

  const caption: Record<number, React.ReactNode> = {
    0: <Code className="whitespace-pre-wrap">{q.sql}</Code>,
    1: (
      <p>
        Ask the catalog for <code>orders</code>, read the current metadata file, and find snapshot
        S3 and its manifest list. Two small reads so far.
      </p>
    ),
    2: <p>{q.manifestWhy}</p>,
    3: <p>{q.fileWhy}</p>,
    4: (
      <p>
        Read {keptFiles.size} of {ALL_FILES.length} data files. Inside each one, Parquet&apos;s
        footer can still skip row groups (module 4). Not a single folder was listed.
      </p>
    ),
  };

  return (
    <StepLayout
      eyebrow="Try it"
      title="Follow a query down the tree"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.query}
            options={Object.values(QUERIES).map((x) => [x.id, x.label] as [string, string])}
            onChange={(v) => set({ query: v as QueryId, queryStep: 0 })}
          />
          <div className="border-line bg-bg/40 relative h-80 overflow-hidden rounded-2xl border sm:h-[26rem]">
            <IcebergQueryTree query={s.query} step={step} />
          </div>
          <Stepper
            step={step}
            count={QUERY_FRAMES.length}
            onChange={(n) => set({ queryStep: n })}
            label={
              <span className="flex gap-3 font-mono">
                <span>
                  manifests opened{" "}
                  <strong className="text-fg">
                    {step >= 3 ? manifestsOpened : "–"}/{MANIFESTS.length}
                  </strong>
                </span>
                <span>
                  files read{" "}
                  <strong className="text-viz-compute">
                    {step >= 4 ? filesRead : "–"}/{ALL_FILES.length}
                  </strong>
                </span>
              </span>
            }
          />
          <FrameCaption frameKey={`${s.query}-${step}`} title={QUERY_FRAMES[step]}>
            {caption[step]}
          </FrameCaption>
        </div>
      }
    >
      <p>Pick a query, then step down the tree. Watch which branches the engine never touches.</p>
      <p>
        Two levels do the skipping. The <Term id="manifest-list">manifest list</Term> skips whole
        manifests using <Term id="partition">partition</Term> summaries. Then each{" "}
        <Term id="manifest">manifest</Term> skips individual files using column stats.
      </p>
      <p className="text-subtle text-xs">
        Try all three queries. The last one shows the honest limit: metadata can&apos;t make a query
        that needs everything read less.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Checkpoint: the read path ------------------------------------------------ */

export function ReadPathCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Put the read path in order"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="read-path"
            prompt="A query arrives for an Iceberg table. In what order does the engine read things?"
            items={[
              { id: "catalog", label: "Ask the catalog for the current metadata file" },
              { id: "meta", label: "Read the metadata file and find the current snapshot" },
              { id: "mlist", label: "Read the snapshot's manifest list; skip manifests" },
              { id: "manifests", label: "Read the remaining manifests; skip data files" },
              { id: "data", label: "Read the remaining Parquet data files" },
            ]}
            explanation="Top-down, and every level narrows the next. The engine never lists a folder: every path it reads comes from the level above."
          />
        </div>
      }
    >
      <p>Drag the steps into the order an engine follows.</p>
    </StepLayout>
  );
}
