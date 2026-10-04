/** Everything a learner can change in this module, saved for resume. */
export interface SystemsState {
  [key: string]: unknown;
  rag: string;
  run: string;
}

export const initialState: SystemsState = { rag: "good", run: "expected" };
