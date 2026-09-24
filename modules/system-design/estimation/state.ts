/** Everything a learner can change in this module, saved for resume. */
export interface EstimationState {
  [key: string]: unknown;
  fermi: number;
  dau: number;
  actions: number;
  writePct: number;
  peak: number;
  sizeKB: number;
  years: number;
  perServer: number;
  rung: number;
  human: boolean;
}

export const initialState: EstimationState = {
  fermi: 0,
  dau: 2,
  actions: 2,
  writePct: 1,
  peak: 2,
  sizeKB: 2,
  years: 2,
  perServer: 1,
  rung: 0,
  human: true,
};
