/** Everything a learner can change in this module, saved for resume. */
export interface AgentState {
  [key: string]: unknown;
  frame: number;
  run: string;
  mcp: number;
}

export const initialState: AgentState = { frame: 0, run: "loop", mcp: 0 };
