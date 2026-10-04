/** Everything a learner can change in this module, saved for resume. */
export interface WhyState {
  [key: string]: unknown;
  flawed: number;
  stage: string;
  use: number;
}

export const initialState: WhyState = { flawed: 11, stage: "entry", use: 0 };
