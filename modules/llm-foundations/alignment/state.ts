/** Everything a learner can change in this module, saved for resume. */
export interface AlignState {
  [key: string]: unknown;
  choices: ("a" | "b" | null)[];
  crowd: "typical" | "guided";
  frame: number;
}

export const initialState: AlignState = {
  choices: [null, null, null, null],
  crowd: "typical",
  frame: 0,
};
