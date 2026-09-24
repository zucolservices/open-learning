/** Everything a learner can change in this module, saved for resume. */
export interface SaleState {
  [key: string]: unknown;
  raceFrame: number;
  approach: "naive" | "lock" | "conditional" | "counter" | "room";
  expiry: boolean;
  minute: number; // index into MINUTES
}

export const initialState: SaleState = {
  raceFrame: 0,
  approach: "naive",
  expiry: false,
  minute: 0,
};
