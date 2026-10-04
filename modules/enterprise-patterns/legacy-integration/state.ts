import type { Path } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface LegacyState {
  [key: string]: unknown;
  path: Path;
  acl: boolean;
}

export const initialState: LegacyState = { path: "direct", acl: false };
