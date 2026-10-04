/** Everything a learner can change in this module, saved for resume. */
export interface ToolsMapState {
  [key: string]: unknown;
  need: string;
  osiOnly: boolean;
}

export const initialState: ToolsMapState = { need: "ci", osiOnly: false };
