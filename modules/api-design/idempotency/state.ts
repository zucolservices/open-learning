import type { Failure } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface IdemState {
  [key: string]: unknown;
  failure: Failure;
  key: boolean;
}

export const initialState: IdemState = { failure: "response", key: false };
