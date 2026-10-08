/** Everything a learner can change in this module, saved for resume. */
export interface ScopeState {
  [key: string]: unknown;
  current: string;
  guesses: Record<string, "in" | "out">;
  border: string;
}

export const initialState: ScopeState = { current: "saas", guesses: {}, border: "shop" };
