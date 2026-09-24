export type IncidentId = "mid-write" | "crash" | "overwrite";

/** Everything a learner can change in this module, saved for resume. */
export interface TableState {
  [key: string]: unknown;
  asTable: boolean;
  hiveStep: number;
  incident: IncidentId;
  time: number;
  withLog: boolean;
  fix: string;
}

export const initialState: TableState = {
  asTable: false,
  hiveStep: 0,
  incident: "mid-write",
  time: 0,
  withLog: false,
  fix: "atomic",
};
