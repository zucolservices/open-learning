/** Everything a learner can change in this module, saved for resume. */
export interface CapState {
  [key: string]: unknown;
  fixes: Record<string, "good" | "bad">;
  open: string;
  drill: Record<string, string>;
  at: number;
}

export const initialState: CapState = { fixes: {}, open: "map", drill: {}, at: 0 };
