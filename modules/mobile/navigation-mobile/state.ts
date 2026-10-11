import { START, type Nav } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface NavState {
  [key: string]: unknown;
  nav: Nav;
  perTab: boolean;
  synth: boolean;
}

export const initialState: NavState = { nav: START, perTab: false, synth: false };
