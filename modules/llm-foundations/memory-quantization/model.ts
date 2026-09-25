/** GPU memory estimate: weights + KV cache + a runtime overhead. */

export interface ModelSpec {
  id: string;
  name: string;
  /** Total parameters (all experts). */
  params: number;
  /** Parameters used per token (mixture-of-experts models use a fraction). */
  active: number;
  /** KV cache bytes per token at 16-bit. */
  kvBytes: number;
  note?: string;
}

const kv = (layers: number, kvHeads: number, headDim: number) => 2 * layers * kvHeads * headDim * 2;

export const MODELS: ModelSpec[] = [
  { id: "qwen1.5", name: "Qwen2.5 1.5B", params: 1.54e9, active: 1.54e9, kvBytes: kv(28, 2, 128) },
  { id: "llama8", name: "Llama 3.1 8B", params: 8.03e9, active: 8.03e9, kvBytes: kv(32, 8, 128) },
  { id: "llama70", name: "Llama 3.1 70B", params: 70.6e9, active: 70.6e9, kvBytes: kv(80, 8, 128) },
  {
    id: "llama405",
    name: "Llama 3.1 405B",
    params: 405e9,
    active: 405e9,
    kvBytes: kv(126, 8, 128),
  },
  {
    id: "mixtral",
    name: "Mixtral 8x7B (MoE)",
    params: 46.7e9,
    active: 12.9e9,
    kvBytes: kv(32, 8, 128),
    note: "8 experts per layer, 2 used per token",
  },
  {
    id: "dsv3",
    name: "DeepSeek-V3 (MoE)",
    params: 671e9,
    active: 37e9,
    // Multi-head latent attention: a 512-dim latent + 64-dim rotary key per layer, 61 layers.
    kvBytes: (512 + 64) * 61 * 2,
    note: "256 routed experts per layer, 8 used per token",
  },
];

export const PRECISIONS = [
  { id: "16", label: "16-bit (BF16)", bytes: 2 },
  { id: "8", label: "8-bit (FP8/INT8)", bytes: 1 },
  { id: "4", label: "4-bit", bytes: 0.5 },
] as const;

export const GPUS = [
  { id: "5090", name: "RTX 5090", memoryGB: 32, bandwidthTBs: 1.79 },
  { id: "h100", name: "H100", memoryGB: 80, bandwidthTBs: 3.35 },
  { id: "h200", name: "H200", memoryGB: 141, bandwidthTBs: 4.8 },
  { id: "mi300x", name: "MI300X", memoryGB: 192, bandwidthTBs: 5.3 },
] as const;

/** 4-bit formats store a scale per small group of weights, so they cost a little more than 4 bits. */
export const bytesPerParam = (bits: string) =>
  bits === "4" ? 0.5 * (4.5 / 4) : bits === "8" ? 1 : 2;

export function memory(m: ModelSpec, bits: string, context: number, users: number) {
  const weights = m.params * bytesPerParam(bits);
  const cache = m.kvBytes * context * users;
  const overhead = 0.1 * (weights + cache);
  return { weights, cache, overhead, total: weights + cache + overhead };
}
