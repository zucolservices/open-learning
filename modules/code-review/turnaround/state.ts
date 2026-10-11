import type { Mode, Size } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface TurnState {
  [key: string]: unknown;
  mode: Mode;
  size: Size;
  tried: string[];
}

export const initialState: TurnState = { mode: "daily", size: "large", tried: [] };
