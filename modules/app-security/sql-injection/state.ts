import type { InputKind, Mode } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface SqlState {
  [key: string]: unknown;
  input: InputKind;
  mode: Mode;
  orm: "builder" | "raw";
}

export const initialState: SqlState = { input: "normal", mode: "concat", orm: "builder" };
