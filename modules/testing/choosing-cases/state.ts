/** Everything a learner can change in this module, saved for resume. */
export interface ChoosingState {
  [key: string]: unknown;
  km: number;
  subtotal: number;
  tests: [number, number][];
}

export const initialState: ChoosingState = { km: 2, subtotal: 300, tests: [] };
