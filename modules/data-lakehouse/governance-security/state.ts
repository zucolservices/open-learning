/** Everything a learner can change in this module, saved for resume. */
export interface GovernanceState {
  [key: string]: unknown;
  role: "analyst" | "support" | "scientist" | "admin";
  access: "direct" | "vended";
}

export const initialState: GovernanceState = {
  role: "analyst",
  access: "direct",
};
