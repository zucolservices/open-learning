/** Everything a learner can change in this module, saved for resume. */
export interface GrpcState {
  [key: string]: unknown;
  change: string | null;
}

export const initialState: GrpcState = { change: null };
