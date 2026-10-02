import type { Life } from "./model";

export type Flow = "gitflow" | "github" | "trunk";

/** Everything a learner can change in this module, saved for resume. */
export interface BranchState {
  [key: string]: unknown;
  frame: number;
  life: Life;
  flow: Flow;
}

export const initialState: BranchState = { frame: 0, life: 10, flow: "gitflow" };
