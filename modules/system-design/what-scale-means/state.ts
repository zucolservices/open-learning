/** Everything a learner can change in this module, saved for resume. */
export interface ScaleState {
  [key: string]: unknown;
  strategy: "up" | "out";
  load: number;
}

export const initialState: ScaleState = { strategy: "up", load: 0 };
