/** Everything a learner can change in this module, saved for resume. */
export interface McpState {
  [key: string]: unknown;
  frame: number;
  apps: number;
  tools: number;
}

export const initialState: McpState = { frame: 0, apps: 5, tools: 8 };
