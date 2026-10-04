/** Everything a learner can change in this module, saved for resume. */
export interface HitlState {
  [key: string]: unknown;
  threshold: number;
  newVendors: boolean;
  role: number;
}

export const initialState: HitlState = { threshold: 0, newVendors: false, role: 3 };
