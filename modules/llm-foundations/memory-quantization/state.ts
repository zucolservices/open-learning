/** Everything a learner can change in this module, saved for resume. */
export interface MemState {
  [key: string]: unknown;
  /** Rounding demo: bits per weight. */
  bits: number;
  /** Memory calculator. */
  model: string;
  precision: string;
  gpu: string;
  context: number;
  users: number;
  /** Quality sweep: which generated sample is shown. */
  gen: number;
  /** Mixture-of-experts walkthrough frame. */
  moe: number;
}

export const initialState: MemState = {
  bits: 8,
  model: "llama70",
  precision: "16",
  gpu: "h100",
  context: 8_000,
  users: 1,
  gen: 0,
  moe: 0,
};
