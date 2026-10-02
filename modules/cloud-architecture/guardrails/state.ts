export type Mode = "off" | "detect" | "prevent" | "fix";

/** Everything a learner can change in this module, saved for resume. */
export interface GuardState {
  [key: string]: unknown;
  cloud: "aws" | "azure" | "gcp";
  publicMode: Mode;
  regionMode: Mode;
  tagMode: Mode;
  codeCloud: "aws" | "azure" | "gcp";
  fixPublic: boolean;
  fixTag: boolean;
}

export const initialState: GuardState = {
  cloud: "aws",
  publicMode: "off",
  regionMode: "off",
  tagMode: "off",
  codeCloud: "aws",
  fixPublic: false,
  fixTag: false,
};
