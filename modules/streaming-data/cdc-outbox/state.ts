export type Mode = "dual" | "reverse" | "outbox";
export type Failure = "none" | "broker" | "crash" | "replay";

/** Everything a learner can change in this module, saved for resume. */
export interface CdcState {
  [key: string]: unknown;
  mode: Mode;
  failure: Failure;
  op: "c" | "u" | "d";
  db: "mysql" | "postgres" | "sqlserver" | "oracle" | "mongodb";
}

export const initialState: CdcState = { mode: "dual", failure: "broker", op: "u", db: "postgres" };
