export type Saved = "together" | "separate" | "memory";

/** Everything a learner can change in this module, saved for resume. */
export interface CkState {
  [key: string]: unknown;
  saved: Saved;
  transactional: boolean;
  frame: number;
}

export const initialState: CkState = { saved: "together", transactional: false, frame: 0 };
