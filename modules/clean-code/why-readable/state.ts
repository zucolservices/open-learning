/** Everything a learner can change in this module, saved for resume. */
export interface ReadableState {
  [key: string]: unknown;
  current: number;
  times: Record<string, number>;
  misses: Record<string, number>;
}

export const initialState: ReadableState = { current: 0, times: {}, misses: {} };
