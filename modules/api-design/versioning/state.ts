import type { Where } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface VerState {
  [key: string]: unknown;
  where: Record<string, Where>;
}

export const initialState: VerState = { where: {} };
