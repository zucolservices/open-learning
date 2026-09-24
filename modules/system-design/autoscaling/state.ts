/** Everything a learner can change in this module, saved for resume. */
export interface AutoscaleState {
  [key: string]: unknown;
  session: "memory" | "shared" | "token";
  removed: boolean;
  target: number;
  warmup: number;
  window: number;
  scheduled: boolean;
  servers: number;
  pooled: boolean;
}

export const initialState: AutoscaleState = {
  session: "memory",
  removed: false,
  target: 3,
  warmup: 2,
  window: 1,
  scheduled: false,
  servers: 1,
  pooled: false,
};
