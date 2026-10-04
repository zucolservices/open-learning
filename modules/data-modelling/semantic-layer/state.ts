import type { Def } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface SemState {
  [key: string]: unknown;
  layer: boolean;
  def: Def;
  lang: "mf" | "lookml";
}

export const initialState: SemState = {
  layer: false,
  def: { window: "month", refunds: false, min: 1 },
  lang: "mf",
};
