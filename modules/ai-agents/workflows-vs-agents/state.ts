import type { Pattern } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface FlowState {
  [key: string]: unknown;
  picks: Record<string, Pattern>;
  pattern: Pattern;
}

export const initialState: FlowState = { picks: {}, pattern: "chain" };
