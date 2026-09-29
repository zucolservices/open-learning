/** Everything a learner can change in this module, saved for resume. */
export interface PromptState {
  [key: string]: unknown;
  c: number;
  only: boolean;
  idk: boolean;
  cite: boolean;
  hard: boolean;
  cell: string;
}

export const initialState: PromptState = {
  c: 1,
  only: false,
  idk: false,
  cite: false,
  hard: true,
  cell: "3-20",
};
