/** Everything a learner can change in this module, saved for resume. */
export interface AntiState {
  [key: string]: unknown;
  target: boolean;
  at: number;
  names: Record<string, string>;
  fixes: Record<string, number>;
}

export const initialState: AntiState = { target: false, at: 0, names: {}, fixes: {} };
