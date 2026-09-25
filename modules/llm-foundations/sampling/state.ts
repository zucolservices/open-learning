/** Everything a learner can change in this module, saved for resume. */
export interface SampleState {
  [key: string]: unknown;
  prompt: number;
  temperature: number;
  topK: number;
  topP: number;
  seed: number;
  drawn: boolean;
  mathFrame: number;
}

export const initialState: SampleState = {
  prompt: 1,
  temperature: 1,
  topK: 0,
  topP: 1,
  seed: 1,
  drawn: false,
  mathFrame: 0,
};
