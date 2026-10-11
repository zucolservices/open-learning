import type { Repo } from "../_shared/repo";
import type { Shape } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface MergeState {
  [key: string]: unknown;
  shape: Shape;
  noFf: boolean;
  merged: Repo | null;
  kind: string;
  line: number;
}

export const initialState: MergeState = {
  shape: "ff",
  noFf: false,
  merged: null,
  kind: "",
  line: -1,
};
