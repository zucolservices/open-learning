/** Everything a learner can change in this module, saved for resume. */
export interface IngestionState {
  [key: string]: unknown;
  mode: "batch" | "micro" | "continuous";
  intervalIdx: number;
  rateIdx: number;
  onceStep: number;
  onceSafe: boolean;
}

export const initialState: IngestionState = {
  mode: "batch",
  intervalIdx: 5,
  rateIdx: 1,
  onceStep: 0,
  onceSafe: false,
};
