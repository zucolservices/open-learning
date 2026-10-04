import type { Crash } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface DurableState {
  [key: string]: unknown;
  crash: Crash;
  checkpoints: boolean;
  idem: boolean;
}

export const initialState: DurableState = { crash: "mid-refund", checkpoints: false, idem: false };
