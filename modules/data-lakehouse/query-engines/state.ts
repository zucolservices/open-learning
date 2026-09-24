import type { CustFilter, DateFilter } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface EnginesState {
  [key: string]: unknown;
  date: DateFilter;
  customer: CustFilter;
  clustered: boolean;
  columns: number;
  exec: "row" | "vector";
  planNode: string;
  engine: string;
  engineGroup: "all" | "oss" | "single" | "managed";
}

export const initialState: EnginesState = {
  date: "none",
  customer: "none",
  clustered: false,
  columns: 25,
  exec: "row",
  planNode: "scan",
  engine: "spark",
  engineGroup: "all",
};
