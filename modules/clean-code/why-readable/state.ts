/** Everything a learner can change in this module, saved for resume. */
export interface ReadableState {
  [key: string]: unknown;
  version: number;
  times: Record<string, number>;
  misses: Record<string, number>;
}

export const initialState: ReadableState = { version: 0, times: {}, misses: {} };
