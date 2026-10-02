/** Everything a learner can change in this module, saved for resume. */
export interface PmState {
  [key: string]: unknown;
  rewritten: string[];
  view: "root" | "factors";
}

export const initialState: PmState = { rewritten: [], view: "root" };
