/** Everything a learner can change in this module, saved for resume. */
export interface RegionsState {
  [key: string]: unknown;
  design: "one" | "zones" | "regions";
  failure: "none" | "building" | "zone" | "region";
  cloud: "aws" | "gcp" | "azure";
}

export const initialState: RegionsState = { design: "one", failure: "none", cloud: "aws" };
