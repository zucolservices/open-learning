export type Layout = "row" | "column";
export type QueryId = "sum" | "by-city" | "all" | "append";
export type SplitFormat = "csv" | "csv-gz" | "jsonl" | "avro" | "parquet";

/** Everything a learner can change in this module, saved for resume. */
export interface FormatsState {
  [key: string]: unknown;
  flatten: Layout;
  queryLayout: Layout;
  query: QueryId;
  encodeStage: number;
  splitFormat: SplitFormat;
  matrixFocus: string;
}

export const initialState: FormatsState = {
  flatten: "row",
  queryLayout: "row",
  query: "sum",
  encodeStage: 0,
  splitFormat: "csv",
  matrixFocus: "layout",
};
