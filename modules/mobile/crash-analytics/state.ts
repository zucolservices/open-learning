/** Everything a learner can change in this module, saved for resume. */
export interface CrashState {
  [key: string]: unknown;
  order: string[];
  attach: string[];
}

export const initialState: CrashState = { order: [], attach: [] };
