import type { Tab } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface UiState {
  [key: string]: unknown;
  tab: Tab;
  stage: number;
}

export const initialState: UiState = { tab: "jobs", stage: 1 };
