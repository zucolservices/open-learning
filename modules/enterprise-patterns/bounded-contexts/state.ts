import type { Ctx } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface BcState {
  [key: string]: unknown;
  placed: Record<string, Ctx>;
}

export const initialState: BcState = { placed: {} };
