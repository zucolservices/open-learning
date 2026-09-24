/** Everything a learner can change in this module, saved for resume. */
export interface IcebergState {
  [key: string]: unknown;
  view: "delta" | "iceberg";
  query: "day" | "amount" | "all";
  queryStep: number;
  commitStep: number;
  race: boolean;
  snapMode: "travel" | "branch";
  snapshot: number;
  wapStep: number;
  transform: "day" | "month" | "hour" | "bucket";
  hiddenMode: "hive" | "iceberg";
  evolved: boolean;
  evoQuery: "old" | "new" | "both";
  schemaOps: number;
  matchBy: "name" | "id";
  deleteMode: "cow" | "position" | "equality" | "dv";
}

export const initialState: IcebergState = {
  view: "iceberg",
  query: "day",
  queryStep: 0,
  commitStep: 0,
  race: false,
  snapMode: "travel",
  snapshot: 3,
  wapStep: 0,
  transform: "day",
  hiddenMode: "iceberg",
  evolved: false,
  evoQuery: "both",
  schemaOps: 0,
  matchBy: "id",
  deleteMode: "cow",
};
