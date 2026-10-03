import type { Style, Task } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface StylesState {
  [key: string]: unknown;
  style: Style;
  task: Task;
}

export const initialState: StylesState = { style: "rest", task: "show" };
