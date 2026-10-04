import type { PathId } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface TransportState {
  [key: string]: unknown;
  path: PathId;
  loss: number;
}

export const initialState: TransportState = { path: "webrtc", loss: 0 };
