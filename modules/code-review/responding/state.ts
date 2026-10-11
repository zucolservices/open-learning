/** Everything a learner can change in this module, saved for resume. */
export interface RespondState {
  [key: string]: unknown;
  replies: Record<string, number>;
}

export const initialState: RespondState = { replies: {} };
