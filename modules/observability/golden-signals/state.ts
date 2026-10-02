/** Everything a learner can change in this module, saved for resume. */
export interface GoldenState {
  [key: string]: unknown;
  case: string;
  picks: Record<string, string>;
}

export const initialState: GoldenState = { case: "orders", picks: {} };
