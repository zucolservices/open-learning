import type { ClauseId } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ProcState {
  [key: string]: unknown;
  clauses: ClauseId[];
  event: string;
}

export const initialState: ProcState = { clauses: ["contract", "security"], event: "support" };
