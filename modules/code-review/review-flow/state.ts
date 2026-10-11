/** Everything a learner can change in this module, saved for resume. */
export interface FlowState {
  [key: string]: unknown;
  stage: number;
  platform: "github" | "gitlab" | "gerrit" | "azure";
}

export const initialState: FlowState = { stage: 0, platform: "github" };
