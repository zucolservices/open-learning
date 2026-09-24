import type { Mitigation, Policy } from "./sim";

/** Everything a learner can change in this module, saved for resume. */
export interface EvictionState {
  [key: string]: unknown;
  policy: Policy;
  capacity: number;
  scan: boolean;
  shift: boolean;
  mitigation: Mitigation;
  jitter: number;
  hotFix: "none" | "local" | "copies";
}

export const initialState: EvictionState = {
  policy: "lru",
  capacity: 1,
  scan: false,
  shift: false,
  mitigation: "none",
  jitter: 0,
  hotFix: "none",
};
