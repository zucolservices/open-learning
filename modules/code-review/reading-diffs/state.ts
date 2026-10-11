/** Everything a learner can change in this module, saved for resume. */
export interface ReadState {
  [key: string]: unknown;
  order: string[];
  description: boolean;
}

export const initialState: ReadState = { order: [], description: false };
