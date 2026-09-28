/** Everything a learner can change in this module, saved for resume. */
export interface ToolsState {
  [key: string]: unknown;
  tool: string;
  slot: string;
}

export const initialState: ToolsState = { tool: "jira", slot: "" };
