/** Everything a learner can change in this module, saved for resume. */
export interface PodState {
  [key: string]: unknown;
  sidecar: boolean;
  init: boolean;
  volume: boolean;
  sidecarPort: number;
  frame: number;
}

export const initialState: PodState = {
  sidecar: false,
  init: false,
  volume: false,
  sidecarPort: 9090,
  frame: 0,
};
