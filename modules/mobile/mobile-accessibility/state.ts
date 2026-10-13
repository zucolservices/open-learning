/** Everything a learner can change in this module, saved for resume. */
export interface A11yState {
  [key: string]: unknown;
  fixes: string[];
  focus: number;
  scale: number;
}

export const initialState: A11yState = { fixes: [], focus: 0, scale: 100 };
