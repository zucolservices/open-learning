/** Everything a learner can change in this module, saved for resume. */
export interface AgentState {
  [key: string]: unknown;
  level: number;
}

export const initialState: AgentState = { level: 3 };
