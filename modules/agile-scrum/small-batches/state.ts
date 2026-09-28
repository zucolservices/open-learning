import type { Interval } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface BatchState {
  [key: string]: unknown;
  merge: "end" | "daily";
  integrate: Interval;
  release: Interval;
  auto: boolean;
  frame: number;
}

export const initialState: BatchState = {
  merge: "end",
  integrate: 1,
  release: 10,
  auto: false,
  frame: 0,
};
