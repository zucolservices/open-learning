/** Everything a learner can change in this module, saved for resume. */
export interface FTState {
  [key: string]: unknown;
  day: number;
  view: "tx" | "snap" | "acc";
  add: "sales" | "balance" | "margin";
  cls: string;
}

export const initialState: FTState = { day: 3, view: "tx", add: "balance", cls: "Wed" };
