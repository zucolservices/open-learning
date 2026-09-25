/** Everything a learner can change in this module, saved for resume. */
export interface SmallState {
  [key: string]: unknown;
  /** Distillation walkthrough frame. */
  distil: number;
  /** Cascade: confidence threshold index. */
  threshold: number;
}

export const initialState: SmallState = { distil: 0, threshold: 3 };
