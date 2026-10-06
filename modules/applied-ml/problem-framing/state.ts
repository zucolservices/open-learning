/** Everything a learner can change in this module, saved for resume. */
export interface FramingState {
  [key: string]: unknown;
  picks: Record<string, string>;
  rate: number;
}

export const initialState: FramingState = { picks: {}, rate: 0.08 };
