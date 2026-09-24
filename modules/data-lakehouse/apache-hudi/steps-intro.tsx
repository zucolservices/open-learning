"use client";

import { motion } from "motion/react";
import { ArrowRight, Clock } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FILE_GROUPS, TRIPS, type FgId } from "./data";
import { Rail, type RailInstant } from "./ui";
import type { HudiState } from "./state";

/* 1 ─ Why Uber built Hudi ⭐ ---------------------------------------------------- */

const TRIP_EVENTS = [
  { at: "09:10", what: "Trip requested", detail: "t-102 · Ravi" },
  { at: "09:32", what: "Trip completed", detail: "fare ₹180" },
  { at: "11:05", what: "Fare corrected", detail: "fare ₹210" },
  { at: "next day", what: "Tip added", detail: "fare ₹230" },
];

function SceneTrip() {
  return (
    <div className="flex h-full flex-col justify-center gap-2 px-2">
      {TRIP_EVENTS.map((e, i) => (
        <motion.div
          key={e.at}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 * i }}
          className={cn(
            "flex items-center gap-3 rounded-xl border px-3 py-2",
            i === 0 ? "border-viz-data/50 bg-viz-data/10" : "border-viz-add/50 bg-viz-add/10",
          )}
        >
          <span className="text-muted w-16 shrink-0 font-mono text-[10px]">{e.at}</span>
          <span className="text-sm font-medium">{e.what}</span>
          <span className="text-muted ml-auto font-mono text-[10px]">{e.detail}</span>
        </motion.div>
      ))}
      <p className="text-subtle mt-1 text-center text-[11px]">
        One trip, one row, changed three times after it was first written.
      </p>
    </div>
  );
}

function SceneRewrite() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <p className="text-muted font-mono text-[11px]">trips/date=2016-09-24/</p>
      <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
        {Array.from({ length: 24 }, (_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 1, 1], scale: [1, 1.08, 1] }}
            transition={{ delay: 0.6 + i * 0.04, duration: 0.5 }}
            className={cn(
              "h-8 w-6 rounded border sm:h-10 sm:w-8",
              i === 9
                ? "border-viz-compute bg-viz-compute/40"
                : "border-viz-remove/60 bg-viz-remove/15",
            )}
          />
        ))}
      </div>
      <p className="text-muted text-center text-xs">
        <span className="text-viz-compute">1 file</span> holds the changed row.{" "}
        <span className="text-viz-remove">All 24</span> get rewritten.
      </p>
    </div>
  );
}

function SceneLate() {
  const stages = ["raw trips", "cleaned trips", "driver earnings", "dashboards"];
  return (
    <div className="flex h-full flex-col justify-center gap-2 px-2">
      {stages.map((st, i) => (
        <motion.div
          key={st}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 * i }}
          className="flex items-center gap-2"
        >
          <span className="border-viz-data/50 bg-viz-data/10 flex-1 rounded-lg border px-3 py-2 text-sm">
            {st}
          </span>
          {i > 0 && (
            <span className="text-viz-remove flex w-28 shrink-0 items-center gap-1 text-[10px]">
              <Clock className="size-3" /> full rescan
            </span>
          )}
        </motion.div>
      ))}
      <p className="text-subtle mt-1 text-center text-[11px]">
        Each stage re-reads everything, on a schedule. Changes crawl through for hours.
      </p>
    </div>
  );
}

function SceneUpsert() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <div className="flex items-center gap-2 font-mono text-xs">
        <span className="border-viz-add/60 bg-viz-add/15 rounded-lg border px-2 py-1.5">
          t-102 → ₹210
        </span>
        <ArrowRight className="text-subtle size-4" />
        <span className="border-viz-meta/60 bg-viz-meta/15 rounded-lg border px-2 py-1.5">
          index: t-102 is in file 10
        </span>
      </div>
      <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
        {Array.from({ length: 24 }, (_, i) => (
          <motion.div
            key={i}
            animate={i === 9 ? { scale: [1, 1.15, 1] } : {}}
            transition={{ delay: 0.5, duration: 0.5 }}
            className={cn(
              "h-8 w-6 rounded border sm:h-10 sm:w-8",
              i === 9 ? "border-viz-add bg-viz-add/40" : "border-viz-data/40 bg-viz-data/10",
            )}
          />
        ))}
      </div>
      <p className="text-muted text-center text-xs">
        Upsert: find the one file that holds the row, change only that.
      </p>
    </div>
  );
}

function SceneIncremental() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 px-2">
      <div className="border-viz-compute/50 bg-viz-compute/10 rounded-xl border px-3 py-2 text-sm">
        Downstream job: <em>“What changed since 10:00?”</em>
      </div>
      <div className="flex flex-wrap justify-center gap-1">
        {TRIPS.map((t, i) => {
          const hit = ["t-102", "t-105", "t-107"].includes(t.id);
          return (
            <motion.span
              key={t.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: hit ? 1 : 0.25 }}
              transition={{ delay: 0.05 * i + 0.3 }}
              className={cn(
                "rounded border px-1.5 py-1 font-mono text-[10px]",
                hit ? "border-viz-compute bg-viz-compute/25" : "border-line border-dashed",
              )}
            >
              {t.id}
            </motion.span>
          );
        })}
      </div>
      <p className="text-muted text-center text-xs">
        Just the 3 changed rows, not the whole table. Stages can run every few minutes.
      </p>
    </div>
  );
}

function SceneName() {
  const letters = [
    ["H", "adoop"],
    ["U", "pserts"],
    ["D", "eletes"],
    ["I", "ncrementals"],
  ];
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        {letters.map(([l, rest], i) => (
          <motion.div
            key={l}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * i }}
            className="border-line bg-surface rounded-xl border px-3 py-2 text-center"
          >
            <span className="text-accent text-2xl font-semibold">{l}</span>
            <span className="text-muted text-sm">{rest}</span>
          </motion.div>
        ))}
      </div>
      <ol className="text-muted grid gap-1 font-mono text-[11px]">
        <li>2016 · built at Uber as “Hoodie”</li>
        <li>2017 · open-sourced</li>
        <li>2019 · enters the Apache Incubator</li>
        <li>2020 · Apache top-level project</li>
        <li>2024 · Hudi 1.0</li>
      </ol>
    </div>
  );
}

const STORY_SCENES = [SceneTrip, SceneRewrite, SceneLate, SceneUpsert, SceneIncremental, SceneName];

const SECTIONS: StorySection[] = [
  {
    id: "changing",
    kicker: "The problem",
    title: "Rows that won't sit still",
    body: (
      <>
        <p>
          Picture a ride-hailing company. A trip row is written when the ride ends, but it keeps
          changing: fares get corrected, tips arrive, trips get cancelled or disputed days later.
        </p>
        <p>
          Uber had exactly this problem in 2016, with millions of trips a day landing in a Hadoop
          data lake. Most lake tools of the time assumed data was only ever appended.
        </p>
      </>
    ),
  },
  {
    id: "rewrite",
    kicker: "The old way",
    title: "Change one row, rewrite the partition",
    body: (
      <>
        <p>
          In a Hive-style table, files are never edited. To change one trip, a job had to rewrite
          the entire <Term id="partition">partition</Term> that held it, every file in the folder.
        </p>
        <p>
          With changes scattered across many days, that meant rewriting huge amounts of data just to
          fix a few rows.
        </p>
      </>
    ),
  },
  {
    id: "late",
    kicker: "The cost",
    title: "Fresh data, hours late",
    body: (
      <>
        <p>
          Because rewrites were so expensive, they ran in big scheduled batches. And every table
          downstream had to rescan its whole input to find what changed.
        </p>
        <p>The result: dashboards and pricing models working on data that was hours old.</p>
      </>
    ),
  },
  {
    id: "upserts",
    kicker: "Idea 1",
    title: "Upserts: change only what changed",
    body: (
      <>
        <p>
          Hudi&apos;s first idea: give every row a <strong>key</strong>, and keep an{" "}
          <strong>index</strong> of which file holds which key. An <Term id="upsert">upsert</Term>{" "}
          (update or insert) then touches only the files that hold those keys.
        </p>
      </>
    ),
  },
  {
    id: "incrementals",
    kicker: "Idea 2",
    title: "Incrementals: read only what changed",
    body: (
      <>
        <p>
          The second idea: record every change on a <Term id="hudi-timeline">timeline</Term>, so a
          downstream job can ask for just the records that changed since it last ran.
        </p>
        <p>Each stage processes a trickle of changes instead of the whole table.</p>
      </>
    ),
  },
  {
    id: "name",
    kicker: "Hudi",
    title: "From “Hoodie” to Apache Hudi",
    body: (
      <>
        <p>
          The two ideas are right there in the name. <Term id="hudi">Hudi</Term> became an Apache
          top-level project in 2020 and, like Delta and Iceberg, is an open table format over
          Parquet files.
        </p>
        <p>
          It&apos;s used for streaming and batch alike: anywhere tables change a lot and freshness
          matters, such as copying changes from operational databases.
        </p>
      </>
    ),
  },
];

export function WhyHudi() {
  return (
    <ScrollStory
      sections={SECTIONS}
      renderScene={(i) => {
        const Scene = STORY_SCENES[i];
        return <Scene />;
      }}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">
            The big idea first
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Why Uber built Hudi
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            Delta and Iceberg started from “make a folder of files behave like a table”. Hudi
            started from a different question: what if the rows keep changing? Scroll to find out.
          </p>
        </div>
      }
    />
  );
}

/* 2 ─ The timeline: a kitchen order rail ---------------------------------------- */

interface RailFrame {
  title: string;
  text: string;
  file?: string;
  instants: RailInstant[];
  sees: string;
}

const DONE_10: RailInstant = { time: "10:00", action: "commit", state: "completed" };

const NORMAL: RailFrame[] = [
  {
    title: "The rail so far",
    text: "The table was created at 10:00 with one commit. Completed instants stay on the timeline.",
    instants: [DONE_10],
    sees: "data from 10:00",
  },
  {
    title: "1. A write puts up a ticket: requested",
    text: "A writer wants to upsert a batch of trips. First it adds a requested instant, with its requested time, which also works as the write's ID. Nothing is written yet.",
    file: ".hoodie/timeline/20260924100500000.deltacommit.requested",
    instants: [DONE_10, { time: "10:05", action: "deltacommit", state: "requested" }],
    sees: "data from 10:00",
  },
  {
    title: "2. Cooking: inflight",
    text: "The writer marks the instant inflight and writes its files. Readers can see the files in storage, but ignore them: the instant isn't completed.",
    file: ".hoodie/timeline/20260924100500000.deltacommit.inflight",
    instants: [DONE_10, { time: "10:05", action: "deltacommit", state: "inflight" }],
    sees: "data from 10:00",
  },
  {
    title: "3. Served: completed",
    text: "One small file appears atomically, named with the requested time and the completion time. From this moment, readers include the new data.",
    file: ".hoodie/timeline/20260924100500000_20260924100512345.deltacommit",
    instants: [DONE_10, { time: "10:05", action: "deltacommit", state: "completed" }],
    sees: "data from 10:00 + 10:05",
  },
  {
    title: "4. Services use the same rail",
    text: "Table services record their work as instants too. A clean finished at 10:10; a compaction is scheduled at 10:15 and will show as a commit once it completes.",
    instants: [
      DONE_10,
      { time: "10:05", action: "deltacommit", state: "completed" },
      { time: "10:10", action: "clean", state: "completed" },
      { time: "10:15", action: "compaction", state: "requested" },
    ],
    sees: "data from 10:00 + 10:05",
  },
];

const CRASH: RailFrame[] = [
  ...NORMAL.slice(0, 3),
  {
    title: "3. The writer crashes",
    text: "Half the files are written, then the job dies. The instant stays inflight forever. Readers still ignore it, so nobody sees half a batch.",
    instants: [DONE_10, { time: "10:05", action: "deltacommit", state: "inflight" }],
    sees: "data from 10:00",
  },
  {
    title: "4. Rollback cleans up",
    text: "A rollback instant deletes the partial files and removes the failed attempt from the timeline. The table is exactly as it was, and the batch can simply be retried.",
    instants: [
      DONE_10,
      { time: "10:05", action: "deltacommit", state: "rolledback" },
      { time: "10:06", action: "rollback", state: "completed" },
    ],
    sees: "data from 10:00",
  },
];

export function TimelineRail() {
  const [s, set] = useSceneState<HudiState>();
  const frames = s.crash ? CRASH : NORMAL;
  const step = Math.min(s.railStep, frames.length - 1);
  const f = frames[step];

  return (
    <StepLayout
      eyebrow="The core idea"
      title="The timeline: a kitchen order rail"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.crash ? "crash" : "normal"}
            options={[
              ["normal", "A normal write"],
              ["crash", "A write that crashes"],
            ]}
            onChange={(v) => set({ crash: v === "crash", railStep: 0 })}
          />
          <Rail instants={f.instants} dimIncomplete />
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted text-[11px]">A reader right now sees</p>
              <p className="font-mono text-sm font-semibold">{f.sees}</p>
            </div>
            <ul className="text-muted flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]">
              <li className="flex items-center gap-1">
                <span className="border-viz-meta/60 size-3 rounded border border-dashed" />
                requested
              </li>
              <li className="flex items-center gap-1">
                <span className="border-viz-compute bg-viz-compute/15 size-3 rounded border" />
                inflight
              </li>
              <li className="flex items-center gap-1">
                <span className="border-viz-meta/70 bg-viz-meta/20 size-3 rounded border" />
                completed
              </li>
            </ul>
          </div>
          <Stepper step={step} count={frames.length} onChange={(n) => set({ railStep: n })} />
          <FrameCaption
            frameKey={`${s.crash}-${step}`}
            title={f.title}
            tone={s.crash && step >= 3 ? (step === 4 ? "good" : "bad") : undefined}
          >
            <p>{f.text}</p>
            {f.file && <Code className="mt-2 text-[10px]">{f.file}</Code>}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Think of the order rail in a restaurant kitchen. A ticket goes up (<em>requested</em>), a
        cook works on it (<em>inflight</em>), and the dish is served (<em>completed</em>). Diners
        only ever get served dishes. A dropped plate gets its ticket voided.
      </p>
      <p>
        Hudi&apos;s <Term id="hudi-timeline">timeline</Term> is that rail. Every action on the table
        (a <Term id="commit">commit</Term>, a clean, a compaction) is an{" "}
        <Term id="hudi-instant">instant</Term> that moves through those three states, recorded as
        small files under <code>.hoodie/timeline/</code>.
      </p>
      <p>Step through a normal write, then one that crashes.</p>
      <p className="text-subtle text-xs">
        An instant is really a span of time: from its requested time to its completion time. Hudi
        1.x orders changes by completion time, which keeps concurrent writers and incremental reads
        consistent.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Record keys and file groups ---------------------------------------------- */

const INCOMING = [
  { key: "t-102", change: "fare ₹210", fg: "A" as FgId | null },
  { key: "t-107", change: "fare ₹300", fg: "C" as FgId | null },
  { key: "t-110", change: "new trip ₹185", fg: null },
];

const ROUTE_FRAMES = [
  {
    title: "A batch arrives",
    text: "Two updates to existing trips and one brand-new trip. Each record carries its key: trip_id.",
  },
  {
    title: "1. Look up each key in the index",
    text: "The index maps record keys to file groups. t-102 lives in file group A, t-107 in C. t-110 isn't in the table yet, so it's an insert.",
  },
  {
    title: "2. Route updates to their file groups",
    text: "Each update goes to the one file group that already holds its key. The other file group, B, isn't touched for the updates.",
  },
  {
    title: "3. Place the insert",
    text: "New records go to a file group that still has room (here B, the smallest), or to a brand-new file group. Hudi does this to avoid creating lots of small files.",
  },
  {
    title: "4. Every row remembers where it came from",
    text: "Hudi adds meta columns to every row it writes, including its key and the commit that last changed it. Incremental queries rely on them.",
  },
];

export function KeysAndFileGroups() {
  const [s, set] = useSceneState<HudiState>();
  const step = Math.min(s.routeStep, ROUTE_FRAMES.length - 1);
  const f = ROUTE_FRAMES[step];
  const target = (r: (typeof INCOMING)[number]): FgId | null => r.fg ?? (step >= 3 ? "B" : null);

  return (
    <StepLayout
      eyebrow="Keys"
      title="Every row has a key, every key has a home"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-[11rem_minmax(0,1fr)]">
            <div className="flex flex-col gap-1.5">
              <p className="text-muted text-[11px]">Incoming batch</p>
              {INCOMING.map((r) => {
                const t = target(r);
                const routed = (r.fg && step >= 2) || (!r.fg && step >= 3);
                return (
                  <motion.div
                    key={r.key}
                    animate={{ x: routed ? 6 : 0 }}
                    className={cn(
                      "rounded-lg border px-2 py-1.5 font-mono text-[11px]",
                      r.fg
                        ? "border-viz-add/60 bg-viz-add/10"
                        : "border-viz-data/60 bg-viz-data/10",
                    )}
                  >
                    <span className="font-semibold">{r.key}</span>{" "}
                    <span className="text-muted">{r.change}</span>
                    {step >= 1 && (
                      <span className="text-viz-meta block text-[10px]">
                        {r.fg ? `index → file group ${r.fg}` : "index → not found: insert"}
                        {routed && t && ` · written to ${t}`}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {FILE_GROUPS.map((fg) => {
                const hit = INCOMING.some(
                  (r) => target(r) === fg && ((r.fg && step >= 2) || (!r.fg && step >= 3)),
                );
                return (
                  <motion.div
                    key={fg}
                    animate={{ scale: hit ? 1.03 : 1 }}
                    className={cn(
                      "rounded-xl border p-2 transition-colors",
                      hit ? "border-viz-compute bg-viz-compute/10" : "border-line bg-bg/40",
                    )}
                  >
                    <p className="text-muted mb-1 font-mono text-[10px]">file group {fg}</p>
                    <ul className="grid gap-0.5 font-mono text-[10px]">
                      {TRIPS.filter((t) => t.fg === fg).map((t) => (
                        <li
                          key={t.id}
                          className={cn(
                            "rounded px-1",
                            step >= 1 &&
                              INCOMING.some((r) => r.key === t.id) &&
                              "bg-viz-meta/20 text-viz-meta",
                          )}
                        >
                          {t.id}
                        </li>
                      ))}
                      {fg === "B" && step >= 3 && (
                        <motion.li
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-viz-data/25 rounded px-1"
                        >
                          t-110 (new)
                        </motion.li>
                      )}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-line bg-surface overflow-x-auto rounded-xl border"
            >
              <table className="w-full font-mono text-[10px]">
                <thead className="bg-surface-2/60 text-muted">
                  <tr>
                    {[
                      "_hoodie_commit_time",
                      "_hoodie_record_key",
                      "_hoodie_partition_path",
                      "_hoodie_file_name",
                      "trip_id",
                      "fare",
                    ].map((h) => (
                      <th key={h} className="px-2 py-1.5 text-left font-medium whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-line border-t">
                    <td className="px-2 py-1">20260924100500000</td>
                    <td className="px-2">t-102</td>
                    <td className="px-2">city=blr</td>
                    <td className="px-2 whitespace-nowrap">A…parquet</td>
                    <td className="px-2">t-102</td>
                    <td className="px-2">210</td>
                  </tr>
                </tbody>
              </table>
            </motion.div>
          )}

          <Stepper
            step={step}
            count={ROUTE_FRAMES.length}
            onChange={(n) => set({ routeStep: n })}
          />
          <FrameCaption frameKey={step} title={f.title}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        In Hudi, every record has a <Term id="record-key">record key</Term>, like{" "}
        <code>trip_id</code>. Within a partition, records live in{" "}
        <Term id="file-group">file groups</Term>, and each key lives in exactly one file group at a
        time.
      </p>
      <p>
        So an upsert is a routing problem: for each incoming record, which file group already holds
        this key? That&apos;s the job of Hudi&apos;s <Term id="hudi-index">index</Term>.
      </p>
      <p className="text-subtle text-xs">
        Hudi also adds <code>_hoodie_commit_seqno</code> (and, with Flink,{" "}
        <code>_hoodie_operation</code>). You can switch the meta columns off, but you lose
        incremental queries, so it&apos;s only meant for append-only data.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Checkpoint --------------------------------------------------------------- */

export function RouteCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="How does an update find its file?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="route-update"
            prompt="An update for trip t-4821 arrives at a Hudi table with 20,000 file groups. How does Hudi decide which file group to write?"
            options={[
              {
                id: "scan",
                label: "It opens every file group until it finds t-4821",
                feedback: "That's exactly the cost Hudi was built to avoid.",
              },
              {
                id: "index",
                label: "Its index maps the record key t-4821 to the file group that holds it",
                correct: true,
                feedback:
                  "Right. The key's file group is found first, and only that group is changed.",
              },
              {
                id: "new",
                label: "It writes the update to a new file group and deletes the old row later",
                feedback:
                  "Then the table would have two versions of t-4821. Each key lives in exactly one file group at a time.",
              },
              {
                id: "partition",
                label: "It rewrites the whole partition, like a Hive table",
                feedback: "That was the old way. Hudi changes only the file group holding the key.",
              },
            ]}
            explanation="Different index types answer the lookup in different ways. You'll compare them in a later step."
          />
        </div>
      }
    >
      <p>Remember the routing you just stepped through.</p>
    </StepLayout>
  );
}
