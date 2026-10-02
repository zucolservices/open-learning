/** Everything a learner can change in this module, saved for resume. */
export interface CfgState {
  [key: string]: unknown;
  decoded: boolean;
  protections: string[];
}

export const initialState: CfgState = { decoded: false, protections: [] };
