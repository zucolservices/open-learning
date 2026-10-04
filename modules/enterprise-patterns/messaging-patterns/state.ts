import type { Channel } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface MsgState {
  [key: string]: unknown;
  channel: Channel;
  poison: boolean;
  dup: boolean;
  idem: boolean;
}

export const initialState: MsgState = { channel: "p2p", poison: false, dup: false, idem: false };
