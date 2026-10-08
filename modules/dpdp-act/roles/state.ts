import type { Role, VendorMode } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface RolesState {
  [key: string]: unknown;
  picks: Record<string, Role>;
  vendor: VendorMode;
  chain: number;
}

export const initialState: RolesState = { picks: {}, vendor: "instructions", chain: 0 };
