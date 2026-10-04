/** Everything a learner can change in this module, saved for resume. */
export interface LineageState {
  [key: string]: unknown;
  inspected: string[];
  mode: "up" | "down";
}

export const initialState: LineageState = { inspected: ["dash"], mode: "up" };
