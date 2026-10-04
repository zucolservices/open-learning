/** Everything a learner can change in this module, saved for resume. */
export interface ToolState {
  [key: string]: unknown;
  fixed: string[];
  open: string;
}

export const initialState: ToolState = { fixed: [], open: "name" };
