import type { Hand } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface HandsState {
  [key: string]: unknown;
  hand: Hand;
  sandbox: boolean;
  frame: number;
}

export const initialState: HandsState = { hand: "browser", sandbox: true, frame: 0 };
