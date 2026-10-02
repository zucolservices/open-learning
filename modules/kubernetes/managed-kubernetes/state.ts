/** Everything a learner can change in this module, saved for resume. */
export interface MkState {
  [key: string]: unknown;
  nodes: number;
  region: "us" | "mumbai";
  requestPct: number;
  extras: boolean;
}

export const initialState: MkState = { nodes: 3, region: "us", requestPct: 50, extras: false };
