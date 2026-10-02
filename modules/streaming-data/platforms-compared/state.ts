/** Everything a learner can change in this module, saved for resume. */
export interface PlatState {
  [key: string]: unknown;
  pick: string;
}

export const initialState: PlatState = { pick: "kafka" };
