/** Everything a learner can change in this module, saved for resume. */
export interface EvoState {
  [key: string]: unknown;
  stage: number;
  pick: string;
  broke: boolean;
  name: number;
}

export const initialState: EvoState = { stage: 0, pick: "", broke: false, name: 0 };
