import type { Arch, Port } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface HexState {
  [key: string]: unknown;
  arch: Arch;
  picks: Record<Port, number>;
}

export const initialState: HexState = { arch: "layered", picks: { input: 0, store: 0, notify: 0 } };
