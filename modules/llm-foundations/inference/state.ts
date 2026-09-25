/** Everything a learner can change in this module, saved for resume. */
export interface InferState {
  [key: string]: unknown;
  /** Two-phases walkthrough frame. */
  phase: number;
  /** Timeline simulator settings. */
  model: string;
  gpu: string;
  prompt: number;
  answer: number;
  /** KV-cache walkthrough frame. */
  kv: number;
}

export const initialState: InferState = {
  phase: 0,
  model: "8b",
  gpu: "h100",
  prompt: 2_000,
  answer: 300,
  kv: 0,
};
