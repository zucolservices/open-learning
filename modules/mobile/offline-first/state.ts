import { START, type World } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface OfflineState {
  [key: string]: unknown;
  world: World;
  mode: string;
  strategy: string;
}

export const initialState: OfflineState = { world: START, mode: "offline-first", strategy: "lww" };
