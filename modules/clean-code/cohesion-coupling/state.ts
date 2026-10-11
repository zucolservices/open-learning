import { START } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface CohesionState {
  [key: string]: unknown;
  layout: Record<string, string>;
}

export const initialState: CohesionState = { layout: { ...START } };
