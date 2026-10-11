/** Everything a learner can change in this module, saved for resume. */
export interface ExploreState {
  [key: string]: unknown;
  charter: string;
  used: Record<string, string[]>;
}

export const initialState: ExploreState = { charter: "dates", used: {} };
