/** Everything a learner can change in this module, saved for resume. */
export interface IacState {
  [key: string]: unknown;
  pick: string;
  fix: string;
  frame: number;
}

export const initialState: IacState = { pick: "", fix: "", frame: 0 };
