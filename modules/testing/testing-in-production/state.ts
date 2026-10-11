import type { Release } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ProdState {
  [key: string]: unknown;
  release: Release;
  stage: number;
  rolledBack: boolean;
  log: string[];
}

export const initialState: ProdState = { release: "B", stage: 0, rolledBack: false, log: [] };
