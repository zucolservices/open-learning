/** Everything a learner can change in this module, saved for resume. */
export interface LatencyState {
  [key: string]: unknown;
  util: number; // index into UTILS
  visitRequests: number; // index
  servers: number; // index
  pSlow: number; // index
  hedge: boolean;
  rate: number; // index
  time: number; // index
}

export const initialState: LatencyState = {
  util: 3,
  visitRequests: 2,
  servers: 3,
  pSlow: 0,
  hedge: false,
  rate: 2,
  time: 2,
};
