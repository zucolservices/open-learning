/** Everything a learner can change in this module, saved for resume. */
export interface GrievState {
  [key: string]: unknown;
  quick: boolean;
  escalate: boolean;
  feedback: boolean;
  analyse: boolean;
  fix: boolean;
}

export const initialState: GrievState = {
  quick: false,
  escalate: false,
  feedback: false,
  analyse: false,
  fix: false,
};
