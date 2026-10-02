/** Everything a learner can change in this module, saved for resume. */
export interface JoinState {
  [key: string]: unknown;
  upTo: number;
  join: "table" | "window";
  kind: "inner" | "left";
  bounded: boolean;
  minutes: number;
}

export const initialState: JoinState = {
  upTo: 3,
  join: "table",
  kind: "inner",
  bounded: true,
  minutes: 60,
};
