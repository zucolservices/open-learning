/** Everything a learner can change in this module, saved for resume. */
export interface ToolsState {
  [key: string]: unknown;
  lookup: number;
  preamble: boolean;
  confirm: boolean;
  waitResult: boolean;
  fails: boolean;
}

export const initialState: ToolsState = {
  lookup: 3,
  preamble: false,
  confirm: false,
  waitResult: false,
  fails: false,
};
