/** Everything a learner can change in this module, saved for resume. */
export interface EmbedState {
  [key: string]: unknown;
  picked: string | null;
  query: number;
  angle: number; // degrees
  analogy: number;
  excludeInputs: boolean;
}

export const initialState: EmbedState = {
  picked: null,
  query: 2,
  angle: 40,
  analogy: 0,
  excludeInputs: true,
};
