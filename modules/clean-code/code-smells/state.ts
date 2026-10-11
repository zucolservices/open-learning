/** Everything a learner can change in this module, saved for resume. */
export interface SmellState {
  [key: string]: unknown;
  found: number[];
  fixes: Record<number, string>;
  misses: number;
}

export const initialState: SmellState = { found: [], fixes: {}, misses: 0 };
