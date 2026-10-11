import type { Ttl } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface CacheState {
  [key: string]: unknown;
  ttl: Ttl;
  invalidate: boolean;
  coalesce: boolean;
}

export const initialState: CacheState = { ttl: "none", invalidate: false, coalesce: false };
