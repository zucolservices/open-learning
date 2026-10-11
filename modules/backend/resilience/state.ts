import type { Retry } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ResState {
  [key: string]: unknown;
  timeout: boolean;
  retry: Retry;
  breaker: boolean;
  fallback: boolean;
}

export const initialState: ResState = {
  timeout: false,
  retry: "none",
  breaker: false,
  fallback: false,
};
