/** Everything a learner can change in this module, saved for resume. */
export interface AnatomyState {
  [key: string]: unknown;
  frame: number;
  part: string;
}

export const initialState: AnatomyState = { frame: 0, part: "api" };
