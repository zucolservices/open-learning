/** Everything a learner can change in this module, saved for resume. */
export interface LeakState {
  [key: string]: unknown;
  removed: string[];
  prepInside: boolean;
  pick: string | null;
  demoInside: boolean;
}

export const initialState: LeakState = {
  removed: [],
  prepInside: false,
  pick: null,
  demoInside: false,
};
