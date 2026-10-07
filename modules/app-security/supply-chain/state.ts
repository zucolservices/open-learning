import type { Step } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ChainState {
  [key: string]: unknown;
  on: Step[];
  attack: number;
}

export const initialState: ChainState = { on: [], attack: 0 };
