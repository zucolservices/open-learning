/** Everything a learner can change in this module, saved for resume. */
export interface PickState {
  [key: string]: unknown;
  frame: number;
  choice: string;
}

export const initialState: PickState = { frame: 0, choice: "" };
