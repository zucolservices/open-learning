import type { Fixes } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface FetchState extends Fixes {
  [key: string]: unknown;
}

export const initialState: FetchState = {
  abort: false,
  debounce: false,
  loading: false,
  errors: false,
  flaky: false,
};
