import type { Pick, Style } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ConflictState {
  [key: string]: unknown;
  pick: Pick | "";
  added: boolean;
  committed: boolean;
  style: Style;
}

export const initialState: ConflictState = {
  pick: "",
  added: false,
  committed: false,
  style: "merge",
};
