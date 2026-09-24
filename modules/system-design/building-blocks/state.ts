/** Everything a learner can change in this module, saved for resume. */
export interface BlocksState {
  [key: string]: unknown;
  platform: "concept" | "aws" | "gcp" | "azure" | "oss";
  picked: string | null;
  model: "vm" | "managed" | "serverless";
}

export const initialState: BlocksState = { platform: "concept", picked: null, model: "vm" };
