import type { Col } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ProfState {
  [key: string]: unknown;
  col: Col;
  decisions: Record<string, boolean>;
  suggested: boolean;
}

export const initialState: ProfState = { col: "price", decisions: {}, suggested: false };
