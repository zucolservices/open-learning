/** Everything a learner can change in this module, saved for resume. */
export interface RlState {
  [key: string]: unknown;
  placed: string[]; // pod kinds added, in order
  cpuDemand: number; // millicores
  memDemand: number; // MiB
  limits: boolean;
  frame: number;
}

export const initialState: RlState = {
  placed: [],
  cpuDemand: 300,
  memDemand: 320,
  limits: true,
  frame: 0,
};
