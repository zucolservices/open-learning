import type { Engine } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface TungstenState {
  [key: string]: unknown;
  engine: Engine;
  runs: number;
  stage: 0 | 1 | 2;
  fallback: boolean;
}

export const initialState: TungstenState = {
  engine: "volcano",
  runs: 0,
  stage: 1,
  fallback: false,
};
