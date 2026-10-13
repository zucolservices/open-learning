/** Everything a learner can change in this module, saved for resume. */
export interface FeatState {
  [key: string]: unknown;
  acc: string;
  every: string;
  batch: boolean;
  adaptive: boolean;
  progress: number;
}

export const initialState: FeatState = {
  acc: "high",
  every: "1",
  batch: false,
  adaptive: false,
  progress: 85,
};
