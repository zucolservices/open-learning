/** Everything a learner can change in this module, saved for resume. */
export interface BattState {
  [key: string]: unknown;
  good: Record<string, boolean>;
  small: boolean;
  release: boolean;
}

export const initialState: BattState = { good: {}, small: false, release: false };
