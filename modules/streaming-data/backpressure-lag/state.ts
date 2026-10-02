/** Everything a learner can change in this module, saved for resume. */
export interface LagState {
  [key: string]: unknown;
  partitions: 6 | 12 | 24;
  consumers: number;
  autoscale: boolean;
  prewarm: boolean;
  frame: number;
}

export const initialState: LagState = {
  partitions: 12,
  consumers: 2,
  autoscale: false,
  prewarm: false,
  frame: 0,
};
