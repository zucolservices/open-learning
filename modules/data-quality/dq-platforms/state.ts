/** Everything a learner can change in this module, saved for resume. */
export interface PlatState {
  [key: string]: unknown;
  job: string;
}

export const initialState: PlatState = { job: "rules" };
