"use client";

import { motion } from "motion/react";
import { ArrowDown, Check, Circle, Filter, Shuffle, Split, Wand2 } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { OPS, runPipeline } from "./pipeline";
import type { Op, TopoState } from "./state";

/* 1 ─ The sorting room ------------------------------------------------------------------------- */

const WORKERS: [typeof Filter, string, string][] = [
  [Filter, "Filter", "Throws out junk mail. Looks at one letter, keeps it or drops it."],
  [
    Wand2,
    "Map",
    "Stamps or rewrites each letter: covers the phone number, converts the address format.",
  ],
  [Split, "Route", "Drops each letter into a bin by city."],
];

export function SortingRoom() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="The sorting room"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          {WORKERS.map(([Icon, t, d], i) => (
            <div key={t} className="flex w-full max-w-md flex-col items-center gap-2">
              {i > 0 && <ArrowDown className="text-muted size-4" />}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * i }}
                className="border-line bg-surface flex w-full items-start gap-3 rounded-xl border px-4 py-3"
              >
                <Icon className="text-accent mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="font-semibold">{t}</p>
                  <p className="text-muted text-sm">{d}</p>
                </div>
              </motion.div>
            </div>
          ))}
          <p className="text-muted text-xs">No worker needs to remember any earlier letter.</p>
        </div>
      }
    >
      <p>
        In a post office sorting room, letters move along a belt past workers who each do one simple
        job, on one letter at a time, without remembering the others.
      </p>
      <p>
        That is <Term id="stateless-operation">stateless</Term> stream processing. Chain the jobs
        and you get a <Term id="processor-topology">topology</Term>: events flow in from a topic,
        through the steps, and out to other topics. Most real-time integrations are nothing more.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Wire a topology ⭐ ------------------------------------------------------------------------- */

const ICON: Record<Op, typeof Filter> = {
  success: Filter,
  large: Filter,
  mask: Wand2,
  rekey: Shuffle,
  route: Split,
};

export function Build() {
  const [s, set] = useSceneState<TopoState>();
  const ops = s.ops ?? [];
  const toggle = (o: Op) =>
    set({ ops: ops.includes(o) ? ops.filter((x) => x !== o) : [...ops, o] });
  const { stages, sinks } = runPipeline(ops);
  const goals: [string, boolean][] = [
    ["Only successful payments", ops.includes("success")],
    ["Only ₹10,000 and above", ops.includes("large")],
    ["Phone numbers masked", ops.includes("mask")],
    ["UPI and card in separate topics", ops.includes("route")],
  ];
  const done = goals.every((g) => g[1]);
  return (
    <StepLayout
      eyebrow="Build"
      title="Wire a topology"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <p className="text-muted text-xs">Steps (applied top to bottom)</p>
            {OPS.map((o) => {
              const on = ops.includes(o.id);
              const I = ICON[o.id];
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => toggle(o.id)}
                  className={cn(
                    "flex items-start gap-2 rounded-lg border px-3 py-2 text-left",
                    on
                      ? "border-accent bg-accent-soft"
                      : "border-line bg-surface hover:bg-surface-2",
                  )}
                >
                  <I className={cn("mt-0.5 size-4 shrink-0", on ? "text-accent" : "text-muted")} />
                  <span>
                    <span className="font-mono text-xs">{o.label}</span>
                    <span className="text-muted block text-[10px]">{o.note}</span>
                  </span>
                </button>
              );
            })}
            <div className="border-line mt-1 rounded-lg border px-3 py-2">
              <p className="mb-1 text-xs font-semibold">The fraud team asked for</p>
              {goals.map(([g, ok]) => (
                <p
                  key={g}
                  className={cn(
                    "flex items-center gap-1.5 text-[11px]",
                    ok ? "text-good" : "text-muted",
                  )}
                >
                  {ok ? <Check className="size-3" /> : <Circle className="size-3" />} {g}
                </p>
              ))}
              {ops.includes("rekey") && (
                <p className="text-muted mt-1 text-[10px]">
                  selectKey isn&apos;t needed here: it only adds a repartition if you later group or
                  join.
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            {stages.map((st, i) => (
              <div key={st.label}>
                {i > 0 && <ArrowDown className="text-muted mx-auto size-3" />}
                <div className="border-line bg-surface flex items-center justify-between rounded-md border px-2 py-1 text-[11px]">
                  <span className="font-mono">{st.label}</span>
                  <span className="text-muted">{st.out.length} events</span>
                </div>
              </div>
            ))}
            <ArrowDown className="text-muted mx-auto size-3" />
            <div
              className="grid gap-1.5"
              style={{
                gridTemplateColumns: `repeat(${Object.keys(sinks).length}, minmax(0, 1fr))`,
              }}
            >
              {Object.entries(sinks).map(([topic, evs]) => (
                <div
                  key={topic}
                  className={cn(
                    "rounded-lg border px-2 py-1.5",
                    done ? "border-good/50 bg-good/10" : "border-line bg-surface",
                  )}
                >
                  <p className="mb-1 font-mono text-[10px] font-semibold">→ {topic}</p>
                  {evs.length === 0 && <p className="text-muted text-[10px]">empty</p>}
                  {evs.map((p) => (
                    <motion.p
                      key={p.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-mono text-[9px] leading-relaxed"
                    >
                      {p.channel} ₹{p.amount.toLocaleString("en-IN")} {p.merchant}{" "}
                      {p.status === "failed" ? "✗" : ""} · {p.phone}
                    </motion.p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <p>
        Eight payments arrive on a topic. The fraud team wants a feed of large successful payments
        with phone numbers masked, split by channel. Switch steps on and watch the events flow.
      </p>
      <p>
        Every step here looks at one event at a time, so it can run on any number of machines in
        parallel. One subtlety: changing the key (selectKey, map) means later grouping or joining
        needs a <Term id="repartition">repartition</Term>, an extra hop through Kafka. Kafka
        Streams&apos; docs say mapValues &ldquo;is preferable to map because it will not cause data
        re-partitioning&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The same topology in code --------------------------------------------------------------- */

const CODE: Record<TopoState["lang"], { title: string; code: string; note: string }> = {
  streams: {
    title: "Kafka Streams (Java), a library inside your app",
    code: `builder.stream("payments", Consumed.with(Serdes.String(), paySerde))
  .filter((k, p) -> p.status().equals("success"))
  .filter((k, p) -> p.amount() >= 10_000)
  .mapValues(p -> p.withPhone(mask(p.phone())))
  .split()
    .branch((k, p) -> p.channel() == UPI,
            Branched.withConsumer(s -> s.to("upi-review")))
    .defaultBranch(Branched.withConsumer(s -> s.to("card-review")));`,
    note: "split() with Branched since Kafka 2.8; the old branch() was removed in 4.0.",
  },
  flink: {
    title: "Apache Flink DataStream (Java)",
    code: `DataStream<Pay> big = env.fromSource(kafkaSource, wm, "payments")
  .filter(p -> p.status.equals("success"))
  .filter(p -> p.amount >= 10_000)
  .map(p -> p.withPhone(mask(p.phone)));

// route with a side output
SingleOutputStreamOperator<Pay> upi = big.process(new SplitByChannel(cardTag));
upi.sinkTo(upiSink);
upi.getSideOutput(cardTag).sinkTo(cardSink);`,
    note: "Flink chains these operators into one thread by default. Flink 2.3 is current.",
  },
  beam: {
    title: "Apache Beam (Python), runs on Dataflow, Flink or Spark",
    code: `big = (payments
  | beam.Filter(lambda p: p["status"] == "success")
  | beam.Filter(lambda p: p["amount"] >= 10000)
  | beam.Map(mask_phone))

upi, card = big | beam.Partition(
    lambda p, n: 0 if p["channel"] == "UPI" else 1, 2)`,
    note: "Partition splits into a fixed number of outputs.",
  },
  spark: {
    title: "Spark Structured Streaming (Python)",
    code: `big = (payments
  .where("status = 'success' AND amount >= 10000")
  .withColumn("phone", mask_udf("phone")))

for ch, topic in [("UPI", "upi-review"), ("CARD", "card-review")]:
    (big.where(f"channel = '{ch}'")
        .writeStream.format("kafka").option("topic", topic).start())`,
    note: "A stream is treated as “a table that is being continuously appended”.",
  },
};

export function SameInCode() {
  const [s, set] = useSceneState<TopoState>();
  const c = CODE[s.lang];
  return (
    <StepLayout
      eyebrow="Explore"
      title="The same topology in code"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            size="sm"
            value={s.lang}
            options={[
              ["streams", "Kafka Streams"],
              ["flink", "Flink"],
              ["beam", "Beam"],
              ["spark", "Spark"],
            ]}
            onChange={(v) => set({ lang: v })}
          />
          <p className="text-sm font-semibold">{c.title}</p>
          <Code className="text-[10px] whitespace-pre-wrap">{c.code}</Code>
          <p className="text-muted text-xs">{c.note}</p>
        </div>
      }
    >
      <p>
        The finished topology in four popular engines. The vocabulary barely changes: filter, map,
        split. What differs is where the code runs and how it scales.
      </p>
      <p>The snippets are trimmed to the essentials; setup and serialisation are left out.</p>
    </StepLayout>
  );
}

/* 4 ─ Where it runs ---------------------------------------------------------------------------- */

const ENGINES: [string, string][] = [
  [
    "Kafka Streams (4.3)",
    "A Java library: no separate cluster, scale by running more copies of your app.",
  ],
  [
    "Apache Flink (2.3)",
    "A cluster engine. Managed as Amazon Managed Service for Apache Flink, Confluent Cloud for Apache Flink, Alibaba Cloud; Google's BigQuery Engine for Apache Flink is in preview.",
  ],
  [
    "Spark (4.2) and Beam (2.76)",
    "Spark Structured Streaming in micro-batches, with a Real-Time Mode for stateless jobs; Beam pipelines run on Google Dataflow, Flink or Spark.",
  ],
  [
    "Kafka Connect transforms",
    "“Lightweight message-at-a-time modifications”: rename, mask, insert fields, route by topic name. Built-in filtering only by topic, header or tombstone.",
  ],
  [
    "Serverless",
    "AWS Lambda with event filtering, EventBridge Pipes, Azure Functions with Event Hubs triggers, Pub/Sub attribute filters and single message transforms.",
  ],
];

export function Engines() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where it runs"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {ENGINES.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        For one field rename, a connector transform is enough. For filtering, reshaping and fan-out
        with real logic, use a stream processor. The moment you need to count, deduplicate or join,
        you need state, which is the next few modules.
      </p>
      <p>
        On routing: Martin Kleppmann&apos;s advice is to keep events that must stay in order in the
        same topic with the same key, rather than splitting every event type into its own topic.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which tool? ------------------------------------------------------------------------------ */

export function WhichTool() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which tool?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-tool"
            prompt="What does each job need?"
            categories={[
              { id: "smt", label: "A connector transform" },
              { id: "stateless", label: "A stateless processor" },
              { id: "stateful", label: "Needs state" },
            ]}
            items={[
              {
                id: "rename",
                label: "Rename one field while landing a topic in S3",
                category: "smt",
                why: "A lightweight per-record change in the connector.",
              },
              {
                id: "route",
                label: "Drop test events, reshape the rest and fan out to three topics by country",
                category: "stateless",
                why: "Per-event logic, but more than a connector transform should carry.",
              },
              {
                id: "count",
                label: "Count payments per merchant every minute",
                category: "stateful",
                why: "Counting needs memory across events (modules 13–14).",
              },
              {
                id: "mask",
                label: "Mask card numbers before they reach the analytics topic",
                category: "smt",
                why: "MaskField or a similar transform does it per record.",
              },
              {
                id: "join",
                label: "Add each customer's name from a customer table",
                category: "stateful",
                why: "A join keeps the table as state (module 14).",
              },
            ]}
            explanation="Stateless jobs look at one event at a time; once you need to remember anything, you need state."
          />
        </div>
      }
    >
      <p>Five jobs, three kinds of tool.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["One event at a time", "Filter, map, route: no memory needed."],
  ["Topologies", "Chains of steps from input topics to output topics."],
  ["Mind the key", "Changing it means a repartition before grouping or joining."],
  ["Pick the lightest tool", "Connector transform, library, or cluster engine."],
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
      <p>Next: time. When did an event happen, and when did we hear about it?</p>
    </StepLayout>
  );
}
