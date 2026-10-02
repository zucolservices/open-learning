import type { Backend } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface OtelState {
  [key: string]: unknown;
  frame: number;
  backend: Backend;
  manual: boolean;
}

export const initialState: OtelState = { frame: 0, backend: "oss", manual: false };
