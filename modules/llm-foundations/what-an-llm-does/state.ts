/** Everything a learner can change in this module, saved for resume. */
export interface LlmState {
  [key: string]: unknown;
  words: string[];
  context: 1 | 2;
  seed: number;
  chatFrame: number;
}

export const initialState: LlmState = { words: ["the"], context: 2, seed: 1, chatFrame: 0 };
