/** Everything a learner can change in this module, saved for resume. */
export interface PayloadState {
  [key: string]: unknown;
  fixed: string[];
  open: string | null;
}

export const initialState: PayloadState = { fixed: [], open: null };
