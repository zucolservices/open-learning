/** Everything a learner can change in this module, saved for resume. */
export interface WrongState {
  [key: string]: unknown;
  c: number;
  /** The stage the learner blamed, per case. */
  picks: Record<string, string>;
  open: string;
}

export const initialState: WrongState = { c: 0, picks: {}, open: "" };
