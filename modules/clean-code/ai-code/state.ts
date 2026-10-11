import type { Decision, Issue } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface AiState {
  [key: string]: unknown;
  item: number;
  issues: Record<string, Issue[]>;
  decisions: Record<string, Decision>;
}

export const initialState: AiState = { item: 0, issues: {}, decisions: {} };
