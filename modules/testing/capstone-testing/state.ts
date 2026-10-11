/** Everything a learner can change in this module, saved for resume. */
export interface CapState {
  [key: string]: unknown;
  depths: Record<string, number>;
  techs: Record<string, string>;
  released: boolean;
}

export const initialState: CapState = { depths: {}, techs: {}, released: false };
