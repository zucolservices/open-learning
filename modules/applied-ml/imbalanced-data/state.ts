/** Everything a learner can change in this module, saved for resume. */
export interface ImbState {
  [key: string]: unknown;
  rightMetrics: boolean;
  rebalance: boolean;
  costThreshold: boolean;
  smoteT: number;
}

export const initialState: ImbState = {
  rightMetrics: false,
  rebalance: false,
  costThreshold: false,
  smoteT: 0.5,
};
