export type Query = "count" | "sum" | "filter" | "window";

/** Everything a learner can change in this module, saved for resume. */
export interface SqlState {
  [key: string]: unknown;
  query: Query;
  n: number;
  encoding: "retract" | "upsert";
  engine: string;
}

export const initialState: SqlState = {
  query: "count",
  n: 3,
  encoding: "retract",
  engine: "flink",
};
