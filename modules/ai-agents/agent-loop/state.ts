/** Everything a learner can change in this module, saved for resume. */
export interface LoopState {
  [key: string]: unknown;
  frame: number;
  maxTurns: number;
  stuck: boolean;
}

export const initialState: LoopState = { frame: 0, maxTurns: 10, stuck: true };
