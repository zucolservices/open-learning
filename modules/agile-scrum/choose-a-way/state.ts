/** Everything a learner can change in this module, saved for resume. */
export interface WayState {
  [key: string]: unknown;
  choices: Record<string, string>;
  at: number;
}

export const initialState: WayState = { choices: {}, at: 0 };
