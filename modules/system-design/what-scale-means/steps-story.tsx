"use client";

import { AnimatePresence, motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

/* 1 ─ From 100 users to 100 million ⭐ ------------------------------------------------------------- */

type Kind = "users" | "edge" | "lb" | "app" | "cache" | "queue" | "db" | "replica" | "region";

interface Node {
  id: string;
  label: string;
  kind: Kind;
  x: number;
  y: number;
  stages: [number, number]; // visible from..to (inclusive)
}

const NODES: Node[] = [
  { id: "users", label: "Users", kind: "users", x: 50, y: 6, stages: [0, 6] },
  { id: "cdn", label: "CDN", kind: "edge", x: 50, y: 20, stages: [5, 6] },
  { id: "lb", label: "Load balancer", kind: "lb", x: 50, y: 34, stages: [3, 6] },
  { id: "solo", label: "App + database", kind: "app", x: 50, y: 52, stages: [1, 1] },
  { id: "app1", label: "App", kind: "app", x: 50, y: 52, stages: [2, 2] },
  { id: "appA", label: "App", kind: "app", x: 28, y: 52, stages: [3, 6] },
  { id: "appB", label: "App", kind: "app", x: 50, y: 52, stages: [3, 6] },
  { id: "appC", label: "App", kind: "app", x: 72, y: 52, stages: [3, 6] },
  { id: "cache", label: "Cache", kind: "cache", x: 90, y: 52, stages: [4, 6] },
  { id: "queue", label: "Queue + workers", kind: "queue", x: 15, y: 67, stages: [5, 6] },
  { id: "db", label: "Database", kind: "db", x: 50, y: 84, stages: [2, 5] },
  { id: "rep1", label: "Replica", kind: "replica", x: 72, y: 84, stages: [4, 5] },
  { id: "rep2", label: "Replica", kind: "replica", x: 90, y: 84, stages: [4, 5] },
  { id: "shardA", label: "Shard A", kind: "db", x: 32, y: 84, stages: [6, 6] },
  { id: "shardB", label: "Shard B", kind: "db", x: 55, y: 84, stages: [6, 6] },
  { id: "shardC", label: "Shard C", kind: "db", x: 78, y: 84, stages: [6, 6] },
];

const EDGES: [string, string][] = [
  ["users", "solo"],
  ["users", "app1"],
  ["app1", "db"],
  ["users", "lb"],
  ["users", "cdn"],
  ["cdn", "lb"],
  ["lb", "appA"],
  ["lb", "appB"],
  ["lb", "appC"],
  ["appB", "db"],
  ["appA", "db"],
  ["appC", "db"],
  ["appC", "cache"],
  ["db", "rep1"],
  ["appA", "queue"],
  ["appA", "shardA"],
  ["appB", "shardB"],
  ["appC", "shardC"],
];

const KIND_STYLE: Record<Kind, string> = {
  users: "border-line bg-surface-2",
  edge: "border-viz-meta/60 bg-viz-meta/10",
  lb: "border-accent/60 bg-accent-soft",
  app: "border-viz-compute/60 bg-viz-compute/10",
  cache: "border-viz-add/60 bg-viz-add/10",
  queue: "border-viz-meta/60 bg-viz-meta/10",
  db: "border-viz-data/60 bg-viz-data/10",
  replica: "border-viz-data/40 bg-viz-data/5 border-dashed",
  region: "border-line border-dashed",
};

const USERS = ["", "100", "10,000", "100,000", "1 million", "10 million", "100 million"];
const BROKE = [
  "",
  "",
  "The app and database fight over one machine's CPU and memory.",
  "One app server is flat out at lunchtime.",
  "The database spends all day answering the same reads.",
  "Images and slow jobs clog the app servers.",
  "One database can't hold, or write, everything.",
];

const shown = (n: Node, stage: number) => stage >= n.stages[0] && stage <= n.stages[1];

function Scene({ stage }: { stage: number }) {
  const byId = new Map(NODES.map((n) => [n.id, n]));
  const visible = NODES.filter((n) => shown(n, Math.max(stage, 1)));
  const visibleIds = new Set(visible.map((n) => n.id));
  return (
    <div className="flex h-full flex-col justify-center gap-2 pt-10 sm:gap-3 sm:pt-0">
      <div className="relative mx-auto aspect-[4/3] w-full max-w-lg">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full"
          aria-hidden
        >
          {EDGES.filter(([a, b]) => visibleIds.has(a) && visibleIds.has(b)).map(([a, b]) => {
            const na = byId.get(a)!;
            const nb = byId.get(b)!;
            return (
              <motion.line
                key={a + b}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                stroke="var(--line-strong)"
                strokeWidth={0.4}
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />
            );
          })}
        </svg>
        {stage === 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-line text-subtle absolute -right-1 bottom-0 rounded-lg border border-dashed px-1.5 py-0.5 text-[9px]"
          >
            + the same again in a second region
          </motion.div>
        )}
        <AnimatePresence>
          {visible.map((n) => (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border px-2 py-1 text-center text-[10px] font-medium whitespace-nowrap sm:text-[11px]",
                KIND_STYLE[n.kind],
              )}
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            >
              {n.id === "users" ? (
                <>
                  <motion.span
                    key={stage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-mono"
                  >
                    {USERS[Math.max(stage, 1)]}
                  </motion.span>{" "}
                  users
                </>
              ) : (
                n.label
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait">
        {BROKE[stage] && (
          <motion.p
            key={stage}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="border-bad/40 bg-bad/10 mx-auto hidden max-w-lg rounded-xl border px-3 py-2 text-xs sm:block"
          >
            What broke: {BROKE[stage]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "kitchen",
    kicker: "The big idea",
    title: "From home kitchen to restaurant chain",
    body: (
      <>
        <p>
          One cook in a home kitchen can feed a family. Feeding a street needs a bigger kitchen.
          Feeding a city needs more cooks, a host at the door, dishes prepared ahead, and eventually
          branches across town.
        </p>
        <p>
          Software grows the same way. Follow Brewline&apos;s coffee-ordering app as it goes from a
          hundred users to a hundred million, and watch what breaks at each step.
        </p>
      </>
    ),
  },
  {
    id: "100",
    kicker: "100 users",
    title: "One server does everything",
    body: (
      <p>
        The app and its database run on one machine. It&apos;s cheap, simple, and completely fine.
        Most apps never need more, and that&apos;s worth remembering.
      </p>
    ),
  },
  {
    id: "10k",
    kicker: "10,000 users",
    title: "Give the database its own machine",
    body: (
      <p>
        The app and the database compete for the same CPU and memory. The first fix is to move the
        database to its own server, and to buy bigger machines: <em>scaling up</em>.
      </p>
    ),
  },
  {
    id: "100k",
    kicker: "100,000 users",
    title: "More app servers behind a load balancer",
    body: (
      <p>
        One app server can&apos;t keep up at peak, and there&apos;s only so big a machine can get.
        So Brewline runs several identical app servers (<em>scaling out</em>) with a{" "}
        <Term id="load-balancer">load balancer</Term> in front spreading requests between them.
      </p>
    ),
  },
  {
    id: "1m",
    kicker: "1 million users",
    title: "Cache the popular answers, copy the database",
    body: (
      <p>
        Most requests read the same things: the menu, prices, store hours. A{" "}
        <Term id="cache">cache</Term> answers those from memory, and read{" "}
        <Term id="replica">replicas</Term> (copies of the database) share the remaining reads.
      </p>
    ),
  },
  {
    id: "10m",
    kicker: "10 million users",
    title: "Move work to the edge and to the background",
    body: (
      <p>
        Images and static files are served from a <Term id="cdn">CDN</Term> close to each user. Slow
        jobs, like sending receipts, go onto a <Term id="queue">queue</Term> for background workers,
        so the app answers quickly.
      </p>
    ),
  },
  {
    id: "100m",
    kicker: "100 million users",
    title: "Split the data, and go multi-region",
    body: (
      <>
        <p>
          Now even the biggest database can&apos;t hold or write everything. The data is split into{" "}
          <Term id="shard">shards</Term>, each on its own machines, and the whole system is copied
          to a second region, for speed and for surviving disasters.
        </p>
        <p className="text-muted text-sm">
          The user counts here are illustrative: a video app breaks far sooner than a to-do list.
          The order is a common pattern, not a law.
        </p>
      </>
    ),
  },
];

export function Growth() {
  return (
    <ScrollStory
      sections={SECTIONS}
      renderScene={(i) => <Scene stage={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            From 100 users to 100 million
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            One app, six orders of magnitude, and what engineers add at each one.
          </p>
        </div>
      }
    />
  );
}
