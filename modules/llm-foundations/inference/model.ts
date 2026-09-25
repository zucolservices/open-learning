/**
 * Back-of-envelope inference timing for one request on one GPU (batch of 1).
 * Prefill is limited by compute, decode by memory bandwidth. Real systems land
 * below these ideal numbers; the efficiency factors are typical, not measured.
 */

export interface Gpu {
  id: string;
  name: string;
  memoryGB: number;
  bandwidthTBs: number;
  /** Dense tensor TFLOPS at the precision the model runs in. */
  tflops: { bf16: number; fp8: number };
}

export const GPUS: Gpu[] = [
  {
    id: "h100",
    name: "H100 SXM",
    memoryGB: 80,
    bandwidthTBs: 3.35,
    tflops: { bf16: 989, fp8: 1979 },
  },
  { id: "h200", name: "H200", memoryGB: 141, bandwidthTBs: 4.8, tflops: { bf16: 989, fp8: 1979 } },
  { id: "b200", name: "B200", memoryGB: 180, bandwidthTBs: 8, tflops: { bf16: 2250, fp8: 4500 } },
];

export interface LlmSpec {
  id: string;
  name: string;
  params: number;
  bytesPerParam: number;
  precision: "bf16" | "fp8";
  layers: number;
  kvHeads: number;
  headDim: number;
}

export const MODELS: LlmSpec[] = [
  {
    id: "8b",
    name: "Llama 3.1 8B (BF16)",
    params: 8.03e9,
    bytesPerParam: 2,
    precision: "bf16",
    layers: 32,
    kvHeads: 8,
    headDim: 128,
  },
  {
    id: "70b",
    name: "Llama 3.1 70B (FP8)",
    params: 70.6e9,
    bytesPerParam: 1,
    precision: "fp8",
    layers: 80,
    kvHeads: 8,
    headDim: 128,
  },
];

/** Share of peak a well-tuned engine typically reaches (assumptions). */
export const MFU = 0.5;
export const MBU = 0.7;

/** KV cache bytes per token: keys and values, every layer, BF16. */
export const kvBytesPerToken = (m: LlmSpec) => 2 * m.layers * m.kvHeads * m.headDim * 2;

export function timing(m: LlmSpec, g: Gpu, prompt: number, answer: number) {
  const weights = m.params * m.bytesPerParam;
  const flops = g.tflops[m.precision] * 1e12 * MFU;
  const prefill = (2 * m.params * prompt) / flops;
  const bw = g.bandwidthTBs * 1e12 * MBU;
  const kv = kvBytesPerToken(m);
  const tpotAt = (ctx: number) => (weights + kv * ctx) / bw;
  const firstTpot = tpotAt(prompt);
  const lastTpot = tpotAt(prompt + answer);
  const decode = (answer * (firstTpot + lastTpot)) / 2;
  const fits = weights + kv * (prompt + answer) < g.memoryGB * 1e9 * 0.9;
  return {
    weightsGB: weights / 1e9,
    ttft: prefill + firstTpot,
    prefill,
    tpot: (firstTpot + lastTpot) / 2,
    decode,
    total: prefill + decode,
    fits,
    ideal: (g.bandwidthTBs * 1e12) / weights,
  };
}
