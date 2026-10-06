import type { Eco } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ToolsState {
  [key: string]: unknown;
  stage: number;
  eco: Eco;
  team: number;
}

export const initialState: ToolsState = { stage: 1, eco: "oss", team: 0 };
