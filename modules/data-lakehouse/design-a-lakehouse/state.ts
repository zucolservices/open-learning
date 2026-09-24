/** Everything a learner can change in this module, saved for resume. */
export interface DesignState {
  [key: string]: unknown;
  choices: Record<string, string>;
  current: number;
}

export const initialState: DesignState = { choices: {}, current: 0 };
