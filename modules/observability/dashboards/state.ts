/** Everything a learner can change in this module, saved for resume. */
export interface DashState {
  [key: string]: unknown;
  top: string[];
}

export const initialState: DashState = { top: ["cpu"] };
