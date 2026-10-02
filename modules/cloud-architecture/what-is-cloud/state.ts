/** Everything a learner can change in this module, saved for resume. */
export interface WhatIsCloudState {
  [key: string]: unknown;
  model: "onprem" | "iaas" | "paas" | "saas";
  workload: "results" | "payroll" | "steady";
  servers: number;
}

export const initialState: WhatIsCloudState = { model: "onprem", workload: "results", servers: 4 };
