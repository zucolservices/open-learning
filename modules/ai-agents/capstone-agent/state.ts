/** Everything a learner can change in this module, saved for resume. */
export interface CapState {
  [key: string]: unknown;
  design: Record<string, string>;
  fixes: Record<string, string>;
}

export const initialState: CapState = { design: {}, fixes: {} };
