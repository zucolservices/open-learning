/** Everything a learner can change in this module, saved for resume. */
export interface TxState {
  [key: string]: unknown;
  approach: "2pc" | "saga";
  failure: "none" | "stock" | "coordinator";
  frame: number;
  outbox: boolean;
  dedupe: boolean;
  crash: "after-db" | "after-publish" | "twice";
}

export const initialState: TxState = {
  approach: "2pc",
  failure: "none",
  frame: 0,
  outbox: false,
  dedupe: false,
  crash: "after-db",
};
