/** Everything a learner can change in this module, saved for resume. */
export interface RespState {
  [key: string]: unknown;
  width: number;
  fixed: string[];
}

export const initialState: RespState = { width: 320, fixed: [] };
