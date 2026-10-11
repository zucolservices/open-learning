/** Everything a learner can change in this module, saved for resume. */
export interface HttpState {
  [key: string]: unknown;
  picks: Record<string, number>;
  fw: string;
}

export const initialState: HttpState = { picks: {}, fw: "express" };
