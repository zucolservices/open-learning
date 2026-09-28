/** Everything a learner can change in this module, saved for resume. */
export interface PlansState {
  [key: string]: unknown;
  /** Release cadence in weeks (52 = once at the end). */
  every: number;
  /** Automated testing and deployment. */
  automated: boolean;
  /** Real-cases walkthrough frame. */
  frame: number;
}

export const initialState: PlansState = {
  every: 52,
  automated: false,
  frame: 0,
};
