/** Everything a learner can change in this module, saved for resume. */
export interface ConsistencyState {
  [key: string]: unknown;
  choice: "" | "refuse" | "accept";
  frame: number;
  model: "linearizable" | "causal" | "eventual";
  n: number;
  w: number;
  r: number;
  down: number;
  merge: "lww" | "merge";
}

export const initialState: ConsistencyState = {
  choice: "",
  frame: 0,
  model: "linearizable",
  n: 3,
  w: 2,
  r: 1,
  down: 0,
  merge: "lww",
};
