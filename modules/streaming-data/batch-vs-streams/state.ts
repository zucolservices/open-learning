export type Cadence = "nightly" | "hourly" | "five" | "event";

/** Everything a learner can change in this module, saved for resume. */
export interface BvsState {
  [key: string]: unknown;
  cadence: Cadence;
  tier: number;
  year: number;
}

export const initialState: BvsState = { cadence: "nightly", tier: 1, year: 0 };
