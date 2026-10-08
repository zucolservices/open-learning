/** Everything a learner can change in this module, saved for resume. */
export interface GrievState {
  [key: string]: unknown;
  stage: number;
  event: "none" | "death" | "incapacity";
}

export const initialState: GrievState = { stage: 0, event: "none" };
