import type { DataKind, Region } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface BorderState {
  [key: string]: unknown;
  routes: Record<DataKind, Region>;
}

export const initialState: BorderState = {
  routes: {
    profiles: "india",
    payments: "india",
    logs: "india",
    backup: "india",
    analytics: "india",
  },
};
