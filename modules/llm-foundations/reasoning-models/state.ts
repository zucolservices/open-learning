/** Everything a learner can change in this module, saved for resume. */
export interface ReasonState {
  [key: string]: unknown;
  traceFrame: number;
  task: "lookup" | "maths" | "writing";
  budget: number; // index into BUDGETS
  rlFrame: number;
}

export const initialState: ReasonState = { traceFrame: 0, task: "maths", budget: 0, rlFrame: 0 };
