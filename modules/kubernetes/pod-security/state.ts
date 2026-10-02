export type Level = "privileged" | "baseline" | "restricted";

/** Everything a learner can change in this module, saved for resume. */
export interface PsState {
  [key: string]: unknown;
  on: string[];
  level: Level;
  mode: "enforce" | "warn";
}

export const initialState: PsState = { on: ["root"], level: "baseline", mode: "enforce" };
