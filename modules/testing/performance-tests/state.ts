/** Everything a learner can change in this module, saved for resume. */
export interface PerfState {
  [key: string]: unknown;
  rps: number;
  newBuild: boolean;
  budget: number;
  kind: "load" | "stress" | "spike" | "soak";
}

export const initialState: PerfState = { rps: 40, newBuild: false, budget: 200, kind: "load" };
