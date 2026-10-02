export type Change =
  "addNoDefault" | "addDefault" | "remove" | "rename" | "renameAlias" | "widen" | "retype";
export type Mode = "BACKWARD" | "FORWARD" | "FULL" | "NONE";

/** Everything a learner can change in this module, saved for resume. */
export interface SchemaState {
  [key: string]: unknown;
  change: Change;
  mode: Mode;
  frame: number;
  format: "avro" | "protobuf" | "json";
}

export const initialState: SchemaState = {
  change: "rename",
  mode: "NONE",
  frame: 0,
  format: "avro",
};
