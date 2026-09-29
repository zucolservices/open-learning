/** Everything a learner can change in this module, saved for resume. */
export interface GraphState {
  [key: string]: unknown;
  tab: "extract" | "connect" | "group";
  note: string;
  comm: number;
  q: "global" | "local";
}

export const initialState: GraphState = { tab: "extract", note: "G-125", comm: 0, q: "global" };
