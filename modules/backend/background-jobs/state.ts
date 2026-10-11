import type { Opts } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface JobsState extends Opts {
  [key: string]: unknown;
}

export const initialState: JobsState = { queue: false, retry: false, dlq: false, idem: false };
