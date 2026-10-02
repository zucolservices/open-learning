/** Everything a learner can change in this module, saved for resume. */
export interface WorkloadIdState {
  [key: string]: unknown;
  frame: number;
  place: "vm" | "k8s" | "fn" | "ci" | "other";
  cloud: "aws" | "azure" | "gcp";
  sub: "none" | "org" | "main";
}

export const initialState: WorkloadIdState = { frame: 0, place: "vm", cloud: "aws", sub: "none" };
