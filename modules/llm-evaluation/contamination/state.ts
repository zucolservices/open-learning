/** Everything a learner can change in this module, saved for resume. */
export interface ContamState {
  [key: string]: unknown;
  probed: boolean;
  pick: number;
}

export const initialState: ContamState = { probed: false, pick: 0 };
