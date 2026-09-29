/** Everything a learner can change in this module, saved for resume. */
export interface ContextState {
  [key: string]: unknown;
  q: number;
  mode: "plain" | "head" | "ctx";
  bq: number;
  big: boolean;
}

export const initialState: ContextState = { q: 1, mode: "plain", bq: 1, big: false };
