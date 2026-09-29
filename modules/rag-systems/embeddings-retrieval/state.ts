/** Everything a learner can change in this module, saved for resume. */
export interface EmbState {
  [key: string]: unknown;
  model: string;
  q: number;
  lang: number;
}

export const initialState: EmbState = { model: "minilm", q: 0, lang: 1 };
