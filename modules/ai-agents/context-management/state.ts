/** Everything a learner can change in this module, saved for resume. */
export interface CtxState {
  [key: string]: unknown;
  compact: boolean;
  threshold: number;
  notes: boolean;
  subagents: boolean;
}

export const initialState: CtxState = {
  compact: false,
  threshold: 80,
  notes: false,
  subagents: false,
};
