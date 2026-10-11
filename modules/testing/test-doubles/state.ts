import type { Kind } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface DoublesState {
  [key: string]: unknown;
  kind: Kind;
  seen: Kind[];
}

export const initialState: DoublesState = { kind: "real", seen: ["real"] };
