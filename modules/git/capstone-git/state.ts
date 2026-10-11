import type { Find, Fix, Guard, Kind } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface CapState {
  [key: string]: unknown;
  find: Find | null;
  fix: Fix | null;
  kinds: Record<string, Kind>;
  guards: Guard[];
}

export const initialState: CapState = { find: null, fix: null, kinds: {}, guards: [] };
