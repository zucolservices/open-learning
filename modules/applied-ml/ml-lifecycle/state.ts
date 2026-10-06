/** Everything a learner can change in this module, saved for resume. */
export interface LifecycleState {
  [key: string]: unknown;
  step: number;
}

export const initialState: LifecycleState = { step: 0 };
