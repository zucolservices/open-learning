/** Everything a learner can change in this module, saved for resume. */
export interface SchedState {
  [key: string]: unknown;
  ssd: boolean;
  tolerate: boolean;
  anti: boolean;
  preferA: boolean;
  big: boolean;
  spread: boolean;
  zoneDown: boolean;
}

export const initialState: SchedState = {
  ssd: false,
  tolerate: false,
  anti: false,
  preferA: false,
  big: false,
  spread: false,
  zoneDown: false,
};
