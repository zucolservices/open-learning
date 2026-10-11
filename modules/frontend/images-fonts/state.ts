/** Everything a learner can change in this module, saved for resume. */
export interface ImgState {
  [key: string]: unknown;
  fixed: string[];
}

export const initialState: ImgState = { fixed: [] };
