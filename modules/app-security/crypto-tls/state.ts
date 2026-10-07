/** Everything a learner can change in this module, saved for resume. */
export interface TlsState {
  [key: string]: unknown;
  https: boolean;
  step: number;
  picks: Record<string, boolean>;
}

export const initialState: TlsState = { https: false, step: 0, picks: {} };
