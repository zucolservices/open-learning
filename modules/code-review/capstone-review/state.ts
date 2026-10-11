import type { Verdict } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface CapState {
  [key: string]: unknown;
  order: string[];
  comments: Record<string, string>;
  line: number | null;
  replies: Record<string, string>;
  verdict: Verdict | null;
}

export const initialState: CapState = {
  order: [],
  comments: {},
  line: null,
  replies: {},
  verdict: null,
};
