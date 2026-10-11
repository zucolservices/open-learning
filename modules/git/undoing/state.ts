import type { Cmd, Mode } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface UndoState {
  [key: string]: unknown;
  picks: Record<string, Cmd>;
  mode: Mode;
}

export const initialState: UndoState = { picks: {}, mode: "mixed" };
