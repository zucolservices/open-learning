"use client";

import { motion } from "motion/react";
import { ChefHat, Users } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { TASKS, schedule } from "./model";
import type { ClusterState } from "./state";

/* 1 ─ The head chef and the cooks ----------------------------------------------------------------- */

export function Kitchen() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The head chef and the cooks"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="border-accent bg-accent-soft flex items-center gap-2 rounded-xl border px-4 py-3">
            <ChefHat className="text-accent size-6" />
            <div>
              <p className="text-sm font-semibold">Head chef = driver</p>
              <p className="text-muted text-xs">reads the order, plans it, hands out jobs</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 * i }}
                className="border-viz-compute bg-viz-compute/10 rounded-xl border px-3 py-2 text-center"
              >
                <Users className="text-viz-compute mx-auto size-5" />
                <p className="text-xs font-semibold">Station {i} = executor</p>
                <p className="text-muted text-[10px]">two cooks = two task slots</p>
              </motion.div>
            ))}
          </div>
          <p className="text-muted text-xs">
            The restaurant manager, who hires cooks for the night = the cluster manager
          </p>
        </div>
      }
    >
      <p>
        In a busy restaurant kitchen, the head chef doesn&apos;t cook every dish. They read the
        order, break it into jobs (chop, grill, plate) and hand those out to cooks at their
        stations. If a cook goes home sick, the chef reassigns their dishes.
      </p>
      <p>
        A Spark application works the same way. The <Term id="driver">driver</Term> runs your
        program, plans the work and splits it into <Term id="task">tasks</Term>. The{" "}
        <Term id="executor">executors</Term> are processes on other machines that run those tasks
        and keep data for your application. A <Term id="cluster-manager">cluster manager</Term>{" "}
        finds the machines.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Run a stage ⭐ ------------------------------------------------------------------------------ */

export function RunStage() {
  const [s, set] = useSceneState<ClusterState>();
  const r = schedule(s.executors, s.cores, s.lose);
  const slider = (k: "executors" | "cores", label: string, min: number, max: number) => (
    <label className="flex flex-1 items-center gap-2 text-xs">
      <span className="text-muted w-28">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={s[k]}
        onChange={(e) => set({ [k]: Number(e.target.value) } as Partial<ClusterState>)}
        className="accent-accent flex-1"
      />
      <span className="w-6 text-right font-mono">{s[k]}</span>
    </label>
  );
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Run a stage"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
            {slider("executors", "executors", 1, 4)}
            {slider("cores", "cores per executor", 1, 4)}
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.lose}
              onChange={(e) => set({ lose: e.target.checked })}
              className="accent-accent"
            />
            Lose executor 2 during the first wave
          </label>
          <div className="flex flex-col gap-2">
            {Array.from({ length: s.executors }, (_, e) => (
              <div key={e} className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-20 shrink-0 font-mono text-[11px]",
                    s.lose && e === 1 && s.executors > 1 && "text-bad line-through",
                  )}
                >
                  executor {e + 1}
                </span>
                <div className="flex flex-1 flex-col gap-0.5">
                  {Array.from({ length: s.cores }, (_, slot) => (
                    <div key={slot} className="bg-surface-2 relative h-4 rounded">
                      {r.placements
                        .filter((p) => p.executor === e && p.slot === slot)
                        .map((p) => (
                          <motion.span
                            key={`${p.task}-${p.wave}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.05 * p.wave }}
                            className={cn(
                              "absolute top-0 grid h-4 place-items-center rounded border font-mono text-[8px]",
                              p.lost
                                ? "border-bad bg-bad/30"
                                : p.retried
                                  ? "border-viz-meta bg-viz-meta/30"
                                  : "border-viz-compute bg-viz-compute/30",
                            )}
                            style={{
                              left: `${(p.wave / Math.max(r.waves, 1)) * 100}%`,
                              width: `${100 / Math.max(r.waves, 1)}%`,
                            }}
                          >
                            {p.task + 1}
                          </motion.span>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["task slots", String(s.executors * s.cores)],
              ["waves", String(r.waves)],
              ["stage time", `${r.seconds} s`],
            ].map(([l, v]) => (
              <div key={l} className="border-line bg-surface rounded-lg border px-3 py-1.5">
                <p className="text-muted text-[10px]">{l}</p>
                <p className="font-mono text-sm font-semibold">{v}</p>
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            {TASKS} equal tasks of 10 seconds each, one per partition. Red: lost with its executor;
            purple: retried. Illustrative.
          </p>
        </div>
      }
    >
      <p>
        A stage has 16 tasks, one per piece of data. Each executor can run as many tasks at once as
        it has cores: its task slots. Change the cluster and watch the tasks run in waves.
      </p>
      <p>
        Then lose an executor. Its running tasks fail and the driver simply runs them again on the
        survivors; a task is retried up to 4 times by default before the job gives up. Data an
        executor held is recomputed from the steps that made it, which is how Spark survives
        failures without copying everything.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Where the cluster comes from ---------------------------------------------------------------- */

const MANAGERS: [string, string][] = [
  ["Standalone", "A simple cluster manager included with Spark."],
  ["Hadoop YARN", "The resource manager in Hadoop clusters, common on premises and in Amazon EMR."],
  [
    "Kubernetes",
    "Runs the driver and executors as containers; the usual choice for new self-managed set-ups.",
  ],
  [
    "Managed services",
    "Databricks and the cloud providers run the cluster manager for you (module 19).",
  ],
];

export function WhereRuns() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where the cluster comes from"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {MANAGERS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
          <Code>{`spark-submit --master k8s://https://my-cluster:6443 \\
  --deploy-mode cluster --conf spark.executor.instances=4 \\
  --conf spark.executor.cores=4  my_job.py`}</Code>
        </div>
      }
    >
      <p>
        Spark&apos;s docs list three cluster managers: its own standalone one, Hadoop YARN and
        Kubernetes. (Apache Mesos was deprecated in Spark 3.2 and removed in 4.0.)
      </p>
      <p>
        The <Term id="deploy-mode">deploy mode</Term> says where the driver runs: in cluster mode
        inside the cluster, in client mode on the machine you submitted from. Since Spark 3.4,{" "}
        <Term id="spark-connect">Spark Connect</Term> also lets a thin client, like a notebook or
        app, send DataFrame plans to a remote Spark over gRPC and get results back as Arrow batches.
      </p>
    </StepLayout>
  );
}

/* 4 ─ The words Spark uses ------------------------------------------------------------------------ */

const WORDS: [string, string][] = [
  [
    "Driver program",
    "The process running the main() function of the application and creating the SparkContext.",
  ],
  [
    "Executor",
    "A process launched for an application on a worker node, that runs tasks and keeps data in memory or disk storage across them. Each application has its own executors.",
  ],
  ["Task", "A unit of work that will be sent to one executor."],
  [
    "Job",
    "A parallel computation consisting of multiple tasks that gets spawned in response to a Spark action (e.g. save, collect).",
  ],
  [
    "Stage",
    "Each job gets divided into smaller sets of tasks called stages that depend on each other.",
  ],
];

export function Glossary() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The words Spark uses"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {WORDS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface grid grid-cols-[6.5rem_1fr] gap-2 rounded-lg border px-3 py-2"
            >
              <span className="text-sm font-semibold">{t}</span>
              <span className="text-muted text-xs">&ldquo;{d}&rdquo;</span>
            </motion.div>
          ))}
          <p className="text-subtle text-[10px]">
            Definitions from the Spark documentation&apos;s glossary.
          </p>
        </div>
      }
    >
      <p>
        These five words appear everywhere in Spark&apos;s docs and its web UI, which each driver
        serves, typically on port 4040. You&apos;ll meet jobs and stages properly in module 8.
      </p>
      <p>
        One consequence worth noticing: each application gets its own executors, so two applications
        can&apos;t share data in memory. To share, one has to write it to storage.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Driver or executor? ------------------------------------------------------------------------- */

export function WhoDoes() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Driver or executor?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="driver-or-executor"
            prompt="Which process does each job?"
            categories={[
              { id: "driver", label: "Driver" },
              { id: "executor", label: "Executor" },
            ]}
            items={[
              {
                id: "plan",
                label: "Turns your DataFrame code into a plan of stages and tasks",
                category: "driver",
                why: "Planning and scheduling happen in the driver.",
              },
              {
                id: "session",
                label: "Holds the SparkSession your code uses",
                category: "driver",
                why: "The driver runs main() and creates the session.",
              },
              {
                id: "collect",
                label: "Receives the rows when you call collect()",
                category: "driver",
                why: "Results come back to the driver, so collecting huge data can overwhelm it.",
              },
              {
                id: "run",
                label: "Filters the rows in partition 17",
                category: "executor",
                why: "Executors run tasks.",
              },
              {
                id: "cache",
                label: "Keeps a cached DataFrame in memory",
                category: "executor",
                why: "Executors store data for the application.",
              },
            ]}
            explanation="The driver plans, schedules and collects; executors compute and store data."
          />
        </div>
      }
    >
      <p>Sort the jobs.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Driver", "Runs your program, plans and schedules."],
  ["Executors", "Run tasks and hold data, one set per application."],
  ["Slots and waves", "Tasks run in waves across executors' cores."],
  ["Failures are routine", "Lost tasks are retried; lost data is recomputed."],
  ["Cluster managers", "Standalone, YARN, Kubernetes, or a managed service."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {POINTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>Next: the ways you describe data to Spark, from RDDs to DataFrames.</p>
    </StepLayout>
  );
}
