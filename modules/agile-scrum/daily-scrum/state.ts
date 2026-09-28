/** Everything a learner can change in this module, saved for resume. */
export interface DailyState {
  [key: string]: unknown;
  at: number;
  smell: Record<string, string>;
  fix: Record<string, string>;
}

export const initialState: DailyState = { at: 0, smell: {}, fix: {} };
