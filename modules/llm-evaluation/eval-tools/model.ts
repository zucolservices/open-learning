/** The evaluation tool landscape (as of Oct 2026). Examples, not endorsements. */

export type Cat = "bench" | "app" | "platform" | "cloud";

export const CATS: { id: Cat; name: string; job: string }[] = [
  { id: "bench", name: "Benchmark runners", job: "Score a model on standard public tests" },
  {
    id: "app",
    name: "App eval frameworks",
    job: "Test your own prompts, RAG and agents, often in CI",
  },
  {
    id: "platform",
    name: "Tracing and eval platforms",
    job: "Store traces, run judges on live traffic, manage datasets",
  },
  {
    id: "cloud",
    name: "Cloud evaluation services",
    job: "Evaluation inside the cloud you already use",
  },
];

export interface Tool {
  name: string;
  cat: Cat;
  licence: string;
  osi: boolean;
  note: string;
}

export const TOOLS: Tool[] = [
  { name: "lm-evaluation-harness", cat: "bench", licence: "MIT", osi: true, note: "EleutherAI" },
  {
    name: "HELM",
    cat: "bench",
    licence: "Apache 2.0",
    osi: true,
    note: "Stanford; maintenance mode since Jun 2026",
  },
  { name: "OpenCompass", cat: "bench", licence: "Apache 2.0", osi: true, note: "" },
  {
    name: "Inspect",
    cat: "app",
    licence: "MIT",
    osi: true,
    note: "UK AI Security Institute, with Meridian Labs",
  },
  {
    name: "promptfoo",
    cat: "app",
    licence: "MIT",
    osi: true,
    note: "Acquired by OpenAI (Mar 2026); still open source, multi-provider",
  },
  { name: "DeepEval", cat: "app", licence: "Apache 2.0", osi: true, note: "Confident AI" },
  { name: "Ragas", cat: "app", licence: "Apache 2.0", osi: true, note: "RAG-focused" },
  {
    name: "Langfuse",
    cat: "platform",
    licence: "MIT (except enterprise folders)",
    osi: true,
    note: "Part of ClickHouse since Jan 2026",
  },
  {
    name: "W&B Weave",
    cat: "platform",
    licence: "Apache 2.0",
    osi: true,
    note: "Weights & Biases, owned by CoreWeave",
  },
  {
    name: "Arize Phoenix",
    cat: "platform",
    licence: "Elastic License 2.0",
    osi: false,
    note: "Source-available, free to self-host",
  },
  { name: "LangSmith", cat: "platform", licence: "Commercial", osi: false, note: "" },
  { name: "Braintrust", cat: "platform", licence: "Commercial", osi: false, note: "" },
  {
    name: "MLflow 3",
    cat: "platform",
    licence: "Apache 2.0",
    osi: true,
    note: "Also managed on Databricks",
  },
  {
    name: "Amazon Bedrock evaluations",
    cat: "cloud",
    licence: "Cloud service",
    osi: false,
    note: "Includes LLM-as-a-judge",
  },
  {
    name: "Google Gen AI evaluation service",
    cat: "cloud",
    licence: "Cloud service",
    osi: false,
    note: "In Gemini Enterprise Agent Platform (formerly Vertex AI)",
  },
  {
    name: "Microsoft Foundry evaluations",
    cat: "cloud",
    licence: "Cloud service",
    osi: false,
    note: "Formerly Azure AI Foundry",
  },
];

export const NEEDS: { id: string; label: string; cat: Cat }[] = [
  { id: "compare", label: "Compare open models on standard tests", cat: "bench" },
  { id: "ci", label: "Test my prompts and RAG on every pull request", cat: "app" },
  { id: "prod", label: "Score production traces and keep datasets", cat: "platform" },
  { id: "cloud", label: "Stay inside our existing cloud account", cat: "cloud" },
];

export const CHANGES: [string, string][] = [
  ["May 2025", "CoreWeave completes its purchase of Weights & Biases (Weave)."],
  ["Sep 2025", "Humanloop shuts down; its team joins Anthropic."],
  ["Jan 2026", "Langfuse becomes part of ClickHouse."],
  ["Mar 2026", "OpenAI announces it will acquire promptfoo, which stays open source."],
  ["May 2026", "Cisco completes its acquisition of Galileo."],
  ["Jun 2026", "Stanford's HELM moves to maintenance mode."],
  ["Nov 2026", "OpenAI's hosted Evals platform is scheduled to shut down (30 Nov)."],
];
