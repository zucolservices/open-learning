/** Everything a learner can change in this module, saved for resume. */
export interface PipeState {
  [key: string]: unknown;
  frame: number;
  gb: number;
  dropDebug: boolean;
  sampleHealth: boolean;
  hotDays: 7 | 15 | 30;
}

export const initialState: PipeState = {
  frame: 0,
  gb: 200,
  dropDebug: false,
  sampleHealth: false,
  hotDays: 15,
};
