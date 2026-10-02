/** Everything a learner can change in this module, saved for resume. */
export interface IacState {
  [key: string]: unknown;
  runs: number;
  showPlan: boolean;
  frame: number;
  choice: "none" | "revert" | "adopt";
  tool: "terraform" | "aws" | "azure" | "gcp" | "other";
}

export const initialState: IacState = {
  runs: 0,
  showPlan: false,
  frame: 0,
  choice: "none",
  tool: "terraform",
};
