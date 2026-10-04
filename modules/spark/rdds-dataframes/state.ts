import type { Api } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface RddState {
  [key: string]: unknown;
  api: Api;
  lost: boolean;
}

export const initialState: RddState = { api: "rdd", lost: false };
