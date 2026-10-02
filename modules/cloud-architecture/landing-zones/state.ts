/** Everything a learner can change in this module, saved for resume. */
export interface LzState {
  [key: string]: unknown;
  pieces: string[];
  cloud: "aws" | "azure" | "gcp";
  frame: number;
  tools: "aws" | "azure" | "gcp";
}

export const initialState: LzState = { pieces: [], cloud: "aws", frame: 0, tools: "aws" };
