import type { Fix } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface AuthzState {
  [key: string]: unknown;
  picks: Record<string, Fix>;
  model: string;
}

export const initialState: AuthzState = { picks: {}, model: "rbac" };
