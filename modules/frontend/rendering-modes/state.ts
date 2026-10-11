import type { Mode } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface RenderState {
  [key: string]: unknown;
  mode: Mode;
  slow: boolean;
  tried: string[];
  streamed: boolean;
}

export const initialState: RenderState = { mode: "csr", slow: false, tried: [], streamed: false };
