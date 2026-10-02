import type { Base, Change } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ImageState {
  [key: string]: unknown;
  goodOrder: boolean;
  multi: boolean;
  base: Base;
  ignore: boolean;
  change: Change;
  frame: number;
}

export const initialState: ImageState = {
  goodOrder: false,
  multi: false,
  base: "full",
  ignore: false,
  change: "code",
  frame: 0,
};
