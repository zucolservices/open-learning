/** Everything a learner can change in this module, saved for resume. */
export interface AttnState {
  [key: string]: unknown;
  sentence: number;
  head: "who" | "previous" | "pattern" | "rest";
  row: number | null;
  qkvFrame: number;
}

export const initialState: AttnState = { sentence: 0, head: "who", row: 7, qkvFrame: 0 };
