export type Strategy = "backup" | "pilot" | "warm" | "active";
export type Target = "wiki" | "portal" | "exchange" | "payments";

/** Everything a learner can change in this module, saved for resume. */
export interface DrState {
  [key: string]: unknown;
  lastCopy: number;
  recovery: number;
  strategy: Strategy;
  target: Target;
  failed: boolean;
  availability: number;
  chain: number;
  copies: number;
}

export const initialState: DrState = {
  lastCopy: 60,
  recovery: 120,
  strategy: "backup",
  target: "portal",
  failed: false,
  availability: 99.9,
  chain: 3,
  copies: 1,
};
