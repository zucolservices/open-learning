/** Everything a learner can change in this module, saved for resume. */
export interface GroupState {
  [key: string]: unknown;
  consumers: number;
  rate: number;
  protocol: "eager" | "cooperative";
  frame: number;
  commitFirst: boolean;
}

export const initialState: GroupState = {
  consumers: 2,
  rate: 10,
  protocol: "eager",
  frame: 0,
  commitFirst: false,
};
