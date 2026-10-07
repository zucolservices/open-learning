/** Everything a learner can change in this module, saved for resume. */
export interface InjState {
  [key: string]: unknown;
  picks: Record<string, string>;
  interp: number;
}

export const initialState: InjState = { picks: {}, interp: 2 };
