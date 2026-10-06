/** Everything a learner can change in this module, saved for resume. */
export interface WhatState {
  [key: string]: unknown;
  mode: "rules" | "learned";
  rules: string[];
  n: number;
  kind: "supervised" | "unsupervised" | "reinforcement";
}

export const initialState: WhatState = {
  mode: "rules",
  rules: ["free"],
  n: 20,
  kind: "supervised",
};
