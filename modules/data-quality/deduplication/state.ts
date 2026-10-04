import type { Rule, SRule } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface DedupState {
  [key: string]: unknown;
  rule: Rule;
  lo: number;
  hi: number;
  survive: Record<string, SRule>;
}

export const initialState: DedupState = { rule: "email", lo: 4, hi: 12, survive: {} };
