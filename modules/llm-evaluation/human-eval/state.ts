/** Everything a learner can change in this module, saved for resume. */
export interface HumanEvalState {
  [key: string]: unknown;
  guidelines: boolean;
  calibration: boolean;
  screened: boolean;
  votes: number;
}

export const initialState: HumanEvalState = {
  guidelines: false,
  calibration: false,
  screened: false,
  votes: 400,
};
