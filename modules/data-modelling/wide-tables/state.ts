import type { Shape, Store } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface WideState {
  [key: string]: unknown;
  shape: Shape;
  store: Store;
  width: number;
  nested: boolean;
}

export const initialState: WideState = { shape: "obt", store: "row", width: 1, nested: true };
