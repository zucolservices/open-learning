import type { Attr, Measure } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface StarState {
  [key: string]: unknown;
  measure: Measure;
  by: Attr[];
  cat: string;
  er: boolean;
}

export const initialState: StarState = {
  measure: "revenue",
  by: ["store.city"],
  cat: "all",
  er: false,
};
