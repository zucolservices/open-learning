/** Everything a learner can change in this module, saved for resume. */
export interface EddState {
  [key: string]: unknown;
  ci: boolean;
  gate: number;
  grouped: boolean;
}

export const initialState: EddState = { ci: false, gate: 98, grouped: false };
