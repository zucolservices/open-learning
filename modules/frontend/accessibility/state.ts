/** Everything a learner can change in this module, saved for resume. */
export interface A11yState {
  [key: string]: unknown;
  fixed: string[];
  focus: number;
  heard: string[];
}

export const initialState: A11yState = { fixed: [], focus: -1, heard: [] };
