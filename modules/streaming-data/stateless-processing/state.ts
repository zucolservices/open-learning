export type Op = "success" | "large" | "mask" | "rekey" | "route";

/** Everything a learner can change in this module, saved for resume. */
export interface TopoState {
  [key: string]: unknown;
  ops: Op[];
  lang: "streams" | "flink" | "beam" | "spark";
}

export const initialState: TopoState = { ops: [], lang: "streams" };
