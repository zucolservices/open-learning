/** Everything a learner can change in this module, saved for resume. */
export interface CostState {
  [key: string]: unknown;
  preset: string;
  model: string;
  requests: number;
  input: number;
  output: number;
  cachedShare: number;
  discounted: boolean;
  /** Latency budget. */
  ttft: number;
  speed: number;
  answer: number;
  /** Self-hosting. */
  gpuPrice: number;
  gpuTps: number;
  utilisation: number;
}

export const initialState: CostState = {
  preset: "support",
  model: "sonnet",
  requests: 300_000,
  input: 3_000,
  output: 250,
  cachedShare: 0,
  discounted: false,
  ttft: 0.6,
  speed: 80,
  answer: 250,
  gpuPrice: 3.25,
  gpuTps: 1_500,
  utilisation: 0.4,
};
