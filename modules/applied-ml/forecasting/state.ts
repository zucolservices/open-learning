import type { Method } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ForecastState {
  [key: string]: unknown;
  method: Method;
  split: "random" | "rolling";
}

export const initialState: ForecastState = { method: "naive", split: "random" };
