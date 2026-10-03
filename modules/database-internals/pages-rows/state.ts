import type { Slot } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface PageState {
  [key: string]: unknown;
  slots: Slot[];
  note: string;
}

export const initialState: PageState = {
  slots: [
    { n: 1, size: 100, state: "live", label: "ord_1" },
    { n: 2, size: 100, state: "live", label: "ord_2" },
    { n: 3, size: 100, state: "live", label: "ord_3" },
  ],
  note: "A fresh page with three orders.",
};
