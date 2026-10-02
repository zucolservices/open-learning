/** Everything a learner can change in this module, saved for resume. */
export interface PlatformState {
  [key: string]: unknown;
  linux: number;
  mac: number;
}

export const initialState: PlatformState = { linux: 20000, mac: 0 };
