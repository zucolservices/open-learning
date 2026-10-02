export type Buy = "od" | "sp1" | "sp3" | "spot";

/** Everything a learner can change in this module, saved for resume. */
export interface CostState {
  [key: string]: unknown;
  buys: Record<string, Buy>;
  fixed: string[];
  tagged: boolean;
}

export const initialState: CostState = {
  buys: { web: "od", peak: "od", batch: "od" },
  fixed: [],
  tagged: false,
};
