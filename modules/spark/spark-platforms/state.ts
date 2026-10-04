import type { Cloud, Model } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface PlatState {
  [key: string]: unknown;
  model: Model;
  cloud: Cloud;
  mgr: number;
}

export const initialState: PlatState = { model: "managed", cloud: "aws", mgr: 3 };
