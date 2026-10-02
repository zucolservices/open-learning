/** Everything a learner can change in this module, saved for resume. */
export interface GwState {
  [key: string]: unknown;
  mode: "ingress" | "gateway";
  request: number;
  canary: number; // % to v2
}

export const initialState: GwState = { mode: "ingress", request: 0, canary: 10 };
