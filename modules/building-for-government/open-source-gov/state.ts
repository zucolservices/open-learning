/** Everything a learner can change in this module, saved for resume. */
export interface OssState {
  [key: string]: unknown;
  route: string;
  year: number;
}

export const initialState: OssState = { route: "", year: 0 };
