/** Everything a learner can change in this module, saved for resume. */
export interface ChartsState {
  [key: string]: unknown;
  chart: number;
  /** Show the reading guide overlay. */
  guide: boolean;
  /** Diagnosis chosen per chart. */
  dx: Record<string, string>;
}

export const initialState: ChartsState = { chart: 0, guide: false, dx: {} };
