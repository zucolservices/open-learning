import type { Arrival } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface CdcState {
  [key: string]: unknown;
  tool: "debezium" | "dms" | "datastream";
  field: string;
  mergeStep: number;
  arrival: Arrival;
  dedupe: boolean;
  guard: boolean;
  soft: boolean;
  batch: number;
  scd: "1" | "2";
  scdStep: number;
  feed: "delta" | "iceberg" | "hudi";
}

export const initialState: CdcState = {
  tool: "debezium",
  field: "op",
  mergeStep: 0,
  arrival: "ordered",
  dedupe: false,
  guard: false,
  soft: false,
  batch: 0,
  scd: "1",
  scdStep: 0,
  feed: "delta",
};
