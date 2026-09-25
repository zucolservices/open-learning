/** Everything a learner can change in this module, saved for resume. */
export interface ServeState {
  [key: string]: unknown;
  /** Serving simulator. */
  rate: number;
  slots: number;
  mode: "static" | "continuous";
  /** KV memory walkthrough: reserved vs paged. */
  paged: boolean;
}

export const initialState: ServeState = { rate: 8, slots: 8, mode: "static", paged: false };
