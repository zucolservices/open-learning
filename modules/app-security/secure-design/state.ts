import type { Layer } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface DesignState {
  [key: string]: unknown;
  on: Layer[];
  principle: number;
  failMode: "open" | "closed";
}

export const initialState: DesignState = { on: [], principle: 0, failMode: "open" };
