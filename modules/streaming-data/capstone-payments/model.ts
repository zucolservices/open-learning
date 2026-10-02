export type Verdict = "good" | "warn" | "bad";
export type Level = "holds" | "degrades" | "breaks";

export interface Option {
  id: string;
  label: string;
  verdict: Verdict;
}

export const DECISIONS: { id: string; area: string; module: number; options: Option[] }[] = [
  {
    id: "key",
    area: "Partition key",
    module: 3,
    options: [
      { id: "payer", label: "Payer's account", verdict: "good" },
      { id: "merchant", label: "Merchant", verdict: "warn" },
      { id: "none", label: "No key (spread evenly)", verdict: "bad" },
    ],
  },
  {
    id: "partitions",
    area: "Partitions",
    module: 19,
    options: [
      { id: "6", label: "6", verdict: "bad" },
      { id: "48", label: "48", verdict: "good" },
      { id: "2000", label: "2,000", verdict: "warn" },
    ],
  },
  {
    id: "durability",
    area: "Replication",
    module: 5,
    options: [
      { id: "safe", label: "3 copies, min.insync.replicas=2, acks=all", verdict: "good" },
      { id: "acks1", label: "3 copies, acks=1", verdict: "warn" },
      { id: "one", label: "1 copy", verdict: "bad" },
    ],
  },
  {
    id: "schema",
    area: "Schemas",
    module: 9,
    options: [
      { id: "registry", label: "Avro + schema registry, BACKWARD compatibility", verdict: "good" },
      { id: "none", label: "Plain JSON, no registry", verdict: "bad" },
    ],
  },
  {
    id: "guarantee",
    area: "Processing guarantee",
    module: 15,
    options: [
      { id: "eos", label: "Checkpoints + transactional sink", verdict: "good" },
      {
        id: "dedupe",
        label: "Checkpoints, at-least-once, alerts deduplicated by payment ID",
        verdict: "good",
      },
      { id: "auto", label: "No checkpoints, offsets auto-committed", verdict: "bad" },
    ],
  },
  {
    id: "time",
    area: "Time",
    module: 12,
    options: [
      {
        id: "event",
        label: "Event time, watermark, late events to a side output",
        verdict: "good",
      },
      { id: "eventDrop", label: "Event time, late events dropped", verdict: "warn" },
      { id: "processing", label: "Processing time", verdict: "bad" },
    ],
  },
  {
    id: "errors",
    area: "Bad events",
    module: 18,
    options: [
      { id: "dlq", label: "Retry with backoff, then dead-letter", verdict: "good" },
      { id: "forever", label: "Retry until it works", verdict: "bad" },
      { id: "skip", label: "Log and skip", verdict: "bad" },
    ],
  },
  {
    id: "storage",
    area: "Storage",
    module: 21,
    options: [
      {
        id: "both",
        label: "Real-time store for dashboards + lakehouse for history",
        verdict: "good",
      },
      { id: "lake", label: "Lakehouse only, 5-minute commits", verdict: "warn" },
      { id: "olap", label: "Real-time store only, kept for 7 years", verdict: "warn" },
    ],
  },
];

export const FAILURES: { id: string; name: string; text: string; where: string }[] = [
  {
    id: "broker",
    name: "A broker dies",
    text: "One of the Kafka brokers loses power mid-afternoon.",
    where: "kafka",
  },
  {
    id: "crash",
    name: "The job crashes",
    text: "The fraud-check job is killed and restarts from where it can.",
    where: "process",
  },
  {
    id: "schema",
    name: "A schema change ships",
    text: "The app team renames the field amount to amountPaise and releases.",
    where: "producer",
  },
  {
    id: "poison",
    name: "A malformed event",
    text: "A buggy app version sends one payment with truncated JSON.",
    where: "process",
  },
  {
    id: "spike",
    name: "Festival-day spike",
    text: "Diwali sale: traffic jumps tenfold for two hours, and one big merchant gets a quarter of it.",
    where: "kafka",
  },
  {
    id: "late",
    name: "Late phones",
    text: "Phones on patchy networks deliver events a minute after the payment.",
    where: "process",
  },
  {
    id: "dash",
    name: "A merchant checks",
    text: "Mid-rush, a shopkeeper opens the dashboard to see whether the payment just made has landed.",
    where: "storage",
  },
];

export interface Outcome {
  level: Level;
  text: string;
  module: number;
}

type C = Record<string, string | undefined>;

/** What happens to the design `c` when `failure` strikes. Missing choices are treated as not yet made. */
export function outcome(failure: string, c: C): Outcome | null {
  switch (failure) {
    case "broker":
      if (!c.durability) return null;
      if (c.durability === "one")
        return {
          level: "breaks",
          text: "Partitions whose only copy lived on that broker go offline: those payers' events can't be written or checked until it returns.",
          module: 5,
        };
      if (c.durability === "acks1")
        return {
          level: "degrades",
          text: "A follower takes over, but writes the leader had acknowledged and not yet replicated are gone: a few payments never reach the monitor.",
          module: 5,
        };
      return {
        level: "holds",
        text: "A follower in sync becomes leader. With two copies still in sync, writes continue and no acknowledged payment is lost.",
        module: 5,
      };
    case "crash":
      if (!c.guarantee) return null;
      if (c.guarantee === "auto")
        return {
          level: "breaks",
          text: "Offsets were committed on a timer, not with the job's state. On restart some payments are skipped and others counted twice: velocity counts are wrong.",
          module: 10,
        };
      if (c.guarantee === "dedupe")
        return {
          level: "holds",
          text: "The job restores its last checkpoint and replays from there. A few alerts are sent again, but the alert service drops repeats by payment ID.",
          module: 15,
        };
      return {
        level: "holds",
        text: "The job restores its last checkpoint; uncommitted output is discarded, and read_committed readers never see it. Each payment counted once.",
        module: 15,
      };
    case "schema":
      if (!c.schema) return null;
      if (c.schema === "registry")
        return {
          level: "holds",
          text: "Renaming is a delete plus an add without a default: the registry rejects it as incompatible, so the new app build fails in testing. The pipeline never sees it. (A plain removal would pass BACKWARD, so consumers must upgrade first.)",
          module: 9,
        };
      if (!c.errors) return null;
      if (c.errors === "dlq")
        return {
          level: "degrades",
          text: "Every new event fails to parse and goes to the dead-letter topic. Nothing is lost, but the monitor is blind to new-version payments until someone replays them.",
          module: 18,
        };
      if (c.errors === "forever")
        return {
          level: "breaks",
          text: "The first new-format event fails for ever. Each partition stops at it, and all monitoring stops.",
          module: 18,
        };
      return {
        level: "breaks",
        text: "New-format events are skipped silently: fraud checks stop for every user of the new app, and nobody notices.",
        module: 18,
      };
    case "poison":
      if (!c.errors) return null;
      if (c.errors === "dlq")
        return {
          level: "holds",
          text: "Three attempts, then the event goes to the dead-letter topic with the error attached. The partition keeps moving.",
          module: 18,
        };
      if (c.errors === "forever")
        return {
          level: "breaks",
          text: "A poison pill: that partition stops, and every payer on it goes unmonitored while lag grows.",
          module: 18,
        };
      return {
        level: "degrades",
        text: "The stream keeps moving, but one payment is never checked and leaves only a log line.",
        module: 18,
      };
    case "spike":
      if (!c.partitions || !c.key) return null;
      if (c.partitions === "6")
        return {
          level: "breaks",
          text: "Six partitions allow six consumers. You can't scale past that during the sale; lag climbs and alerts arrive minutes late.",
          module: 17,
        };
      if (c.key === "merchant")
        return {
          level: "breaks",
          text: "All of the big merchant's payments hash to one partition. One consumer can't keep up with a quarter of the traffic, however many partitions exist.",
          module: 3,
        };
      if (c.partitions === "2000")
        return {
          level: "holds",
          text: "Plenty of room to scale, though 2,000 partitions (6,000 with copies) cost memory, file handles and slower recovery every day of the year.",
          module: 19,
        };
      return {
        level: "holds",
        text: "Consumers scale out across 48 partitions and catch up after the peak. Payer keys spread the big merchant's customers evenly.",
        module: 17,
      };
    case "late":
      if (!c.time) return null;
      if (c.time === "processing")
        return {
          level: "breaks",
          text: "Late payments land in the wrong five-minute window: a burst of payments from one payer can be split across windows and slip under the threshold.",
          module: 12,
        };
      if (c.time === "eventDrop")
        return {
          level: "degrades",
          text: "Windows are correct, but events behind the watermark are dropped silently: a velocity check can miss a burst.",
          module: 13,
        };
      return {
        level: "holds",
        text: "Events are placed by when the payment happened. Stragglers behind the watermark go to a side output that rechecks them.",
        module: 13,
      };
    case "dash":
      if (!c.storage) return null;
      if (c.storage === "lake")
        return {
          level: "degrades",
          text: "The lakehouse table is up to five minutes behind. The shopkeeper sees nothing and asks the customer to pay again.",
          module: 20,
        };
      if (c.storage === "olap")
        return {
          level: "holds",
          text: "The payment shows within seconds. (Keeping seven years of history in the real-time store is the expensive part.)",
          module: 21,
        };
      return {
        level: "holds",
        text: "The real-time store shows the payment within seconds; history and audit queries go to the lakehouse.",
        module: 21,
      };
  }
  return null;
}
