import type { CspStyle, Header } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface HdrState {
  [key: string]: unknown;
  on: Header[];
  reportOnly: boolean;
  cspStyle: CspStyle;
}

export const initialState: HdrState = { on: [], reportOnly: false, cspStyle: "allow" };
