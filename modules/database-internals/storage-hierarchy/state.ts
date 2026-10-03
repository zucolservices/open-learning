import type { Device, Fetch } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ShState {
  [key: string]: unknown;
  humanScale: boolean;
  fetch: Fetch;
  device: Device;
}

export const initialState: ShState = { humanScale: true, fetch: "one", device: "ssd" };
