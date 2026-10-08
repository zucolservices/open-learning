/** Everything a learner can change in this module, saved for resume. */
export interface WhyState {
  [key: string]: unknown;
  at: number;
  regime: "old" | "new";
  incident: string;
}

export const initialState: WhyState = { at: 117, regime: "old", incident: "sita" };
