import type { Approval, Checks } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface DeliveryState {
  [key: string]: unknown;
  approval: Approval;
  checks: Checks;
}

export const initialState: DeliveryState = { approval: "board", checks: "basic" };
