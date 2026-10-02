export type Signal = "metric" | "log" | "trace";

/** Everything a learner can change in this module, saved for resume. */
export interface SignalsState {
  [key: string]: unknown;
  signal: Signal;
  rps: number;
}

export const initialState: SignalsState = { signal: "metric", rps: 10 };
