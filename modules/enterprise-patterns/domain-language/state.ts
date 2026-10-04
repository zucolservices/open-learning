import type { Dept } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface LangState {
  [key: string]: unknown;
  picked: Dept[];
}

export const initialState: LangState = { picked: ["sales"] };
