/** Everything a learner can change in this module, saved for resume. */
export interface SttState {
  [key: string]: unknown;
  clip: string;
  hyp: string;
  frame: number;
}

export const initialState: SttState = {
  clip: "noisy",
  hyp: "please look a table for to at seven",
  frame: 4,
};
