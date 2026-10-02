/** Everything a learner can change in this module, saved for resume. */
export interface RtState {
  [key: string]: unknown;
  frame: number;
  store: string;
}

export const initialState: RtState = { frame: 0, store: "clickhouse" };
