/** Everything a learner can change in this module, saved for resume. */
export interface CompState {
  [key: string]: unknown;
  addons: number;
}

export const initialState: CompState = { addons: 1 };
