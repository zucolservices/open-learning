/** Everything a learner can change in this module, saved for resume. */
export interface BgState {
  [key: string]: unknown;
  approach: string;
  idle: boolean;
  allowed: boolean;
}

export const initialState: BgState = { approach: "poll", idle: false, allowed: true };
