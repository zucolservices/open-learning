import type { Pattern, Shape } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface NoState {
  [key: string]: unknown;
  shape: Shape;
  pattern: Pattern;
  rel: string;
}

export const initialState: NoState = { shape: "rel", pattern: "order", rel: "lines" };
