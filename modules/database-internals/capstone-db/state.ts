/** Everything a learner can change in this module, saved for resume. */
export interface CapState {
  [key: string]: unknown;
  current: number;
  solved: string[];
  /** Options tried, as "caseId:optionId". */
  tried: string[];
}

export const initialState: CapState = { current: 0, solved: [], tried: [] };
