/** Everything a learner can change in this module, saved for resume. */
export interface EnsState {
  [key: string]: unknown;
  method: "single" | "forest" | "boost";
  n: number;
}

export const initialState: EnsState = { method: "single", n: 1 };
