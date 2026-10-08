import type { Flag } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface CompareState {
  [key: string]: unknown;
  topic: string;
  flags: Flag[];
}

export const initialState: CompareState = { topic: "bases", flags: ["payments", "lending"] };
