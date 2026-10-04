/** Everything a learner can change in this module, saved for resume. */
export interface AgreementState {
  [key: string]: unknown;
  version: string;
  po: number;
  passRate: number;
}

export const initialState: AgreementState = { version: "lazy", po: 0.9, passRate: 0.9 };
