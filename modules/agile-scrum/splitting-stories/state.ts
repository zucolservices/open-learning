/** Everything a learner can change in this module, saved for resume. */
export interface SplitState {
  [key: string]: unknown;
  cut: "none" | "horizontal" | "vertical";
  applied: string[];
}

export const initialState: SplitState = { cut: "none", applied: [] };
