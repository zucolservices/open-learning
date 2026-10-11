import { START, type Mode, type Sim } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface RouteState {
  [key: string]: unknown;
  mode: Mode;
  sim: Sim;
  tried: string[];
}

export const initialState: RouteState = { mode: "mpa", sim: START, tried: [] };
