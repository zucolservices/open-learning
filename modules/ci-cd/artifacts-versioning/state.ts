import type { Mode } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ArtifactState {
  [key: string]: unknown;
  mode: Mode;
  frame: number;
  version: [number, number, number];
  lastBump: string;
}

export const initialState: ArtifactState = {
  mode: "rebuild",
  frame: 0,
  version: [2, 4, 1],
  lastBump: "",
};
