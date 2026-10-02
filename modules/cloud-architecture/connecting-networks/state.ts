/** Everything a learner can change in this module, saved for resume. */
export interface ConnectState {
  [key: string]: unknown;
  n: number;
  topo: "mesh" | "hub";
  gb: number;
}

export const initialState: ConnectState = { n: 6, topo: "mesh", gb: 500 };
