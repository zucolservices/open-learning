/** Everything a learner can change in this module, saved for resume. */
export interface ServingState {
  [key: string]: unknown;
  semantic: boolean;
  asOf: boolean;
  sync: boolean;
  acl: boolean;
  asker: "agent" | "manager";
  question: "refund" | "salary";
}

export const initialState: ServingState = {
  semantic: false,
  asOf: false,
  sync: false,
  acl: false,
  asker: "agent",
  question: "refund",
};
