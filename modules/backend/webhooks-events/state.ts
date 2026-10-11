/** Everything a learner can change in this module, saved for resume. */
export interface HookState {
  [key: string]: unknown;
  on: string[];
}

export const initialState: HookState = { on: [] };
