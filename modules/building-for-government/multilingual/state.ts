/** Everything a learner can change in this module, saved for resume. */
export interface LangState {
  [key: string]: unknown;
  lang: string;
  fixes: string[];
}

export const initialState: LangState = { lang: "ta", fixes: [] };
