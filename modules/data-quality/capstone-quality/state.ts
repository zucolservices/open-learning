/** Everything a learner can change in this module, saved for resume. */
export interface CapState {
  [key: string]: unknown;
  actions: string[];
  hypothesis: string | null;
  picks: string[];
  defences: string[];
}

export const initialState: CapState = { actions: [], hypothesis: null, picks: [], defences: [] };
