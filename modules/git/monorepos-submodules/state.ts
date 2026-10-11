import type { Shape } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface MonoState {
  [key: string]: unknown;
  shape: Shape;
  step: number;
  sub: "bump" | "forgot";
}

export const initialState: MonoState = { shape: "poly", step: 0, sub: "bump" };
