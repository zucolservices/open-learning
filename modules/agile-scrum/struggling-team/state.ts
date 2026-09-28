/** Everything a learner can change in this module, saved for resume. */
export interface CaseState {
  [key: string]: unknown;
  tab: string;
  clues: string[];
  changes: string[];
}

export const initialState: CaseState = { tab: "board", clues: [], changes: [] };
