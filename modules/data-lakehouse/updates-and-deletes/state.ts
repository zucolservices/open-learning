/** Everything a learner can change in this module, saved for resume. */
export interface UpdatesState {
  [key: string]: unknown;
  typoMode: "reprint" | "errata";
  typos: number;
  anatomyStep: number;
  anatomyMode: "cow" | "mor";
  family: "dv" | "position" | "equality" | "log";
  /** Slider positions are log-scale exponents. */
  updatesExp: number; // 10^x updated rows per hour
  readsExp: number; // 10^x reads per hour
  spread: "random" | "clustered";
  compactEvery: number;
  sawCompact: number;
  eraseStep: number;
}

export const initialState: UpdatesState = {
  typoMode: "reprint",
  typos: 1,
  anatomyStep: 0,
  anatomyMode: "cow",
  family: "dv",
  updatesExp: 3,
  readsExp: 1,
  spread: "random",
  compactEvery: 6,
  sawCompact: 6,
  eraseStep: 0,
};
