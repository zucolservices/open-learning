/** Everything a learner can change in this module, saved for resume. */
export interface StoriesState {
  [key: string]: unknown;
  frame: number;
  at: number;
  /** Chosen rewrite per weak story. */
  rewrite: Record<string, string>;
  /** Chosen Given/When/Then option per part. */
  gwt: Record<string, string>;
}

export const initialState: StoriesState = { frame: 0, at: 0, rewrite: {}, gwt: {} };
