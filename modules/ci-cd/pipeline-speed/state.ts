import type { Levers } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface SpeedState {
  [key: string]: unknown;
  levers: Levers;
  shards: number;
}

export const initialState: SpeedState = {
  levers: { cache: false, parallel: false, shard: false, timing: false, affected: false },
  shards: 1,
};
