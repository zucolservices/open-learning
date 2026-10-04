/** Everything a learner can change in this module, saved for resume. */
export interface ProtoState {
  [key: string]: unknown;
  frame: number;
}

export const initialState: ProtoState = { frame: 0 };
