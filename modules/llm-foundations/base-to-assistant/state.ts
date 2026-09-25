/** Everything a learner can change in this module, saved for resume. */
export interface AssistState {
  [key: string]: unknown;
  prompt: number;
  sftFrame: number;
  rank: number;
}

export const initialState: AssistState = { prompt: 0, sftFrame: 0, rank: 8 };
