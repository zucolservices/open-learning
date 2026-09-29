/** Everything a learner can change in this module, saved for resume. */
export interface EndToEndState {
  [key: string]: unknown;
  frame: number;
  q: number;
  closed: boolean;
  prompt: boolean;
}

export const initialState: EndToEndState = { frame: 0, q: 0, closed: false, prompt: false };
