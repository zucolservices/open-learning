import type { Backend } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface IntegrationState {
  [key: string]: unknown;
  backend: Backend | null;
  tried: Backend[];
}

export const initialState: IntegrationState = { backend: null, tried: [] };
