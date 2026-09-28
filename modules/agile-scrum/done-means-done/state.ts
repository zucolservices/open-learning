/** Everything a learner can change in this module, saved for resume. */
export interface DoneState {
  [key: string]: unknown;
  dod: string[];
  fix: boolean;
  quad: number;
}

export const initialState: DoneState = { dod: [], fix: false, quad: -1 };
