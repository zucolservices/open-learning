export type Kind = "tumbling" | "hopping" | "sliding" | "session";

/** Everything a learner can change in this module, saved for resume. */
export interface WinState {
  [key: string]: unknown;
  kind: Kind;
  lateness: 0 | 5;
  emit: "update" | "close";
  frame: number;
}

export const initialState: WinState = { kind: "tumbling", lateness: 0, emit: "update", frame: 0 };
