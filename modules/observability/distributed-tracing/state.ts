/** Everything a learner can change in this module, saved for resume. */
export interface TraceState {
  [key: string]: unknown;
  frame: number;
  pick: string;
  part: number;
}

export const initialState: TraceState = { frame: 0, pick: "", part: 1 };
