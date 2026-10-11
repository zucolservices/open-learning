/** Everything a learner can change in this module, saved for resume. */
export interface RefactorState {
  [key: string]: unknown;
  mode: "small" | "leap";
  step: number;
  leapt: boolean;
}

export const initialState: RefactorState = { mode: "small", step: 0, leapt: false };
