export type Fail = "none" | "stock" | "payment" | "delivery";
export type Mode = "orchestration" | "choreography";

/** Everything a learner can change in this module, saved for resume. */
export interface PatternState {
  [key: string]: unknown;
  upTo: number;
  snapshot: boolean;
  posted: number;
  fail: Fail;
  mode: Mode;
  sagaFrame: number;
}

export const initialState: PatternState = {
  upTo: 6,
  snapshot: false,
  posted: 0,
  fail: "payment",
  mode: "orchestration",
  sagaFrame: 0,
};
