/** Everything a learner can change in this module, saved for resume. */
export interface BreachState {
  [key: string]: unknown;
  answers: Record<string, string>;
  at: number;
  items: string[];
}

export const initialState: BreachState = { answers: {}, at: 0, items: ["a"] };
