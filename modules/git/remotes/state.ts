import { start, type PullMode, type World } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface RemoteState {
  [key: string]: unknown;
  world: World;
  mode: PullMode;
  log: string[];
}

export const initialState: RemoteState = { world: start(), mode: "unset", log: [] };
