/** What each kind of model gives you (checked Sep 2026 against licences and model cards). */

export type Mark = "yes" | "no" | "partly";

export interface Family {
  id: string;
  name: string;
  examples: string;
  licence: string;
  rows: Record<"weights" | "commercial" | "modify" | "data" | "code", [Mark, string]>;
}

export const FAMILIES: Family[] = [
  {
    id: "closed",
    name: "Closed (API only)",
    examples: "OpenAI GPT, Anthropic Claude, Google Gemini",
    licence: "Provider's terms of service",
    rows: {
      weights: ["no", "Only reachable through the maker's API or a cloud platform."],
      commercial: ["yes", "Under the provider's terms and usage policies."],
      modify: ["partly", "Some offer fine-tuning as a service; you never hold the weights."],
      data: ["no", "Training data isn't published."],
      code: ["no", "Training code isn't published."],
    },
  },
  {
    id: "llama",
    name: "Llama 4 (Meta)",
    examples: "Llama 4 Scout and Maverick, April 2025",
    licence: "Llama 4 Community License",
    rows: {
      weights: ["yes", "Downloadable after accepting the licence."],
      commercial: [
        "partly",
        "Allowed, but companies with over 700 million monthly users at release need Meta's permission, and the Acceptable Use Policy applies.",
      ],
      modify: [
        "partly",
        "Fine-tuning allowed; you must show “Built with Llama” and derived model names must start with “Llama”.",
      ],
      data: ["no", "Training data isn't published."],
      code: ["partly", "Inference code is published; the full training pipeline isn't."],
    },
  },
  {
    id: "permissive",
    name: "Permissive open weights",
    examples: "OpenAI gpt-oss, DeepSeek V4, Mistral Large 3, Google Gemma 4",
    licence: "Apache 2.0 or MIT",
    rows: {
      weights: ["yes", "Downloadable from Hugging Face and elsewhere."],
      commercial: ["yes", "Standard open-source licences with few conditions."],
      modify: ["yes", "Fine-tune, quantize, redistribute."],
      data: ["no", "Training data isn't published."],
      code: ["partly", "Inference code, not the full training pipeline."],
    },
  },
  {
    id: "olmo",
    name: "Fully open",
    examples: "Ai2 OLMo 3 (Nov 2025), EleutherAI Pythia",
    licence: "Apache 2.0 for weights, data and code",
    rows: {
      weights: ["yes", "Downloadable, including intermediate checkpoints."],
      commercial: ["yes", "Apache 2.0."],
      modify: ["yes", "Everything, including retraining from scratch."],
      data: ["yes", "The training data (Dolma 3 for OLMo 3) is published."],
      code: ["yes", "Training and evaluation code is published."],
    },
  },
];

export const ROWS: [keyof Family["rows"], string][] = [
  ["weights", "Download the weights"],
  ["commercial", "Use commercially"],
  ["modify", "Modify and fine-tune"],
  ["data", "See the training data"],
  ["code", "See the training code"],
];

export interface Option {
  id: string;
  name: string;
  detail: string;
}

export const OPTIONS: Option[] = [
  { id: "api", name: "Model maker's API", detail: "OpenAI, Anthropic, Google, Mistral, DeepSeek…" },
  {
    id: "cloud",
    name: "Your cloud's AI platform",
    detail: "Amazon Bedrock, Google's Gemini Enterprise Agent Platform, Microsoft Foundry",
  },
  { id: "gpus", name: "Your own GPUs", detail: "Open weights on rented or on-premises servers" },
  { id: "device", name: "On the device", detail: "A small open model on a laptop or phone" },
];

export interface Requirement {
  id: string;
  label: string;
  marks: Record<string, [Mark, string]>;
}

export const REQUIREMENTS: Requirement[] = [
  {
    id: "quality",
    label: "Best possible quality",
    marks: {
      api: ["yes", "Frontier models are here first."],
      cloud: ["yes", "The major clouds also host many frontier models, often soon after release."],
      gpus: [
        "partly",
        "The best open models trail the best closed ones by a few months (Epoch AI, 2026).",
      ],
      device: ["no", "Small models can't match frontier quality on hard tasks."],
    },
  },
  {
    id: "india",
    label: "Data must be processed in India",
    marks: {
      api: [
        "partly",
        "Depends on the provider offering in-country processing: check the contract.",
      ],
      cloud: [
        "partly",
        "Some models have in-country endpoints (e.g. OpenAI models on Bedrock in Mumbai and Hyderabad since Aug 2026); check each model.",
      ],
      gpus: ["yes", "You choose the data centre."],
      device: ["yes", "Nothing leaves the device."],
    },
  },
  {
    id: "network",
    label: "No data may leave our own network",
    marks: {
      api: ["no", "Requests go to the provider."],
      cloud: [
        "no",
        "Private networking helps, but the model runs in the cloud provider's service.",
      ],
      gpus: ["yes", "On-premises servers with open weights keep everything inside."],
      device: ["yes", "Runs locally."],
    },
  },
  {
    id: "weights",
    label: "We must change the model's weights",
    marks: {
      api: ["partly", "Some offer managed fine-tuning, with limits; you never hold the result."],
      cloud: ["partly", "Managed fine-tuning for some models."],
      gpus: ["yes", "Full control, if the licence allows it."],
      device: ["yes", "Small models are easy to fine-tune."],
    },
  },
  {
    id: "noops",
    label: "Small team, no one to run GPUs",
    marks: {
      api: ["yes", "Nothing to operate."],
      cloud: ["yes", "Managed, inside your existing cloud account and billing."],
      gpus: ["no", "Serving, scaling, patching and monitoring are now your job."],
      device: ["partly", "No servers, but you ship and update models inside an app."],
    },
  },
  {
    id: "volume",
    label: "Huge, steady volume at the lowest unit cost",
    marks: {
      api: ["partly", "Simple, but you pay the provider's margin on every token."],
      cloud: ["partly", "Similar prices; committed-use discounts help."],
      gpus: ["yes", "Cheapest per token when GPUs stay busy (previous module)."],
      device: ["partly", "Free per request, but only small models and small jobs."],
    },
  },
  {
    id: "offline",
    label: "Must work without internet",
    marks: {
      api: ["no", "Needs a connection."],
      cloud: ["no", "Needs a connection."],
      gpus: ["partly", "On-premises works inside a closed network."],
      device: ["yes", "Works offline."],
    },
  },
];
