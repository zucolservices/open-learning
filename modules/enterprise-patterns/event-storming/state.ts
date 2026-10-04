import type { Layer } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface EsState {
  [key: string]: unknown;
  placed: number;
  layers: Layer[];
  miss: string;
}

export const initialState: EsState = { placed: 0, layers: [], miss: "" };
