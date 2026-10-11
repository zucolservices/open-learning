import type { Approver, Choice } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface AiState {
  [key: string]: unknown;
  choices: Record<string, Choice>;
  approver: Approver | null;
}

export const initialState: AiState = { choices: {}, approver: null };
