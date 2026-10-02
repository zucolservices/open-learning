/** Everything a learner can change in this module, saved for resume. */
export interface TreeState {
  [key: string]: unknown;
  placed: Record<string, string>;
  selected: string;
  cloud: "aws" | "azure" | "gcp";
  override: boolean;
  names: "aws" | "azure" | "gcp";
}

export const initialState: TreeState = {
  placed: {},
  selected: "portal-prod",
  cloud: "aws",
  override: false,
  names: "aws",
};
