import type { Mistake } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface OauthState {
  [key: string]: unknown;
  step: number;
  mistake: Mistake | null;
  token: "id" | "access";
}

export const initialState: OauthState = { step: 0, mistake: null, token: "id" };
