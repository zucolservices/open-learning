import type { Token } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface DsState {
  [key: string]: unknown;
  map: Record<string, Token>;
  rebrand: boolean;
  approach: string;
}

export const initialState: DsState = { map: {}, rebrand: false, approach: "css" };
