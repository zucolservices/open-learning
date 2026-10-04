/** Everything a learner can change in this module, saved for resume. */
export interface IKState {
  [key: string]: unknown;
  month: number;
  prop: number;
}

export const initialState: IKState = { month: 4, prop: 0 };
