/** Everything a learner can change in this module, saved for resume. */
export interface CapState {
  [key: string]: unknown;
  picks: Record<string, string>;
  open: string;
}

export const initialState: CapState = { picks: {}, open: "scan" };
