import type { Algo } from "./sim";

/** Everything a learner can change in this module, saved for resume. */
export interface LbState {
  [key: string]: unknown;
  layer: "l4" | "l7";
  path: string;
  algo: Algo;
  slow: boolean;
  dead: boolean;
  passive: boolean;
  load: number;
  interval: number;
  threshold: number;
  topo: "single" | "pair" | "anycast";
}

export const initialState: LbState = {
  layer: "l4",
  path: "/menu",
  algo: "rr",
  slow: false,
  dead: false,
  passive: false,
  load: 1,
  interval: 2,
  threshold: 1,
  topo: "single",
};
