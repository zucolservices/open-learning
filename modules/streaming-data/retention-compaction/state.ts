export type Policy = "time" | "size" | "compact" | "both";

/** Everything a learner can change in this module, saved for resume. */
export interface RetState {
  [key: string]: unknown;
  policy: Policy;
  day: number;
  tb: number;
  localDays: number;
}

export const initialState: RetState = { policy: "time", day: 6, tb: 10, localDays: 1 };
