import type { Fw } from "./frameworks";

/** Everything a learner can change in this module, saved for resume. */
export interface ScaleState {
  [key: string]: unknown;
  people: number;
  fw: Fw;
  part: string;
  split: "component" | "feature";
}

export const initialState: ScaleState = { people: 5, fw: "nexus", part: "", split: "component" };
