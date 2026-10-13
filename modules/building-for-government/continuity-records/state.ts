/** Everything a learner can change in this module, saved for resume. */
export interface ContState {
  [key: string]: unknown;
  backup: string;
  recovery: string;
  logs: string;
}

export const initialState: ContState = { backup: "same", recovery: "rebuild", logs: "local" };
