import type { SimAction, TableType } from "./data";

/** Everything a learner can change in this module, saved for resume. */
export interface HudiState {
  [key: string]: unknown;
  railStep: number;
  crash: boolean;
  routeStep: number;
  simType: TableType;
  simLog: SimAction[];
  queryType: "snapshot" | "ro" | "incremental";
  queryCompacted: boolean;
  incRuns: number;
  indexType: "bloom" | "simple" | "bucket" | "record";
}

export const initialState: HudiState = {
  railStep: 0,
  crash: false,
  routeStep: 0,
  simType: "mor",
  simLog: [],
  queryType: "snapshot",
  queryCompacted: false,
  incRuns: 0,
  indexType: "simple",
};
