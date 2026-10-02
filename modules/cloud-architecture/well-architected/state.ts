/** Everything a learner can change in this module, saved for resume. */
export interface WaState {
  [key: string]: unknown;
  found: string[];
  change: string;
}

export const initialState: WaState = { found: [], change: "zones" };
