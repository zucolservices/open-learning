"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Briefcase, CalendarClock, HardDrive, Shield, Users } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { Kind, WlState } from "./state";

/* 1 ─ Five kinds of staff ------------------------------------------------------------------------ */

const STAFF = [
  {
    icon: Users,
    t: "Interchangeable temps",
    d: "Any of them can serve any table; if one leaves, hire another.",
    k: "Deployment",
  },
  {
    icon: HardDrive,
    t: "Named staff with their own lockers",
    d: "Asha is always Asha, and her locker keeps her things even if she's off sick.",
    k: "StatefulSet",
  },
  {
    icon: Shield,
    t: "One guard on every floor",
    d: "Open a new floor and a guard is posted there automatically.",
    k: "DaemonSet",
  },
  {
    icon: Briefcase,
    t: "A contractor for one job",
    d: "Paints the hall, then leaves. If they fail, they try again.",
    k: "Job",
  },
  {
    icon: CalendarClock,
    t: "The night cleaner",
    d: "Comes every night at 2 a.m. and does the same round.",
    k: "CronJob",
  },
];

export function FiveStaff() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Five kinds of staff"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {STAFF.map(({ icon: Icon, t, d, k }, i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border px-3 py-2"
            >
              <Icon className="text-accent size-5" />
              <div>
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted text-xs">{d}</p>
              </div>
              <span className="text-accent font-mono text-[11px]">{k}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A <Term id="deployment">Deployment</Term> suits interchangeable web servers, &ldquo;usually
        one that doesn&apos;t maintain state&rdquo;. But not every workload is like that.
      </p>
      <p>
        Databases need stable names and their own disks. Log collectors need one copy on every
        machine. Batch work needs to run and finish. Kubernetes has a controller for each.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Watch each controller ⭐ -------------------------------------------------------------------- */

const TABS: [Kind, string][] = [
  ["deployment", "Deployment"],
  ["statefulset", "StatefulSet"],
  ["daemonset", "DaemonSet"],
  ["job", "Job"],
  ["cronjob", "CronJob"],
];

const RAND = ["x7k2p", "m4q9z", "b8r1t", "f3w6n", "k9d2s", "p5h8v", "t2j7c", "w6l3g"];

function PodChip({
  name,
  tone = "accent",
  disk,
  done,
}: {
  name: string;
  tone?: "accent" | "idle";
  disk?: string;
  done?: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      className="flex flex-col items-center gap-0.5"
    >
      <span
        className={cn(
          "rounded-md border px-1.5 py-1 font-mono text-[10px]",
          done
            ? "border-good bg-good/20"
            : tone === "accent"
              ? "border-accent bg-accent-soft"
              : "border-line bg-surface",
        )}
      >
        {name}
        {done ? " ✓" : ""}
      </span>
      {disk && (
        <span className="border-viz-data bg-viz-data/15 rounded border px-1 font-mono text-[8px]">
          {disk}
        </span>
      )}
    </motion.div>
  );
}

function Nodes({ count, children }: { count: number; children: (n: number) => ReactNode }) {
  return (
    <div className={cn("grid gap-2", count > 3 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3")}>
      {Array.from({ length: count }, (_, n) => (
        <motion.div
          key={n}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-line bg-surface-2/40 flex min-h-24 flex-col gap-1.5 rounded-xl border p-2"
        >
          <span className="text-muted font-mono text-[9px]">node-{n + 1}</span>
          <div className="flex flex-wrap gap-1.5">
            <AnimatePresence>{children(n)}</AnimatePresence>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function DeploymentDemo() {
  const [names, setNames] = useState(["x7k2p", "m4q9z", "b8r1t"]);
  const [seq, setSeq] = useState(3);
  return (
    <>
      <Nodes count={3}>{(n) => <PodChip key={names[n]} name={`api-${names[n]}`} />}</Nodes>
      <button
        type="button"
        onClick={() => {
          setNames((x) => x.map((v, i) => (i === 1 ? RAND[seq % RAND.length] : v)));
          setSeq(seq + 1);
        }}
        className="border-line hover:bg-surface-2 self-start rounded-full border px-3 py-1 text-xs"
      >
        Delete the pod on node-2
      </button>
      <p className="text-muted text-xs">
        Its replacement gets a new random name. Nobody cares which pod is which.
      </p>
    </>
  );
}

function StatefulDemo() {
  const [up, setUp] = useState(0);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    if (up >= 3) return;
    const id = setTimeout(() => setUp((u) => u + 1), 900);
    return () => clearTimeout(id);
  }, [up]);
  useEffect(() => {
    if (!gone) return;
    const id = setTimeout(() => setGone(false), 1200);
    return () => clearTimeout(id);
  }, [gone]);
  return (
    <>
      <Nodes count={3}>
        {(n) =>
          n < up && !(gone && n === 1) ? (
            <PodChip key={`db-${n}`} name={`db-${n}`} disk={`data-db-${n}`} />
          ) : n === 1 && gone ? (
            <span
              key="disk"
              className="border-viz-data bg-viz-data/15 rounded border px-1 font-mono text-[8px]"
            >
              data-db-1 waits
            </span>
          ) : null
        }
      </Nodes>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setUp(0)}
          className="border-line hover:bg-surface-2 rounded-full border px-3 py-1 text-xs"
        >
          Start again (in order)
        </button>
        <button
          type="button"
          disabled={up < 3}
          onClick={() => setGone(true)}
          className="border-line hover:bg-surface-2 rounded-full border px-3 py-1 text-xs disabled:opacity-40"
        >
          Delete db-1
        </button>
      </div>
      <p className="text-muted text-xs">
        db-0, then db-1, then db-2, each waiting for the last to be ready. A deleted db-1 comes back
        as db-1, reattached to its own disk.
      </p>
    </>
  );
}

function DaemonDemo() {
  const [nodes, setNodes] = useState(3);
  return (
    <>
      <Nodes count={nodes}>
        {(n) => <PodChip key={`log-${n}`} name={`log-agent-${RAND[n]}`} />}
      </Nodes>
      <button
        type="button"
        disabled={nodes >= 4}
        onClick={() => setNodes(4)}
        className="border-line hover:bg-surface-2 self-start rounded-full border px-3 py-1 text-xs disabled:opacity-40"
      >
        Add a node
      </button>
      <p className="text-muted text-xs">
        One copy per node, no replica count. A new node gets its own copy automatically.
      </p>
    </>
  );
}

function JobDemo() {
  const [done, setDone] = useState(0);
  const [running, setRunning] = useState(false);
  const total = 5;
  useEffect(() => {
    if (!running || done >= total) return;
    const id = setTimeout(() => setDone((d) => Math.min(total, d + 1)), 800);
    return () => clearTimeout(id);
  }, [running, done]);
  const active = running && done < total ? Math.min(2, total - done) : 0;
  return (
    <>
      <Nodes count={3}>
        {(n) => (
          <>
            {Array.from({ length: done }, (_, i) => i)
              .filter((i) => i % 3 === n)
              .map((i) => (
                <PodChip key={`d${i}`} name={`report-${i}`} done />
              ))}
            {Array.from({ length: active }, (_, i) => done + i)
              .filter((i) => i % 3 === n)
              .map((i) => (
                <PodChip key={`r${i}`} name={`report-${i}`} />
              ))}
          </>
        )}
      </Nodes>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setDone(0);
            setRunning(true);
          }}
          className="border-line hover:bg-surface-2 rounded-full border px-3 py-1 text-xs"
        >
          Run the Job
        </button>
        <span className="font-mono text-xs">
          completions {done}/{total} · parallelism 2
        </span>
      </div>
      <p className="text-muted text-xs">
        Pods run to completion, two at a time, until five have succeeded. Then the Job is done; it
        doesn&apos;t restart them.
      </p>
    </>
  );
}

function CronDemo() {
  const [day, setDay] = useState(1);
  const history = Array.from({ length: day }, (_, i) => i + 1).slice(-3);
  return (
    <>
      <div className="border-line bg-surface flex items-center justify-between rounded-lg border px-3 py-2 font-mono text-xs">
        <span>schedule: &quot;0 2 * * *&quot; · timeZone: Asia/Kolkata</span>
        <span className="text-accent">day {day}, 02:00</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <AnimatePresence>
          {history.map((d) => (
            <PodChip key={d} name={`backup-day${d}`} done />
          ))}
        </AnimatePresence>
      </div>
      <button
        type="button"
        onClick={() => setDay(day + 1)}
        className="border-line hover:bg-surface-2 self-start rounded-full border px-3 py-1 text-xs"
      >
        Next night
      </button>
      <p className="text-muted text-xs">
        Each night it creates a Job. Only the last three successful Jobs are kept (failed: one).
      </p>
    </>
  );
}

const DEMO: Record<Kind, () => ReactNode> = {
  deployment: () => <DeploymentDemo />,
  statefulset: () => <StatefulDemo />,
  daemonset: () => <DaemonDemo />,
  job: () => <JobDemo />,
  cronjob: () => <CronDemo />,
};

export function Watch() {
  const [s, set] = useSceneState<WlState>();
  return (
    <StepLayout
      eyebrow="Animated infographic"
      title="Watch each controller"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {TABS.map(([k, n]) => (
              <button
                key={k}
                type="button"
                onClick={() => set({ kind: k })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.kind === k ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <motion.div
            key={s.kind}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3"
          >
            {DEMO[s.kind]()}
          </motion.div>
        </div>
      }
    >
      <p>
        Pick a controller and poke it. Watch what it promises: random or stable names, ordered
        starts, one pod per node, or pods that finish.
      </p>
      <p>
        A <Term id="statefulset">StatefulSet</Term> gives each pod a fixed name and its own storage;
        a <Term id="daemonset">DaemonSet</Term> puts one pod on each node; a{" "}
        <Term id="job">Job</Term> runs pods until enough succeed; a{" "}
        <Term id="cronjob">CronJob</Term> creates Jobs on a schedule.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The fine print ----------------------------------------------------------------------------- */

const FINE: [string, string][] = [
  [
    "StatefulSet",
    'Needs a headless Service you create, which gives each pod a DNS name (db-0.db.default.svc.cluster.local). Starts in order by default (OrderedReady), updates from the highest number down, and keeps volumes when you scale down "to ensure data safety".',
  ],
  [
    "DaemonSet",
    "Runs on all nodes, or some (nodeSelector, affinity). Pods for removed nodes are garbage-collected. To run on control-plane nodes, add the toleration yourself.",
  ],
  [
    "Job",
    "restartPolicy must be Never or OnFailure. Failed pods are retried with back-off, 6 times by default (backoffLimit). ttlSecondsAfterFinished cleans finished Jobs up; Indexed mode gives each pod a number.",
  ],
  [
    "CronJob",
    'Five-field cron schedule plus a timeZone. concurrencyPolicy: Allow (default), Forbid or Replace. In rare cases "two Jobs might be created, or no Job might be created", so the work "should be idempotent".',
  ],
];

export function FinePrint() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The fine print"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {FINE.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="font-mono text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Each controller has a few settings worth knowing before you use it. The CronJob warning
        matters most: schedules are best effort, so a nightly job must be safe to run twice.
      </p>
      <p>
        Running a production database on a StatefulSet is possible but takes care: backups, failover
        and upgrades are still yours. Many teams use an operator (module 21) or a managed database
        instead.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Which controller? -------------------------------------------------------------------------- */

export function WhichController() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which controller?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-controller"
            prompt="Which controller fits each workload?"
            categories={[
              { id: "deployment", label: "Deployment" },
              { id: "statefulset", label: "StatefulSet" },
              { id: "daemonset", label: "DaemonSet" },
              { id: "job", label: "Job" },
              { id: "cronjob", label: "CronJob" },
            ]}
            items={[
              {
                id: "api",
                label: "A stateless payments API behind a load balancer",
                category: "deployment",
                why: "Interchangeable pods, rolling updates.",
              },
              {
                id: "kafka",
                label: "A three-broker Kafka cluster, each broker with its own disk",
                category: "statefulset",
                why: "Stable names and per-pod storage.",
              },
              {
                id: "logs",
                label: "A log collector that must read every node's files",
                category: "daemonset",
                why: "One pod per node, including new ones.",
              },
              {
                id: "migrate",
                label: "A one-off data migration that must finish",
                category: "job",
                why: "Runs to completion and retries on failure.",
              },
              {
                id: "backup",
                label: "A database backup every night at 2 a.m.",
                category: "cronjob",
                why: "Creates a Job on a schedule. Make it safe to run twice.",
              },
              {
                id: "monitor",
                label: "A node monitoring agent",
                category: "daemonset",
                why: "The docs' own example of a DaemonSet.",
              },
            ]}
            explanation="Stateless and replaceable: Deployment. Named with its own data: StatefulSet. One per node: DaemonSet. Run and finish: Job. On a timetable: CronJob."
          />
        </div>
      }
    >
      <p>Six workloads. Match each to its controller.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Deployment", "Stateless, interchangeable, rolling updates."],
  ["StatefulSet", "Stable names (db-0), own disks, ordered."],
  ["DaemonSet", "One per node, for node-level agents."],
  ["Job and CronJob", "Run to completion, once or on a schedule; keep them idempotent."],
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
      <p>Next chapter: networking, starting with Services and DNS.</p>
    </StepLayout>
  );
}
