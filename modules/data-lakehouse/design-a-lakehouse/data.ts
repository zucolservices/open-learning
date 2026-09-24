/** The capstone brief: Sahyog Cooperative Bank (fictional). */

export type ReqId = "fresh" | "repro" | "privacy" | "ops" | "fast" | "cost" | "india";
export type Effect = "good" | "meh" | "bad";

export const REQUIREMENTS: { id: ReqId; label: string; detail: string }[] = [
  {
    id: "fresh",
    label: "Fraud data within 5 minutes",
    detail: "Fraud analysts need transactions within five minutes.",
  },
  {
    id: "repro",
    label: "Reproducible filings",
    detail: "Regulatory reports must be reproducible exactly as filed, years later.",
  },
  {
    id: "privacy",
    label: "Member data protected",
    detail: "Personal data masked from most staff; erasure requests honoured.",
  },
  { id: "ops", label: "A 6-person team can run it", detail: "The data team is six people." },
  {
    id: "fast",
    label: "Fast branch dashboards",
    detail: "Branch managers' dashboards load in seconds.",
  },
  {
    id: "cost",
    label: "Budget-conscious",
    detail: "A cooperative bank: every rupee is members' money.",
  },
  {
    id: "india",
    label: "Data stays in India",
    detail: "Bank policy: all data stored and processed in India.",
  },
];

export interface Option {
  id: string;
  label: string;
  verdict: "strong" | "workable" | "risky";
  consequence: string;
  effects: Partial<Record<ReqId, Effect>>;
}

export interface Decision {
  id: string;
  title: string;
  question: string;
  options: Option[];
}

export const DECISIONS: Decision[] = [
  {
    id: "platform",
    title: "Platform",
    question: "Where will the lakehouse run?",
    options: [
      {
        id: "cloud",
        label: "A major cloud's managed services, in an India region",
        verdict: "strong",
        consequence:
          "Managed storage, catalog and engines keep the small team focused on data rather than servers. All three big clouds have regions in India.",
        effects: { ops: "good", india: "good", cost: "good" },
      },
      {
        id: "vendor",
        label: "A vendor platform (e.g. Databricks or Snowflake) on a cloud's India region",
        verdict: "strong",
        consequence:
          "Very little to operate and strong tooling, with a licence on top of cloud costs. Keep tables in an open format so you can leave.",
        effects: { ops: "good", india: "good", cost: "meh" },
      },
      {
        id: "selfhost",
        label: "Self-hosted open source in the bank's own data centre",
        verdict: "risky",
        consequence:
          "No licence fees and full control, but six people would run storage, catalog, engines, security patches and upgrades around the clock.",
        effects: { ops: "bad", india: "good", cost: "meh" },
      },
    ],
  },
  {
    id: "format",
    title: "Table format",
    question: "Which open table format?",
    options: [
      {
        id: "iceberg",
        label: "Apache Iceberg",
        verdict: "strong",
        consequence:
          "The widest engine and catalog support, hidden partitioning, tags for pinned snapshots.",
        effects: {},
      },
      {
        id: "delta",
        label: "Delta Lake",
        verdict: "strong",
        consequence:
          "Natural if the platform is Databricks or Fabric; UniForm can also expose Iceberg metadata.",
        effects: {},
      },
      {
        id: "hudi",
        label: "Apache Hudi",
        verdict: "strong",
        consequence:
          "Built for frequent upserts from CDC, with record-level indexes; check your engines' Hudi support.",
        effects: {},
      },
    ],
  },
  {
    id: "ingest",
    title: "Getting transactions in",
    question: "How do core banking transactions reach the lakehouse?",
    options: [
      {
        id: "nightly",
        label: "A nightly full export of the core banking database",
        verdict: "risky",
        consequence:
          "Simple, but fraud analysts would see transactions up to a day late, and full exports load the core system every night.",
        effects: { fresh: "bad" },
      },
      {
        id: "cdc",
        label: "Log-based CDC into bronze, MERGE into silver every minute",
        verdict: "strong",
        consequence:
          "Reads the database's log without touching the app; with sequence-guarded MERGE and soft deletes, silver stays correct even when events arrive late or twice.",
        effects: { fresh: "good" },
      },
      {
        id: "dual",
        label: "Change the banking app to also publish every transaction to Kafka",
        verdict: "risky",
        consequence:
          "Fresh, but dual writes can silently diverge (the database commits, the publish fails), and it means changing a core banking application.",
        effects: { fresh: "good", ops: "meh" },
      },
    ],
  },
  {
    id: "layout",
    title: "Transactions table layout",
    question: "How is the transactions table laid out?",
    options: [
      {
        id: "account",
        label: "Partition by account_id",
        verdict: "risky",
        consequence:
          "Hundreds of thousands of partitions, each full of tiny files: planning slows down and every minute's commit touches many folders.",
        effects: { fast: "bad", cost: "meh" },
      },
      {
        id: "day-cluster",
        label: "Partition by day, cluster by account_id",
        verdict: "strong",
        consequence:
          "Date filters prune whole days; clustering makes min/max stats skip files for one account. Few, well-sized files.",
        effects: { fast: "good" },
      },
      {
        id: "hour",
        label: "Partition by hour",
        verdict: "workable",
        consequence:
          "Fine pruning for recent data, but 8,760 partitions a year and many small files from frequent commits: needs regular compaction.",
        effects: { fast: "meh" },
      },
    ],
  },
  {
    id: "filings",
    title: "Reproducible filings",
    question: "An auditor may ask for the exact data behind any past filing. How?",
    options: [
      {
        id: "rerun",
        label: "Re-run the report query when asked",
        verdict: "risky",
        consequence:
          "Late corrections and restatements will have changed the data: the rerun won't match what was filed.",
        effects: { repro: "bad" },
      },
      {
        id: "tag",
        label: "Tag the table snapshot used for each filing, and keep it",
        verdict: "strong",
        consequence:
          "Time travel to the tag gives exactly the filed data. Set retention so tagged snapshots aren't expired, and agree with compliance how this meets erasure requests.",
        effects: { repro: "good" },
      },
      {
        id: "csv",
        label: "Export each filing's input data as CSV to an archive",
        verdict: "workable",
        consequence:
          "Reproducible, but it's another copy of personal data to secure, catalogue and eventually erase.",
        effects: { repro: "good", privacy: "meh" },
      },
    ],
  },
  {
    id: "privacy",
    title: "Member privacy",
    question: "How do analysts get data without seeing members' personal details?",
    options: [
      {
        id: "open",
        label: "Give analysts the silver tables; they're internal staff",
        verdict: "risky",
        consequence:
          "Every analyst can read names, phone numbers and account numbers. Internal isn't the same as need-to-know.",
        effects: { privacy: "bad" },
      },
      {
        id: "masks",
        label: "Column masks and row filters in the catalog; tokens instead of identities in gold",
        verdict: "strong",
        consequence:
          "One copy, governed in one place. Erasure means deleting in silver and bronze, then expiring old snapshots, except where retention rules say otherwise.",
        effects: { privacy: "good" },
      },
      {
        id: "anon-copy",
        label: "A nightly 'anonymised' copy for analysts",
        verdict: "workable",
        consequence:
          "A day stale, another pipeline to maintain, and it must be truly anonymised: hashed IDs the bank can reverse are still personal data.",
        effects: { privacy: "meh", ops: "meh" },
      },
    ],
  },
  {
    id: "upkeep",
    title: "Table upkeep",
    question: "Minute-by-minute commits create small files and snapshots. What's the plan?",
    options: [
      {
        id: "none",
        label: "Nothing for now; tune it later",
        verdict: "risky",
        consequence:
          "Within weeks, thousands of small files per day slow every query and inflate storage with old snapshots.",
        effects: { fast: "bad", cost: "bad" },
      },
      {
        id: "managed",
        label: "Automatic compaction and snapshot expiry (managed tables or daily jobs)",
        verdict: "strong",
        consequence:
          "Files stay near their target size and old snapshots are cleaned up, except tagged filing snapshots.",
        effects: { fast: "good", cost: "good" },
      },
      {
        id: "weekly",
        label: "A weekly compaction job",
        verdict: "workable",
        consequence:
          "Better than nothing, but a week of minute-level commits is ten thousand small commits; daily suits this load better.",
        effects: { fast: "meh", cost: "meh" },
      },
    ],
  },
];

export function requirementStatus(choices: Record<string, string>) {
  const out = {} as Record<ReqId, "met" | "risk" | "partial" | "open">;
  for (const r of REQUIREMENTS) {
    const relevant = DECISIONS.filter((d) => d.options.some((o) => o.effects[r.id]));
    const effects = relevant
      .map((d) => d.options.find((o) => o.id === choices[d.id])?.effects[r.id])
      .filter(Boolean) as Effect[];
    const decided = relevant.filter((d) => choices[d.id]);
    if (effects.includes("bad")) out[r.id] = "risk";
    else if (decided.length < relevant.length) out[r.id] = "open";
    else if (effects.includes("meh")) out[r.id] = "partial";
    else out[r.id] = "met";
  }
  return out;
}
