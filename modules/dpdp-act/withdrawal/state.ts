/** Everything a learner can change in this module, saved for resume. */
export interface WithdrawState {
  [key: string]: unknown;
  hop: number;
  exit: string;
}

export const initialState: WithdrawState = { hop: 0, exit: "email" };
