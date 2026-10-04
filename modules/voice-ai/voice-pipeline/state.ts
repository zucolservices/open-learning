import type { Arch } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface PipeState {
  [key: string]: unknown;
  frame: number;
  arch: Arch;
}

export const initialState: PipeState = { frame: 0, arch: "cascade" };
