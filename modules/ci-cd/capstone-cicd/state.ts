/** Everything a learner can change in this module, saved for resume. */
export interface CapState {
  [key: string]: unknown;
  choices: Record<string, string>;
  incident: string;
}

export const initialState: CapState = { choices: {}, incident: "commit" };
