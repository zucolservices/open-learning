/** Everything a learner can change in this module, saved for resume. */
export interface TimeState {
  [key: string]: unknown;
  by: "processing" | "event";
  bound: number;
  now: number;
  frame: number;
}

export const initialState: TimeState = { by: "processing", bound: 2, now: 70, frame: 0 };
