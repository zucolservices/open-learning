/** Everything a learner can change in this module, saved for resume. */
export interface CriteriaState {
  [key: string]: unknown;
  picks: Record<string, string>;
  maxP95: number;
  maxCost: number;
}

export const initialState: CriteriaState = { picks: {}, maxP95: 1.5, maxCost: 2 };
