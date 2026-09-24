import type { LayoutId } from "./layout";

/** Everything a learner can change in this module, saved for resume. */
export interface SkippingState {
  [key: string]: unknown;
  labLayout: LayoutId;
  labQuery: string;
  rowsPerFile: number;
  showPath: boolean;
  statsLayout: "arrival" | "clustered";
  bloomMode: "minmax" | "bloom";
  maintain: "delta" | "iceberg" | "hudi";
}

export const initialState: SkippingState = {
  labLayout: "arrival",
  labQuery: "customer",
  rowsPerFile: 40,
  showPath: false,
  statsLayout: "arrival",
  bloomMode: "minmax",
  maintain: "delta",
};
