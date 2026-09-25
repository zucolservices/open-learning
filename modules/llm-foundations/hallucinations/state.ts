/** Everything a learner can change in this module, saved for resume. */
export interface HalState {
  [key: string]: unknown;
  /** Next-token comparison: which prompt. */
  next: number;
  /** Ask-it-five-times: which question. */
  sample: string;
  /** Fix-it grid: which mode is shown and which question is open. */
  mode: string;
  q: number;
  /** Scoring game: the model's confidence (%) and the penalty for a wrong answer. */
  conf: number;
  penalty: number;
}

export const initialState: HalState = {
  next: 0,
  sample: "anthem",
  mode: "plain",
  q: 1,
  conf: 30,
  penalty: 0,
};
