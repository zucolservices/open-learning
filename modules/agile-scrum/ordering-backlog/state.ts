import type { OrderingId } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface OrderState {
  [key: string]: unknown;
  ordering: OrderingId;
  /** The learner's own order (item ids). */
  mine: string[];
}

export const initialState: OrderState = { ordering: "arrival", mine: [] };
