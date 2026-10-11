import type { ChangeId } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface UiState {
  [key: string]: unknown;
  changes: ChangeId[];
  visualBug: boolean;
  baseline: "old" | "new";
}

export const initialState: UiState = { changes: [], visualBug: false, baseline: "old" };
