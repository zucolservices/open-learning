import type { Critic } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ReflectState {
  [key: string]: unknown;
  critic: Critic;
  max: number;
}

export const initialState: ReflectState = { critic: "self", max: 4 };
