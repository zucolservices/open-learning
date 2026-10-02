/** Everything a learner can change in this module, saved for resume. */
export interface ProfState {
  [key: string]: unknown;
  pick: string;
}

export const initialState: ProfState = { pick: "" };
