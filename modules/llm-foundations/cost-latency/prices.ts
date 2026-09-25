/**
 * List prices in US dollars per million tokens, September 2026 (provider pricing pages).
 * `cached` is the price of input served from the prompt cache. Cache-write surcharges,
 * long-context surcharges and regional differences are left out.
 */
export interface Price {
  id: string;
  provider: string;
  name: string;
  input: number;
  output: number;
  cached: number;
  /** Label for the provider's 50% discount (batch API or off-peak hours). */
  discount: string;
}

export const PRICES: Price[] = [
  {
    id: "fable",
    provider: "Anthropic",
    name: "Claude Fable 5.1",
    input: 10,
    output: 50,
    cached: 0.25,
    discount: "Batch API",
  },
  {
    id: "opus",
    provider: "Anthropic",
    name: "Claude Opus 5.5",
    input: 4,
    output: 20,
    cached: 0.2,
    discount: "Batch API",
  },
  {
    id: "sonnet",
    provider: "Anthropic",
    name: "Claude Sonnet 5",
    input: 2,
    output: 10,
    cached: 0.2,
    discount: "Batch API",
  },
  {
    id: "haiku",
    provider: "Anthropic",
    name: "Claude Haiku 4.5",
    input: 1,
    output: 5,
    cached: 0.1,
    discount: "Batch API",
  },
  {
    id: "astra",
    provider: "OpenAI",
    name: "gpt-6-astra",
    input: 10,
    output: 50,
    cached: 1,
    discount: "Batch API",
  },
  {
    id: "sol",
    provider: "OpenAI",
    name: "gpt-6-sol",
    input: 2,
    output: 10,
    cached: 0.2,
    discount: "Batch API",
  },
  {
    id: "luna",
    provider: "OpenAI",
    name: "gpt-6-luna",
    input: 0.1,
    output: 0.5,
    cached: 0.01,
    discount: "Batch API",
  },
  {
    id: "gpro",
    provider: "Google",
    name: "Gemini 3.1 Pro (preview)",
    input: 2,
    output: 12,
    cached: 0.2,
    discount: "Batch API",
  },
  {
    id: "gflash",
    provider: "Google",
    name: "Gemini 3.8 Flash",
    input: 0.75,
    output: 3.75,
    cached: 0.075,
    discount: "Batch API",
  },
  {
    id: "glite",
    provider: "Google",
    name: "Gemini 3.5 Flash-Lite",
    input: 0.3,
    output: 2.5,
    cached: 0.03,
    discount: "Batch API",
  },
  {
    id: "dspro",
    provider: "DeepSeek",
    name: "DeepSeek V4 Pro",
    input: 1.32,
    output: 3.96,
    cached: 0.044,
    discount: "Off-peak hours",
  },
  {
    id: "dsflash",
    provider: "DeepSeek",
    name: "DeepSeek Flash",
    input: 0.3,
    output: 1.2,
    cached: 0.006,
    discount: "Off-peak hours",
  },
];

export interface Workload {
  requests: number; // per day
  input: number; // tokens per request
  output: number; // tokens per request
  cachedShare: number; // 0..1 of input served from cache
  discounted: boolean;
}

export function monthly(p: Price, w: Workload) {
  const perReqIn = (w.input * ((1 - w.cachedShare) * p.input + w.cachedShare * p.cached)) / 1e6;
  const perReqOut = (w.output * p.output) / 1e6;
  const k = w.discounted ? 0.5 : 1;
  const day = (perReqIn + perReqOut) * w.requests * k;
  return {
    perRequest: (perReqIn + perReqOut) * k,
    inputShare: perReqIn / (perReqIn + perReqOut),
    month: day * 30,
    tokensPerMonth: (w.input + w.output) * w.requests * 30,
  };
}
